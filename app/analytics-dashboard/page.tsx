import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "../../lib/auth";

export default async function AnalyticsDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session){
    redirect("/login");
  }
  // you can now use `session`, e.g. if (!session) redirect("/auth/signin");
  // Redirect to analytics-dashboard/sales path for now
  redirect("/analytics-dashboard/sales");
}
  