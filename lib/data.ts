import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { defaultGalleryImages, defaultShopCover } from "@/lib/constants";
import type {
  AppointmentDto,
  BarberDto,
  BarberShopDto,
  ConversationDto,
  MessageDto,
  ReviewDto,
  ServiceDto,
  SessionUser,
  ShopPreviewDto,
  UserDto,
} from "@/types";

const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

const reviewInclude = {
  customer: {
    select: userSelect,
  },
} satisfies Prisma.ReviewInclude;

const shopPreviewSelect = {
  id: true,
  name: true,
  city: true,
  district: true,
  coverImage: true,
} satisfies Prisma.BarberShopSelect;

const shopInclude = {
  owner: {
    select: userSelect,
  },
  services: {
    orderBy: [{ price: "asc" }, { name: "asc" }],
  },
  barbers: {
    orderBy: { name: "asc" },
  },
  reviews: {
    include: reviewInclude,
    orderBy: { createdAt: "desc" },
  },
} satisfies Prisma.BarberShopInclude;

export const appointmentInclude = {
  customer: {
    select: userSelect,
  },
  shop: {
    include: shopInclude,
  },
  barber: true,
  service: true,
  review: {
    include: reviewInclude,
  },
} satisfies Prisma.AppointmentInclude;

const messageInclude = {
  sender: {
    select: userSelect,
  },
} satisfies Prisma.MessageInclude;

const conversationInclude = {
  customer: {
    select: userSelect,
  },
  shop: {
    select: shopPreviewSelect,
  },
  admin: {
    select: userSelect,
  },
  messages: {
    include: messageInclude,
    orderBy: { createdAt: "desc" },
    take: 1,
  },
} satisfies Prisma.ConversationInclude;

type UserRecord = Prisma.UserGetPayload<{
  select: typeof userSelect;
}>;

type ServiceRecord = Prisma.ServiceGetPayload<object>;
type BarberRecord = Prisma.BarberGetPayload<object>;
type ReviewRecord = Prisma.ReviewGetPayload<{
  include: typeof reviewInclude;
}>;
type ShopRecord = Prisma.BarberShopGetPayload<{
  include: typeof shopInclude;
}>;
type AppointmentRecord = Prisma.AppointmentGetPayload<{
  include: typeof appointmentInclude;
}>;
type MessageRecord = Prisma.MessageGetPayload<{
  include: typeof messageInclude;
}>;
type ConversationRecord = Prisma.ConversationGetPayload<{
  include: typeof conversationInclude;
}>;

function normalizeImages(images: Prisma.JsonValue | null | undefined) {
  if (!Array.isArray(images)) {
    return defaultGalleryImages;
  }

  const normalized = images.filter((item): item is string => typeof item === "string" && item.length > 0);
  return normalized.length > 0 ? normalized : defaultGalleryImages;
}

export function serializeUser(user: UserRecord): UserDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function serializeService(service: ServiceRecord): ServiceDto {
  return {
    id: service.id,
    shopId: service.shopId,
    name: service.name,
    description: service.description,
    price: service.price,
    durationMinutes: service.durationMinutes,
    isActive: service.isActive,
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
  };
}

export function serializeBarber(barber: BarberRecord): BarberDto {
  return {
    id: barber.id,
    shopId: barber.shopId,
    name: barber.name,
    bio: barber.bio,
    image: barber.image,
    isActive: barber.isActive,
    createdAt: barber.createdAt.toISOString(),
    updatedAt: barber.updatedAt.toISOString(),
  };
}

export function serializeReview(review: ReviewRecord): ReviewDto {
  return {
    id: review.id,
    appointmentId: review.appointmentId,
    customerId: review.customerId,
    shopId: review.shopId,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt.toISOString(),
    customer: serializeUser(review.customer),
  };
}

