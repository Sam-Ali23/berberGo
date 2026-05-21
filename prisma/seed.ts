import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";

import { defaultGalleryImages, defaultShopCover } from "../lib/constants";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run the seed script.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

type ShopSeed = {
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  name: string;
  description: string;
  city: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  coverImage: string;
  images: string[];
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
  isApproved: boolean;
  rating: number;
  totalReviews: number;
  services: Array<{
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
  }>;
  barbers: Array<{
    name: string;
    bio: string;
    image: string;
  }>;
};

const shopSeeds: ShopSeed[] = [
  {
    ownerName: "صاحب المحل الرئيسي",
    ownerEmail: "shop@test.com",
    ownerPhone: "0522222222",
    name: "BerberGo Lounge",
    description: "محل حلاقة فاخر يجمع بين الخدمة السريعة والأجواء الراقية في قلب المدينة.",
    city: "الرياض",
    district: "العليا",
    address: "طريق العليا العام، الرياض",
    latitude: 24.7136,
    longitude: 46.6753,
    coverImage:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1400&q=80",
    images: defaultGalleryImages,
    openingTime: "10:00",
    closingTime: "23:00",
    isOpen: true,
    isApproved: true,
    rating: 4.9,
    totalReviews: 128,
    services: [
      {
        name: "قص شعر كلاسيكي",
        description: "قصة نظيفة ومتقنة مع لمسات نهائية احترافية.",
        price: 65,
        durationMinutes: 35,
      },
      {
        name: "تشذيب لحية فاخر",
        description: "تهذيب وتحديد اللحية مع عناية كاملة بالبشرة.",
        price: 50,
        durationMinutes: 25,
      },
      {
        name: "باقة قصة + لحية",
        description: "الخدمة الأكثر طلبًا لجلسة متكاملة.",
        price: 105,
        durationMinutes: 55,
      },
    ],
    barbers: [
      {
        name: "Daniel Brooks",
        bio: "Specializes in classic cuts with a polished, premium finish.",
        image:
          "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Noah Bennett",
        bio: "Known for clean beard shaping and efficient modern cuts.",
        image:
          "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Leo Carter",
        bio: "Delivers sharp skin fades and confident styling advice.",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    ownerName: "صاحب محل جدة",
    ownerEmail: "jeddah-shop@test.com",
    ownerPhone: "0533333333",
    name: "Harbor Fade Studio",
    description: "استوديو حلاقة عصري قريب من الواجهة البحرية مع خدمات دقيقة ومريحة.",
    city: "جدة",
    district: "الزهراء",
    address: "شارع الأمير سلطان، جدة",
    latitude: 21.6114,
    longitude: 39.1551,
    coverImage:
      "https://images.unsplash.com/photo-1622288432450-277d0fef5ed6?auto=format&fit=crop&w=1400&q=80",
    images: [
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1521498542256-5aeb47ba2b36?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1635273051839-003bf06a8751?auto=format&fit=crop&w=900&q=80",
    ],
    openingTime: "11:00",
    closingTime: "00:00",
    isOpen: true,
    isApproved: true,
    rating: 4.7,
    totalReviews: 92,
    services: [
      {
        name: "Fade احترافي",
        description: "قصات Fade بمستويات دقيقة جدًا.",
        price: 75,
        durationMinutes: 40,
      },
      {
        name: "تنظيف بشرة ولحية",
        description: "خدمة كاملة للوجه واللحية.",
        price: 60,
        durationMinutes: 30,
      },
      {
        name: "باقة VIP",
        description: "قصة + لحية + منشفة ساخنة.",
        price: 130,
        durationMinutes: 65,
      },
    ],
    barbers: [
      {
        name: "Mason Reed",
        bio: "Focused on precise detailing and fresh contemporary styles.",
        image:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Ryan Foster",
        bio: "Experienced in full grooming sessions and smooth client service.",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Adrian Blake",
        bio: "Blends modern fades with clean scissor work for everyday looks.",
        image:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    ownerName: "صاحب محل الخبر",
    ownerEmail: "khobar-shop@test.com",
    ownerPhone: "0544444444",
    name: "Desert Edge Barber",
    description: "محل حلاقة أنيق في الخبر يقدم تجربة هادئة وخدمة عالية الجودة.",
    city: "الخبر",
    district: "العقربية",
    address: "طريق الأمير تركي، الخبر",
    latitude: 26.2794,
    longitude: 50.2083,
    coverImage:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=80",
    images: [
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=900&q=80",
    ],
    openingTime: "09:00",
    closingTime: "22:00",
    isOpen: true,
    isApproved: false,
    rating: 4.5,
    totalReviews: 31,
    services: [
      {
        name: "قصة عملية",
        description: "قصة يومية مرتبة وسريعة.",
        price: 55,
        durationMinutes: 30,
      },
      {
        name: "تشذيب دقيقة",
        description: "خدمة لحية مع تحديد متوازن.",
        price: 45,
        durationMinutes: 20,
      },
      {
        name: "جلسة كاملة",
        description: "قصة ولحية مع تصفيف بسيط.",
        price: 95,
        durationMinutes: 50,
      },
    ],
    barbers: [
      {
        name: "Adam Walker",
        bio: "Reliable with fast, accurate service for busy appointments.",
        image:
          "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Ethan Cole",
        bio: "Strong at practical office-friendly cuts with neat finishing.",
        image:
          "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    ownerName: "صاحب محل الدمام",
    ownerEmail: "dammam-shop@test.com",
    ownerPhone: "0555555555",
    name: "North Cut House",
    description: "بيت حلاقة شبابي بديكور معاصر وخدمات متنوعة لجميع الأعمار.",
    city: "الدمام",
    district: "الشاطئ",
    address: "طريق الخليج، الدمام",
    latitude: 26.4344,
    longitude: 50.1033,
    coverImage:
      "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1400&q=80",
    images: [
      "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80",
    ],
    openingTime: "12:00",
    closingTime: "23:59",
    isOpen: false,
    isApproved: true,
    rating: 4.6,
    totalReviews: 54,
    services: [
      {
        name: "قصة أطفال",
        description: "خدمة لطيفة وسريعة للأطفال.",
        price: 40,
        durationMinutes: 25,
      },
      {
        name: "قصة شبابية",
        description: "قصات حديثة للشباب.",
        price: 70,
        durationMinutes: 40,
      },
      {
        name: "باقة مميزة",
        description: "قصة + لحية + تصفيف.",
        price: 115,
        durationMinutes: 60,
      },
    ],
    barbers: [
      {
        name: "Lucas Hayes",
        bio: "Great with youthful styles, quick turnaround, and crisp lines.",
        image:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Benjamin Stone",
        bio: "Calm, detail-oriented barber with strong taper and fade work.",
        image:
          "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {
      name: "مدير المنصة",
      passwordHash,
      phone: "0500000000",
      role: Role.ADMIN,
    },
    create: {
      name: "مدير المنصة",
      email: "admin@test.com",
      passwordHash,
      phone: "0500000000",
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@test.com" },
    update: {
      name: "عميل تجريبي",
      passwordHash,
      phone: "0511111111",
      role: Role.CUSTOMER,
    },
    create: {
      name: "عميل تجريبي",
      email: "customer@test.com",
      passwordHash,
      phone: "0511111111",
      role: Role.CUSTOMER,
    },
  });

  const createdShops: Array<{
    shopId: string;
    ownerId: string;
    serviceIds: string[];
    barberIds: string[];
  }> = [];

  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.review.deleteMany();
  await prisma.appointment.deleteMany();

  for (const shopSeed of shopSeeds) {
    const owner = await prisma.user.upsert({
      where: { email: shopSeed.ownerEmail },
      update: {
        name: shopSeed.ownerName,
        passwordHash,
        phone: shopSeed.ownerPhone,
        role: Role.SHOP_OWNER,
      },
      create: {
        name: shopSeed.ownerName,
        email: shopSeed.ownerEmail,
        passwordHash,
        phone: shopSeed.ownerPhone,
        role: Role.SHOP_OWNER,
      },
    });

    const shop = await prisma.barberShop.upsert({
      where: { ownerId: owner.id },
      update: {
        name: shopSeed.name,
        description: shopSeed.description,
        city: shopSeed.city,
        district: shopSeed.district,
        address: shopSeed.address,
        latitude: shopSeed.latitude,
        longitude: shopSeed.longitude,
        coverImage: shopSeed.coverImage || defaultShopCover,
        images: shopSeed.images,
        openingTime: shopSeed.openingTime,
        closingTime: shopSeed.closingTime,
        isOpen: shopSeed.isOpen,
        isApproved: shopSeed.isApproved,
        rating: shopSeed.rating,
        totalReviews: shopSeed.totalReviews,
      },
      create: {
        ownerId: owner.id,
        name: shopSeed.name,
        description: shopSeed.description,
        city: shopSeed.city,
        district: shopSeed.district,
        address: shopSeed.address,
        latitude: shopSeed.latitude,
        longitude: shopSeed.longitude,
        coverImage: shopSeed.coverImage || defaultShopCover,
        images: shopSeed.images,
        openingTime: shopSeed.openingTime,
        closingTime: shopSeed.closingTime,
        isOpen: shopSeed.isOpen,
        isApproved: shopSeed.isApproved,
        rating: shopSeed.rating,
        totalReviews: shopSeed.totalReviews,
      },
    });

    await prisma.service.deleteMany({
      where: { shopId: shop.id },
    });

    await prisma.barber.deleteMany({
      where: { shopId: shop.id },
    });

    const services = [];
    for (const serviceSeed of shopSeed.services) {
      services.push(
        await prisma.service.create({
          data: {
            shopId: shop.id,
            name: serviceSeed.name,
            description: serviceSeed.description,
            price: serviceSeed.price,
            durationMinutes: serviceSeed.durationMinutes,
            isActive: true,
          },
        }),
      );
    }

    const barbers = [];
    for (const barberSeed of shopSeed.barbers) {
      barbers.push(
        await prisma.barber.create({
          data: {
            shopId: shop.id,
            name: barberSeed.name,
            bio: barberSeed.bio,
            image: barberSeed.image,
            isActive: true,
          },
        }),
      );
    }

    createdShops.push({
      shopId: shop.id,
      ownerId: owner.id,
      serviceIds: services.map((service) => service.id),
      barberIds: barbers.map((barber) => barber.id),
    });
  }

  const primaryShop = createdShops[0];
  const secondShop = createdShops[1];

  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        customerId: customer.id,
        shopId: primaryShop.shopId,
        barberId: primaryShop.barberIds[0],
        serviceId: primaryShop.serviceIds[2],
        appointmentDate: new Date("2026-05-22T00:00:00.000Z"),
        appointmentTime: "18:00",
        customerName: "عميل تجريبي",
        customerPhone: "0511111111",
        notes: "أفضل الجلسة المسائية.",
        status: "PENDING",
        price: 105,
      },
    }),
    prisma.appointment.create({
      data: {
        customerId: customer.id,
        shopId: secondShop.shopId,
        barberId: secondShop.barberIds[1],
        serviceId: secondShop.serviceIds[0],
        appointmentDate: new Date("2026-05-23T00:00:00.000Z"),
        appointmentTime: "20:30",
        customerName: "عميل تجريبي",
        customerPhone: "0511111111",
        notes: "أرغب بقصة Fade قصيرة.",
        status: "CONFIRMED",
        price: 75,
      },
    }),
    prisma.appointment.create({
      data: {
        customerId: customer.id,
        shopId: primaryShop.shopId,
        barberId: primaryShop.barberIds[1],
        serviceId: primaryShop.serviceIds[1],
        appointmentDate: new Date("2026-05-18T00:00:00.000Z"),
        appointmentTime: "17:00",
        customerName: "عميل تجريبي",
        customerPhone: "0511111111",
        notes: "مكتمل بنجاح.",
        status: "COMPLETED",
        price: 50,
      },
    }),
  ]);

  await prisma.review.create({
    data: {
      appointmentId: appointments[2].id,
      customerId: customer.id,
      shopId: primaryShop.shopId,
      rating: 5,
      comment: "تجربة ممتازة وخدمة دقيقة جدًا.",
    },
  });

  const customerConversation = await prisma.conversation.create({
    data: {
      customerId: customer.id,
      shopId: primaryShop.shopId,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: customerConversation.id,
        senderId: customer.id,
        text: "مرحبًا، هل أستطيع الحضور قبل الموعد بعشر دقائق؟",
        isRead: true,
      },
      {
        conversationId: customerConversation.id,
        senderId: primaryShop.ownerId,
        text: "أكيد، أهلاً بك في أي وقت قبل الموعد بقليل.",
        isRead: false,
      },
    ],
  });

  const adminConversation = await prisma.conversation.create({
    data: {
      shopId: primaryShop.shopId,
      adminId: admin.id,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: adminConversation.id,
        senderId: admin.id,
        text: "مرحبًا، نراجع الآن جودة الصور والمحتوى الخاص بصفحة المحل.",
        isRead: true,
      },
      {
        conversationId: adminConversation.id,
        senderId: primaryShop.ownerId,
        text: "شكرًا لكم، سأضيف صورًا جديدة وتحسينات على الوصف اليوم.",
        isRead: false,
      },
    ],
  });

  console.log("Seed completed", {
    admin: admin.email,
    customer: customer.email,
    shopOwner: "shop@test.com",
    shops: createdShops.length,
    demoBarbers: createdShops.reduce((total, shop) => total + shop.barberIds.length, 0),
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
