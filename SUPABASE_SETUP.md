# دليل إعداد Supabase مع المشروع

## الخطوات المطلوبة لإكمال التحويل إلى Supabase

### 1. إنشاء حساب Supabase
- افتح موقع [https://supabase.com](https://supabase.com)
- أنشئ حساباً جديداً أو سجّل الدخول
- أنشئ مشروعاً جديداً

### 2. الحصول على معلومات الاتصال
اذهب إلى Settings > Database ثم انتقل إلى قسم Connection string.
اختر URI وأخذ:
- Project URL
- Service role key
- Database password

### 3. تحديث ملفات الإعداد

#### ملف `.env` الرئيسي:
```
# Supabase Database URL
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_ID].supabase.co:5432/postgres"

# NextAuth Configuration
NEXTAUTH_SECRET=12D16C923BA17672F89B18C1DB22A
NEXTAUTH_URL=http://localhost:3000

# Supabase Configuration
SUPABASE_URL="https://[YOUR_PROJECT_ID].supabase.co"
SUPABASE_ANON_KEY="[YOUR_SUPABASE_ANON_KEY]"
```

#### ملف `server/.env`:
```
# Supabase Database URL
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_ID].supabase.co:5432/postgres"

# Supabase Configuration
SUPABASE_URL="https://[YOUR_PROJECT_ID].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="[YOUR_SERVICE_ROLE_KEY]"
```

### 4. التغييرات التي تم إجراؤها
✅ تم تغيير provider من `mysql` إلى `postgresql` في ملفات `schema.prisma`
✅ تم تثبيت مكتبات Prisma PostgreSQL adapter
✅ تم تحديث ملفات الإعداد البيئي

### 5. الخطوات النهائية

بعد إضافة بيانات Supabase الفعلية:

1. في المجلد الرئيسي:
```bash
npx prisma generate
npx prisma migrate dev --name init_supabase
```

2. في مجلد server:
```bash
cd server
npx prisma generate
npx prisma migrate dev --name init_supabase
```

### 6. ملاحظات مهمة
- تأكد من أن كلمة المرور تحتوي على أحرف URL-safe (استخدم % لترميز الأحرف الخاصة)
- تأكد من أن Project ID صحيح في الـ URL
- يمكنك استخدام Direct connection أو Connection pooling من Supabase