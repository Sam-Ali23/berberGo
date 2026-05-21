# BerberGo on Hostinger

هذا الدليل مخصص لرفع مشروع `BerberGo` على Hostinger من خلال خيار `Node.js Web App` الظاهر في hPanel.

## المسار الموصى به

- الاستضافة: `Business Web Hosting` أو أي خطة `Cloud` تدعم `Node.js Web App`
- التطبيق: `Next.js`
- قاعدة البيانات: `PostgreSQL` خارجية مثل `Neon` أو `Supabase`
- الشات:
  - إذا كنت على `Business/Cloud` وتريد أعلى استقرار: اجعل `NEXT_PUBLIC_ENABLE_SOCKET=false` وسيعمل الشات عبر polling
  - إذا كنت تريد `WebSocket` حقيقي بالكامل: استخدم `Hostinger VPS`

## قبل الرفع

تأكد من وجود المشروع على GitHub.

المشروع جاهز بسكربت build مناسب لـ Hostinger:

```bash
npm run hostinger:build
```

هذا السكربت يقوم بـ:

1. `prisma migrate deploy`
2. تشغيل bootstrap آمن للحسابات التجريبية فقط إذا كان `ENABLE_DEMO_BOOTSTRAP=true`
3. `next build`

## متغيرات البيئة المطلوبة

أضف هذه القيم داخل Hostinger أثناء النشر:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=ضع_قيمة_طويلة_وعشوائية_جداً
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_ENABLE_SOCKET=false
ENABLE_DEMO_BOOTSTRAP=false
```

ملاحظات:

- استخدم `NEXT_PUBLIC_ENABLE_SOCKET=false` على Hostinger Business/Cloud إذا أردت تجنب أي مشاكل محتملة مع WebSocket، وسيبقى نظام الرسائل يعمل عبر polling.
- إذا فعلت Google Maps لاحقًا أضف المفتاح فقط، وإلا اتركه فارغًا.
- إذا أردت إنشاء حسابات الـ demo نفسها على بيئة الإنتاج بدون حذف أي بيانات، غيّر `ENABLE_DEMO_BOOTSTRAP=true` ثم نفّذ redeploy مرة واحدة. بعد نجاح النشر يمكنك إعادته إلى `false`.

## خطوات النشر من hPanel

1. ادخل إلى `Websites`
2. اضغط `Add website`
3. اختر `Node.js Web App`
4. اختر `Import Git Repository`
5. اربط GitHub مع Hostinger
6. اختر Repository المشروع
7. اختر الفرع الصحيح
8. في Build Settings:
   - Framework: `Next.js` إذا تم اكتشافه تلقائيًا
   - Node.js version: `20.x` أو `22.x`
   - Build command: `npm run hostinger:build`
   - Start command: `npm run start`
9. في Environment Variables:
   - أضف القيم المذكورة أعلاه
10. اضغط `Deploy`

## إذا أردت الرفع عبر ZIP بدل GitHub

استخدم ملف ZIP يحتوي على:

- `app/`
- `components/`
- `lib/`
- `messages/`
- `pages/`
- `prisma/`
- `public/`
- `types/`
- `package.json`
- `package-lock.json`
- `next.config.ts`
- `proxy.ts`
- `prisma.config.ts`
- `tsconfig.json`

ولا ترفع:

- `node_modules`
- `.next`
- `.env`

## إعداد قاعدة البيانات

### الخيار الأفضل على Business/Cloud

استخدم `Neon` أو `Supabase Postgres` ثم ضع رابط الاتصال في `DATABASE_URL`.

### تطبيق المايغريشن

Hostinger سيشغلها تلقائيًا لأن build command لدينا:

```bash
npm run hostinger:build
```

## إدخال بيانات تجريبية

إذا كنت تريد بيانات الـ demo في بيئة الإنتاج لأول مرة:

1. ضع `DATABASE_URL` للإنتاج عندك محليًا
2. شغّل:

```bash
npm run db:bootstrap-demo
```

تحذير:

- `db:bootstrap-demo` آمن ويضيف أو يحدّث حسابات demo بدون حذف البيانات الحالية.
- `seed.ts` الحالي يعيد إنشاء البيانات التجريبية بشكل كامل، لذلك لا تستخدمه على قاعدة بيانات فيها بيانات عملاء حقيقية.

## بعد النشر

اختبر مباشرة:

- الصفحة الرئيسية
- تسجيل الدخول
- `/customer/shops`
- إنشاء حجز
- لوحة صاحب المحل
- لوحة الإدارة

## إذا فشل النشر

راجع من Hostinger:

1. `Websites`
2. `Dashboard`
3. `Deployments`
4. افتح `Build logs`

وإذا كان البناء ناجحًا لكن التطبيق لا يعمل:

- افتح `stderr.log`

## ملاحظات مهمة

- على Hostinger `Business/Cloud` التطبيق مناسب جدًا لهذه المنصة.
- لو أردت `PostgreSQL` داخل نفس الاستضافة نفسها أو `Socket.io` حقيقي 100% بأعلى تحكم، فانتقل إلى `VPS`.
