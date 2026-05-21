import { z } from "zod";

import { APPOINTMENT_STATUS_VALUES } from "@/types";

const normalizedText = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => {
    const text = typeof value === "string" ? value.trim() : "";
    return text.length > 0 ? text : null;
  });

const requiredText = (message: string) => z.string().trim().min(1, message);

const nullableNumber = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((value, context) => {
    if (value == null || value === "") {
      return null;
    }

    const parsed = typeof value === "number" ? value : Number(value);

    if (!Number.isFinite(parsed)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "قيمة رقمية غير صالحة.",
      });
      return z.NEVER;
    }

    return parsed;
  });

export const registerSchema = z.object({
  name: z.string().trim().min(2, "الاسم مطلوب."),
  email: z.string().trim().email("البريد الإلكتروني غير صحيح."),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل."),
  phone: normalizedText,
  role: z.enum(["CUSTOMER", "SHOP_OWNER"]),
  shopName: normalizedText,
  city: normalizedText,
});

export const loginSchema = z.object({
  email: z.string().trim().email("البريد الإلكتروني غير صحيح."),
  password: z.string().min(1, "كلمة المرور مطلوبة."),
});

export const shopProfileSchema = z.object({
  name: requiredText("اسم المحل مطلوب."),
  description: normalizedText,
  city: requiredText("المدينة مطلوبة."),
  district: normalizedText,
  address: requiredText("العنوان مطلوب."),
  latitude: nullableNumber,
  longitude: nullableNumber,
  coverImage: normalizedText,
  images: z.array(z.string().trim().url("رابط صورة غير صالح.")).default([]),
  openingTime: requiredText("وقت الافتتاح مطلوب."),
  closingTime: requiredText("وقت الإغلاق مطلوب."),
  isOpen: z.boolean(),
});

export const shopServiceSchema = z.object({
  name: requiredText("اسم الخدمة مطلوب."),
  description: normalizedText,
  price: z.coerce.number().positive("السعر يجب أن يكون أكبر من صفر."),
  durationMinutes: z.coerce
    .number()
    .int("المدة يجب أن تكون رقمًا صحيحًا.")
    .min(10, "المدة الدنيا 10 دقائق."),
  isActive: z.boolean(),
});

export const shopBarberSchema = z.object({
  name: requiredText("اسم الحلاق مطلوب."),
  bio: normalizedText,
  image: normalizedText,
  isActive: z.boolean(),
});

export const appointmentSchema = z.object({
  shopId: requiredText("المحل مطلوب."),
  serviceId: requiredText("الخدمة مطلوبة."),
  barberId: normalizedText,
  appointmentDate: requiredText("التاريخ مطلوب."),
  appointmentTime: requiredText("الوقت مطلوب."),
  customerName: z.string().trim().min(2, "الاسم مطلوب."),
  customerPhone: z.string().trim().min(8, "رقم الجوال مطلوب."),
  notes: normalizedText,
});

export const appointmentStatusSchema = z.object({
  status: z.enum(APPOINTMENT_STATUS_VALUES),
});

export const reviewSchema = z.object({
  appointmentId: requiredText("الموعد مطلوب."),
  rating: z.coerce.number().int().min(1).max(5),
  comment: normalizedText,
});

export const conversationSchema = z.object({
  shopId: normalizedText,
  appointmentId: normalizedText,
  admin: z.coerce.boolean().optional().default(false),
});

export const messageSchema = z.object({
  text: z.string().trim().min(1, "الرسالة مطلوبة.").max(2000, "الرسالة طويلة جدًا."),
});
