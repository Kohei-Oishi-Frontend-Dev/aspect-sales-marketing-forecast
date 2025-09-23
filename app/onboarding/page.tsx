import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import UserPreference from "../components/UserPreference";

const prisma = new PrismaClient();

export default async function OnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }
  const pref = await prisma.userPreference.findUnique({
    where: { userId: session.user.id },
  });
  if (pref) {
    redirect("/analytics-dashboard");
  }

  return <UserPreference />;
}
