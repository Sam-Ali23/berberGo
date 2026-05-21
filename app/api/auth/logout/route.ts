import { clearSessionCookie } from "@/lib/auth";
import { apiSuccess } from "@/lib/http";

export async function POST() {
  await clearSessionCookie();
  return apiSuccess({ loggedOut: true }, "تم تسجيل الخروج.");
}