export function serializeShopPreview(shop: Prisma.BarberShopGetPayload<{ select: typeof shopPreviewSelect }>): ShopPreviewDto {
  return {
    id: shop.id,
    name: shop.name,
    city: shop.city,
    district: shop.district,
    coverImage: shop.coverImage || defaultShopCover,
  };
}

export function serializeShop(shop: ShopRecord): BarberShopDto {
  const activeServices = shop.services.filter((service) => service.isActive);
  const minServicePrice =
    activeServices.length > 0
      ? Math.min(...activeServices.map((service) => service.price))
      : null;

  return {
    id: shop.id,
    ownerId: shop.ownerId,
    name: shop.name,
    description: shop.description,
    city: shop.city,
    district: shop.district,
    address: shop.address,
    latitude: shop.latitude,
    longitude: shop.longitude,
    coverImage: shop.coverImage || defaultShopCover,
    images: normalizeImages(shop.images),
    openingTime: shop.openingTime,
    closingTime: shop.closingTime,
    isOpen: shop.isOpen,
    isApproved: shop.isApproved,
    rating: shop.rating,
    totalReviews: shop.totalReviews,
    createdAt: shop.createdAt.toISOString(),
    updatedAt: shop.updatedAt.toISOString(),
    minServicePrice,
    owner: serializeUser(shop.owner),
    services: shop.services.map(serializeService),
    barbers: shop.barbers.map(serializeBarber),
    reviews: shop.reviews.map(serializeReview),
  };
}

export function serializeAppointment(appointment: AppointmentRecord): AppointmentDto {
  return {
    id: appointment.id,
    customerId: appointment.customerId,
    shopId: appointment.shopId,
    barberId: appointment.barberId,
    serviceId: appointment.serviceId,
    appointmentDate: appointment.appointmentDate.toISOString(),
    appointmentTime: appointment.appointmentTime,
    customerName: appointment.customerName,
    customerPhone: appointment.customerPhone,
    notes: appointment.notes,
    status: appointment.status,
    price: appointment.price,
    createdAt: appointment.createdAt.toISOString(),
    updatedAt: appointment.updatedAt.toISOString(),
    customer: serializeUser(appointment.customer),
    shop: serializeShop(appointment.shop),
    barber: appointment.barber ? serializeBarber(appointment.barber) : null,
    service: serializeService(appointment.service),
    review: appointment.review ? serializeReview(appointment.review) : null,
  };
}

export function serializeMessage(message: MessageRecord): MessageDto {
  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    text: message.text,
    isRead: message.isRead,
    createdAt: message.createdAt.toISOString(),
    sender: serializeUser(message.sender),
  };
}

export function serializeConversation(
  conversation: ConversationRecord,
  unreadCount = 0,
): ConversationDto {
  return {
    id: conversation.id,
    customerId: conversation.customerId,
    shopId: conversation.shopId,
    adminId: conversation.adminId,
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
    customer: conversation.customer ? serializeUser(conversation.customer) : null,
    shop: conversation.shop ? serializeShopPreview(conversation.shop) : null,
    admin: conversation.admin ? serializeUser(conversation.admin) : null,
    lastMessage: conversation.messages[0] ? serializeMessage(conversation.messages[0]) : null,
    unreadCount,
  };
}

export async function getFeaturedShops(limit = 4) {
  const shops = await prisma.barberShop.findMany({
    where: {
      isApproved: true,
    },
    include: shopInclude,
    orderBy: [{ rating: "desc" }, { totalReviews: "desc" }, { createdAt: "desc" }],
    take: limit,
  });

  return shops.map(serializeShop);
}

