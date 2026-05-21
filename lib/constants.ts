import type { AppointmentStatus, Role } from "@/types";

export const APP_NAME = "BerberGo";
export const SESSION_COOKIE_NAME = "berbergo_session";

export const roleLabels: Record<Role, string> = {
  CUSTOMER: "عميل",
  SHOP_OWNER: "صاحب محل",
  ADMIN: "إدارة",
};

export const dashboardRoutes: Record<Role, string> = {
  CUSTOMER: "/customer/dashboard",
  SHOP_OWNER: "/shop/dashboard",
  ADMIN: "/admin/dashboard",
};

export const appointmentStatusLabels: Record<AppointmentStatus, string> = {
  PENDING: "بانتظار التأكيد",
  CONFIRMED: "مؤكد",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغي",
  NO_SHOW: "لم يحضر",
};

export const appointmentStatusClasses: Record<AppointmentStatus, string> = {
  PENDING: "bg-amber-100 text-amber-900 border border-amber-200",
  CONFIRMED: "bg-blue-100 text-blue-900 border border-blue-200",
  COMPLETED: "bg-green-100 text-green-900 border border-green-200",
  CANCELLED: "bg-red-100 text-red-900 border border-red-200",
  NO_SHOW: "bg-rose-100 text-rose-900 border border-rose-200",
};

export const shopOwnerWorkflowStatuses: AppointmentStatus[] = [
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
];

export const defaultShopCover =
  "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1200&q=80";

export const defaultGalleryImages = [
  "https://images.unsplash.com/photo-1512690459411-b0fd1c86b8a8?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?auto=format&fit=crop&w=900&q=80",
];
