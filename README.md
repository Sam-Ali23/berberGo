# BerberGo MVP

BerberGo هو Marketplace حديث لحجز مواعيد محلات الحلاقة، مع واجهة عربية RTL افتراضيًا ودعم كامل للغات العربية والإنجليزية والتركية.

## ما الذي يقدمه المشروع؟

- استعراض محلات الحلاقة بطريقة مرئية قريبة من Airbnb
- صفحة محل غنية بالصور والخدمات والحلاقين والتقييمات
- حجز موعد داخل المحل
- تقييمات بعد اكتمال الموعد فقط
- رسائل مباشرة حيّة بين:
  - العميل ↔ المحل
  - المحل ↔ الإدارة
- لوحات تحكم مستقلة للعميل وصاحب المحل والإدارة

## التقنية

- `Next.js 16` مع `App Router`
- `Tailwind CSS 4`
- `PostgreSQL`
- `Prisma 7`
- `next-intl`
- `Socket.io`
- `JWT + HttpOnly Cookies`
- `bcrypt`
- `Framer Motion`
- `Lucide Icons`

## الأدوار

- `Customer`
- `Shop Owner`
- `Admin`

## اللغات

- العربية `RTL`
- الإنجليزية `LTR`
- التركية `LTR`

اللغة الافتراضية: العربية، ويتم حفظ اختيار اللغة في cookie.

## أهم الصفحات

### عامة

- `/`
- `/login`
- `/register`
- `/logout`

### العميل

- `/customer/dashboard`
- `/customer/shops`
- `/customer/shops/[id]`
- `/customer/shops/[id]/book`
- `/customer/appointments`
- `/customer/appointments/[id]`
- `/customer/appointments/[id]/review`
- `/customer/messages`
- `/customer/messages/[id]`

### صاحب المحل

- `/shop/dashboard`
- `/shop/profile`
- `/shop/services`
- `/shop/barbers`
- `/shop/appointments`
- `/shop/appointments/[id]`
- `/shop/messages`
- `/shop/messages/[id]`

### الإدارة

- `/admin/dashboard`
- `/admin/shops`
- `/admin/users`
- `/admin/appointments`
- `/admin/messages`
- `/admin/messages/[id]`

## الـ API الأساسية

### المصادقة

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/me`

### المحلات

- `GET /api/shops`
- `GET /api/shops/:id`
- `GET /api/shops/:id/reviews`

### المواعيد

- `POST /api/customer/appointments`
- `GET /api/customer/appointments`
- `GET /api/customer/appointments/:id`
- `PATCH /api/customer/appointments/:id/cancel`
- `GET /api/shop/appointments`
- `PATCH /api/shop/appointments/:id/status`
- `GET /api/admin/appointments`

### التقييمات

- `POST /api/reviews`

### الرسائل

- `GET /api/customer/conversations`
- `POST /api/customer/conversations`
- `GET /api/customer/conversations/:id/messages`
- `POST /api/customer/conversations/:id/messages`
- `GET /api/shop/conversations`
- `POST /api/shop/conversations`
- `GET /api/shop/conversations/:id/messages`
- `POST /api/shop/conversations/:id/messages`
- `GET /api/admin/conversations`
- `POST /api/admin/conversations`
- `GET /api/admin/conversations/:id/messages`
- `POST /api/admin/conversations/:id/messages`

## قاعدة البيانات

النماذج الرئيسية موجودة في [prisma/schema.prisma](/Users/sam/Projects/23/prisma/schema.prisma):

- `User`
- `BarberShop`
- `Service`
- `Barber`
- `Appointment`
- `Review`
- `Conversation`
- `Message`

## التشغيل

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

ثم افتح:

- [http://localhost:3000](http://localhost:3000)

## بيانات الدخول التجريبية

### Admin

- `admin@test.com`
- `password123`

### Customer

- `customer@test.com`
- `password123`

### Shop Owner

- `shop@test.com`
- `password123`

## متغيرات البيئة

انسخ الإعدادات:

```bash
cp .env.example .env
```

ثم عدّل:

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` عند تفعيل الخريطة لاحقًا

## الـ Seed

الملف [prisma/seed.ts](/Users/sam/Projects/23/prisma/seed.ts) ينشئ:

- Admin افتراضي
- Customer افتراضي
- Shop Owner افتراضي
- 4 محلات تجريبية
- لكل محل 3 خدمات
- لكل محل 2 حلاقين
- عدة مواعيد تجريبية
- تقييم تجريبي
- محادثات تجريبية للعميل والإدارة

## ملاحظات

- بعض المسارات القديمة ما زالت موجودة كـ redirects للحفاظ على عدم كسر الروابط الداخلية القديمة.
- Socket.io يعمل مع fallback تلقائي إلى polling على مستوى العميل.
- `robots.txt` و`sitemap.xml` وOpenGraph/Twitter image تم تجهيزها داخل `app/`.

## النشر على Hostinger

- يوجد دليل نشر جاهز في [HOSTINGER_DEPLOY.md](/Users/sam/Projects/23/HOSTINGER_DEPLOY.md)
- النشر الموصى به: `Node.js Web App` عبر GitHub
- Build command المقترح على Hostinger:

```bash
npm run hostinger:build
```

- Start command:

```bash
npm run start
```