export async function getCustomerFacingShops(filters?: {
  search?: string | null;
  city?: string | null;
  service?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  minRating?: number | null;
}) {
  const shops = await prisma.barberShop.findMany({
    where: {
      isApproved: true,
      ...(filters?.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: "insensitive" } },
              { city: { contains: filters.search, mode: "insensitive" } },
              { district: { contains: filters.search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(filters?.city ? { city: { equals: filters.city, mode: "insensitive" } } : {}),
      ...(filters?.service
        ? {
            services: {
              some: {
                isActive: true,
                name: { contains: filters.service, mode: "insensitive" },
              },
            },
          }
        : {}),
    },
    include: shopInclude,
    orderBy: [{ rating: "desc" }, { totalReviews: "desc" }, { createdAt: "desc" }],
  });

  return shops
    .map(serializeShop)
    .filter((shop) => {
      if (filters?.minRating != null && shop.rating < filters.minRating) {
        return false;
      }

      if (filters?.minPrice != null && (shop.minServicePrice ?? 0) < filters.minPrice) {
        return false;
      }

      if (
        filters?.maxPrice != null &&
        shop.minServicePrice != null &&
        shop.minServicePrice > filters.maxPrice
      ) {
        return false;
      }

      return true;
    });
}

export async function getShopById(shopId: string) {
  const shop = await prisma.barberShop.findFirst({
    where: {
      id: shopId,
      isApproved: true,
    },
    include: shopInclude,
  });

  return shop ? serializeShop(shop) : null;
}

export async function getCustomerAppointments(customerId: string) {
  const appointments = await prisma.appointment.findMany({
    where: { customerId },
    include: appointmentInclude,
    orderBy: [{ appointmentDate: "desc" }, { appointmentTime: "desc" }],
  });

  return appointments.map(serializeAppointment);
}

export async function getCustomerAppointmentById(appointmentId: string, customerId: string) {
  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      customerId,
    },
    include: appointmentInclude,
  });

  return appointment ? serializeAppointment(appointment) : null;
}

export async function getShopForOwner(ownerId: string) {
  const shop = await prisma.barberShop.findUnique({
    where: { ownerId },
    include: shopInclude,
  });

  return shop ? serializeShop(shop) : null;
}

export async function getOwnerDashboardData(ownerId: string) {
  const shop = await prisma.barberShop.findUnique({
    where: { ownerId },
  });

  if (!shop) {
    return null;
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const [todayAppointments, upcomingAppointments, pendingAppointments, servicesCount, barbersCount, recent] =
    await prisma.$transaction([
      prisma.appointment.count({
        where: {
          shopId: shop.id,
          appointmentDate: {
            gte: startOfToday,
            lt: endOfToday,
          },
        },
      }),
      prisma.appointment.count({
        where: {
          shopId: shop.id,
          appointmentDate: {
            gte: startOfToday,
          },
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
        },
      }),
      prisma.appointment.count({
        where: {
          shopId: shop.id,
          status: "PENDING",
        },
      }),
      prisma.service.count({
        where: {
          shopId: shop.id,
          isActive: true,
        },
      }),
      prisma.barber.count({
        where: {
          shopId: shop.id,
          isActive: true,
        },
      }),
      prisma.appointment.findMany({
        where: { shopId: shop.id },
        include: appointmentInclude,
        orderBy: [{ appointmentDate: "asc" }, { appointmentTime: "asc" }],
        take: 8,
      }),
    ]);

  return {
    shop: await getShopForOwner(ownerId),
    stats: {
      todayAppointments,
      upcomingAppointments,
      pendingAppointments,
      servicesCount,
      barbersCount,
      rating: shop.rating,
    },
    appointments: recent.map(serializeAppointment),
  };
}

export async function getOwnerServices(ownerId: string) {
  const shop = await prisma.barberShop.findUnique({
    where: { ownerId },
    select: { id: true },
  });

  if (!shop) {
    return null;
  }

  const services = await prisma.service.findMany({
    where: { shopId: shop.id },
    orderBy: [{ isActive: "desc" }, { price: "asc" }],
  });

  return services.map(serializeService);
}

export async function getOwnerBarbers(ownerId: string) {
  const shop = await prisma.barberShop.findUnique({
    where: { ownerId },
    select: { id: true },
  });

  if (!shop) {
    return null;
  }

  const barbers = await prisma.barber.findMany({
    where: { shopId: shop.id },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
  });

  return barbers.map(serializeBarber);
}

export async function getOwnerAppointments(ownerId: string) {
  const shop = await prisma.barberShop.findUnique({
    where: { ownerId },
    select: { id: true },
  });

  if (!shop) {
    return null;
  }

  const appointments = await prisma.appointment.findMany({
    where: { shopId: shop.id },
    include: appointmentInclude,
    orderBy: [{ appointmentDate: "desc" }, { appointmentTime: "desc" }],
  });

  return appointments.map(serializeAppointment);
}

export async function getOwnerAppointmentById(ownerId: string, appointmentId: string) {
  const shop = await prisma.barberShop.findUnique({
    where: { ownerId },
    select: { id: true },
  });

  if (!shop) {
    return null;
  }

  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      shopId: shop.id,
    },
    include: appointmentInclude,
  });

  return appointment ? serializeAppointment(appointment) : null;
}

