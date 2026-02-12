import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  User,
  Settings,
  LogOut,
  ExternalLink,
  Layout,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Linktree Clone - Your Links",
  description: "Manage your links and products",
};

async function getProfile(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  const profile = await getProfile(user.id);

  return (
    <div className="min-h-screen flex flex-col bg-slate-200">
      {/* Header */}
      <header className="sticky top-0 z-50 flex justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <div className="w-4/5 flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Layout className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg hidden sm:inline">
                TinyLink
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* <ThemeSwitcher /> */}

            {profile && (
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link href={`/${profile.username}`} target="_blank">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Page
                </Link>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {profile?.display_name?.charAt(0).toUpperCase() ||
                        profile?.username?.charAt(0).toUpperCase() ||
                        user.email?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center gap-2 p-2">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">
                      {profile?.display_name || profile?.username || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <Layout className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {profile && (
                  <DropdownMenuItem asChild>
                    <Link href={`/${profile.username}`} target="_blank" className="cursor-pointer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Public Page
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
                  <form
                    action={async () => {
                      "use server";
                      const supabase = await createClient();
                      await supabase.auth.signOut();
                      redirect("/auth/login");
                    }}
                  >
                    <button type="submit" className="flex w-full items-center cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
