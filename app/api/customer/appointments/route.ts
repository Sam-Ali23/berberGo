import { getApiSessionUser } from "@/lib/auth";
import { appointmentInclude, getCustomerAppointments, serializeAppointment } from "@/lib/data";
import { apiError, apiSuccess } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const auth = await getApiSessionUser(["CUSTOMER"]);

  if ("error" in auth) {
    return auth.error;
  }

  const body = await request.json();
  const result = appointmentSchema.safeParse(body);

  if (!result.success) {
    return apiError("بيانات الحجز غير مكتملة.", 400, result.error.flatten());
  }

  const appointmentDate = new Date(`${result.data.appointmentDate}T00:00:00.000Z`);

  if (Number.isNaN(appointmentDate.getTime())) {
    return apiError("تاريخ الحجز غير صالح.", 400);
  }

  const shop = await prisma.barberShop.findFirst({
    where: {
      id: result.data.shopId,
      isApproved: true,
    },
  });

  if (!shop) {
    return apiError("المحل غير متاح للحجز.", 404);
  }

  const service = await prisma.service.findFirst({
    where: {
      id: result.data.serviceId,
      shopId: shop.id,
      isActive: true,
    },
  });

  if (!service) {
    return apiError("الخدمة المحددة غير متاحة.", 404);
  }

  let barberId: string | null = null;

  if (result.data.barberId) {
    const barber = await prisma.barber.findFirst({
      where: {
        id: result.data.barberId,
        shopId: shop.id,
        isActive: true,
      },
    });

    if (!barber) {
      return apiError("الحلاق المحدد غير متاح.", 404);
    }

    barberId = barber.id;
  }

  const appointment = await prisma.appointment.create({
    data: {
      customerId: auth.user.id,
      shopId: shop.id,
      barberId,
      serviceId: service.id,
      appointmentDate,
      appointmentTime: result.data.appointmentTime,
      customerName: result.data.customerName,
      customerPhone: result.data.customerPhone,
      notes: result.data.notes,
      status: "PENDING",
      price: service.price,
    },
    include: appointmentInclude,
  });

  return apiSuccess(
    {
      appointment: serializeAppointment(appointment),
      redirectTo: `/customer/appointments/${appointment.id}`,
    },
    "تم إرسال طلب الحجز بنجاح.",
  );
}

export async function GET() {
  const auth = await getApiSessionUser(["CUSTOMER"]);

  if ("error" in auth) {
    return auth.error;
  }

  return apiSuccess(await getCustomerAppointments(auth.user.id));
}