export async function getAdminDashboardData() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const [customers, shops, appointments, todayAppointments, pendingApprovalShops, featuredAppointments] =
    await prisma.$transaction([
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.barberShop.count(),
      prisma.appointment.count(),
      prisma.appointment.count({
        where: {
          appointmentDate: {
            gte: startOfToday,
            lt: endOfToday,
          },
        },
      }),
      prisma.barberShop.count({ where: { isApproved: false } }),
      prisma.appointment.findMany({
        include: appointmentInclude,
        orderBy: [{ appointmentDate: "desc" }, { appointmentTime: "desc" }],
        take: 6,
      }),
    ]);

  return {
    stats: {
      customers,
      shops,
      appointments,
      todayAppointments,
      pendingApprovalShops,
    },
    recentAppointments: featuredAppointments.map(serializeAppointment),
  };
}

export async function getAdminShops() {
  const shops = await prisma.barberShop.findMany({
    include: shopInclude,
    orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
  });

  return shops.map(serializeShop);
}

export async function getAdminUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      ...userSelect,
    },
  });

  return users.map(serializeUser);
}

export async function getAdminAppointments() {
  const appointments = await prisma.appointment.findMany({
    include: appointmentInclude,
    orderBy: [{ appointmentDate: "desc" }, { appointmentTime: "desc" }],
  });

  return appointments.map(serializeAppointment);
}

export async function getAppointmentForSession(appointmentId: string, user: SessionUser) {
  if (user.role === "CUSTOMER") {
    return getCustomerAppointmentById(appointmentId, user.id);
  }

  if (user.role === "SHOP_OWNER") {
    return getOwnerAppointmentById(user.id, appointmentId);
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: appointmentInclude,
  });

  return appointment ? serializeAppointment(appointment) : null;
}

async function getUnreadCounts(
  conversationIds: string[],
  userId: string,
) {
  const unreadMessages = await prisma.message.groupBy({
    by: ["conversationId"],
    where: {
      conversationId: { in: conversationIds },
      senderId: {
        not: userId,
      },
      isRead: false,
    },
    _count: {
      _all: true,
    },
  });

  return new Map(unreadMessages.map((entry) => [entry.conversationId, entry._count._all]));
}

export async function getShopReviews(shopId: string) {
  const reviews = await prisma.review.findMany({
    where: { shopId },
    include: reviewInclude,
    orderBy: { createdAt: "desc" },
  });

  return reviews.map(serializeReview);
}

export async function getReviewableAppointment(customerId: string, appointmentId: string) {
  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      customerId,
      status: "COMPLETED",
    },
    include: appointmentInclude,
  });

  return appointment ? serializeAppointment(appointment) : null;
}

