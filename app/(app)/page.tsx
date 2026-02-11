import { redirect } from "next/navigation";

export default function AppRootPage() {
  // Redirect logged-in users to dashboard
  redirect("/dashboard");
}
