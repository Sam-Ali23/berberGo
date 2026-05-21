import { getApiSessionUser } from "@/lib/auth";
import { getAdminUsers } from "@/lib/data";
import { apiSuccess } from "@/lib/http";

export async function GET() {
  const auth = await getApiSessionUser(["ADMIN"]);

  if ("error" in auth) {
    return auth.error;
  }

  return apiSuccess(await getAdminUsers());
}