export async function refreshShopRating(shopId: string) {
  const result = await prisma.review.aggregate({
    where: { shopId },
    _avg: {
      rating: true,
    },
    _count: {
      _all: true,
    },
  });

  await prisma.barberShop.update({
    where: { id: shopId },
    data: {
      rating: result._avg.rating ?? 0,
      totalReviews: result._count._all,
    },
  });
}

export async function getCustomerConversations(customerId: string) {
  const conversations = await prisma.conversation.findMany({
    where: { customerId },
    include: conversationInclude,
    orderBy: { updatedAt: "desc" },
  });

  const unreadCounts = await getUnreadCounts(
    conversations.map((conversation) => conversation.id),
    customerId,
  );

  return conversations.map((conversation) =>
    serializeConversation(conversation, unreadCounts.get(conversation.id) ?? 0),
  );
}

export async function getShopConversations(ownerId: string) {
  const shop = await prisma.barberShop.findUnique({
    where: { ownerId },
    select: { id: true },
  });

  if (!shop) {
    return null;
  }

  const conversations = await prisma.conversation.findMany({
    where: { shopId: shop.id },
    include: conversationInclude,
    orderBy: { updatedAt: "desc" },
  });

  const unreadCounts = await getUnreadCounts(
    conversations.map((conversation) => conversation.id),
    ownerId,
  );

  return conversations.map((conversation) =>
    serializeConversation(conversation, unreadCounts.get(conversation.id) ?? 0),
  );
}

export async function getAdminConversations(adminId: string) {
  const conversations = await prisma.conversation.findMany({
    where: { adminId },
    include: conversationInclude,
    orderBy: { updatedAt: "desc" },
  });

  const unreadCounts = await getUnreadCounts(
    conversations.map((conversation) => conversation.id),
    adminId,
  );

  return conversations.map((conversation) =>
    serializeConversation(conversation, unreadCounts.get(conversation.id) ?? 0),
  );
}

export async function getConversationByIdForUser(conversationId: string, user: SessionUser) {
  const conversation = await prisma.conversation.findFirst({
    where:
      user.role === "CUSTOMER"
        ? {
            id: conversationId,
            customerId: user.id,
          }
        : user.role === "SHOP_OWNER"
          ? {
              id: conversationId,
              shop: {
                ownerId: user.id,
              },
            }
          : {
              id: conversationId,
              adminId: user.id,
            },
    include: {
      ...conversationInclude,
      messages: {
        include: messageInclude,
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!conversation) {
    return null;
  }

  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: {
        not: user.id,
      },
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  const unreadCount = await prisma.message.count({
    where: {
      conversationId,
      senderId: {
        not: user.id,
      },
      isRead: false,
    },
  });

  return {
    conversation: serializeConversation(
      {
        ...conversation,
        messages: conversation.messages.slice(-1),
      } satisfies ConversationRecord,
      unreadCount,
    ),
    messages: conversation.messages.map(serializeMessage),
  };
}

export async function findOrCreateCustomerConversation(customerId: string, shopId: string) {
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      customerId,
      shopId,
      adminId: null,
    },
    include: conversationInclude,
  });

  if (existingConversation) {
    return serializeConversation(existingConversation, 0);
  }

  const conversation = await prisma.conversation.create({
    data: {
      customerId,
      shopId,
    },
    include: conversationInclude,
  });

  return serializeConversation(conversation, 0);
}

export async function findOrCreateAdminConversation(shopId: string, adminId: string) {
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      shopId,
      adminId,
      customerId: null,
    },
    include: conversationInclude,
  });

  if (existingConversation) {
    return serializeConversation(existingConversation, 0);
  }

  const conversation = await prisma.conversation.create({
    data: {
      shopId,
      adminId,
    },
    include: conversationInclude,
  });

  return serializeConversation(conversation, 0);
}

export async function createConversationMessage(conversationId: string, senderId: string, text: string) {
  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId,
      text,
      isRead: false,
    },
    include: messageInclude,
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      updatedAt: new Date(),
    },
  });

  return serializeMessage(message);
}
