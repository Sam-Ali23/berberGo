export const ROLE_VALUES = ["CUSTOMER", "SHOP_OWNER", "ADMIN"] as const;
export type Role = (typeof ROLE_VALUES)[number];

export const APPOINTMENT_STATUS_VALUES = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUS_VALUES)[number];

export interface UserDto {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  createdAt: string;
  updatedAt?: string;
}

export interface ServiceDto {
  id: string;
  shopId: string;
  name: string;
  description: string | null;
  price: number;
  durationMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BarberDto {
  id: string;
  shopId: string;
  name: string;
  bio: string | null;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewDto {
  id: string;
  appointmentId: string | null;
  customerId: string;
  shopId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  customer?: UserDto;
}

export interface ShopPreviewDto {
  id: string;
  name: string;
  city: string;
  district: string | null;
  coverImage: string | null;
}

export interface BarberShopDto {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  city: string;
  district: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  coverImage: string | null;
  images: string[];
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
  isApproved: boolean;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  minServicePrice?: number | null;
  owner?: UserDto | null;
  services?: ServiceDto[];
  barbers?: BarberDto[];
  reviews?: ReviewDto[];
}

export interface AppointmentDto {
  id: string;
  customerId: string;
  shopId: string;
  barberId: string | null;
  serviceId: string;
  appointmentDate: string;
  appointmentTime: string;
  customerName: string;
  customerPhone: string;
  notes: string | null;
  status: AppointmentStatus;
  price: number;
  createdAt: string;
  updatedAt: string;
  customer: UserDto;
  shop: BarberShopDto;
  barber: BarberDto | null;
  service: ServiceDto;
  review: ReviewDto | null;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface MessageDto {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  isRead: boolean;
  createdAt: string;
  sender: UserDto;
}

export interface ConversationDto {
  id: string;
  customerId: string | null;
  shopId: string | null;
  adminId: string | null;
  createdAt: string;
  updatedAt: string;
  customer: UserDto | null;
  shop: ShopPreviewDto | null;
  admin: UserDto | null;
  lastMessage: MessageDto | null;
  unreadCount: number;
}
