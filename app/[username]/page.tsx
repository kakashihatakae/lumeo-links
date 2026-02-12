export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Profile, Link as LinkType } from "@/lib/database.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ShoppingBag, 
  Link2, 
  ExternalLink,
  Instagram,
  Twitter,
  Youtube,
  Github,
  Linkedin,
  Facebook,
  Twitch,
  Globe,
  Music,
  Smartphone,
  ShoppingCart,
  MessageCircle,
  Video
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter,
  youtube: Youtube,
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
  twitch: Twitch,
  website: Globe,
};

// Map link types to their icons
const linkTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  website: Globe,
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter,
  youtube: Youtube,
  tiktok: Video,
  linkedin: Linkedin,
  github: Github,
  facebook: Facebook,
  twitch: Twitch,
  discord: MessageCircle,
  spotify: Music,
  apple: Smartphone,
  google: Globe,
  amazon: ShoppingCart,
  other: Link2,
};

const gradientStyles = {
  none: "",
  "gradient-1": "link-gradient-1 text-white border-0",
  "gradient-2": "link-gradient-2 text-white border-0",
  "gradient-3": "link-gradient-3 text-white border-0",
  "gradient-4": "link-gradient-4 text-white border-0",
};

async function getProfile(username: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username.toLowerCase())
    .single();
  return data;
}

async function getLinks(profileId: string): Promise<LinkType[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("links")
    .select("*")
    .eq("profile_id", profileId)
    .eq("is_active", true)
    .order("position", { ascending: true });
  return data || [];
}

async function getSocialLinks(profileId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("social_links")
    .select("*")
    .eq("profile_id", profileId)
    .order("position", { ascending: true });
  return data || [];
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfile(username);
  
  if (!profile) {
    return {
      title: "Profile Not Found",
    };
  }

  return {
    title: `${profile.display_name || profile.username} | TinyLink`,
    description: profile.bio || `Check out ${profile.display_name || profile.username}'s links`,
  };
}

// Loading skeleton for the profile page
function ProfileSkeleton() {
  return (
    <div className="min-h-screen">
      <main className="container max-w-xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </main>
    </div>
  );
}

// Profile content component
async function ProfileContent({ username }: { username: string }) {
  const profile = await getProfile(username);

  if (!profile) {
    notFound();
  }

  const [links, socialLinks] = await Promise.all([
    getLinks(profile.id),
    getSocialLinks(profile.id),
  ]);

  const initials = profile.display_name?.charAt(0).toUpperCase() ||
    profile.username?.charAt(0).toUpperCase() || "?";

  // Determine background style
  const backgroundClass = {
    solid: "",
    gradient: "bg-gradient-to-br from-background via-muted to-background",
    dots: "bg-pattern-dots",
  }[profile.background_style || "solid"];

  return (
    <div className={cn("min-h-screen", backgroundClass)}>
      {/* Header Logo */}
      <header className="absolute top-0 left-0 right-0 p-4">
        <div className="container max-w-xl mx-auto flex justify-end">
          <Link 
            href="/" 
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Powered by TinyLink
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-xl mx-auto px-4 py-16">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-background shadow-xl">
            <AvatarImage src={profile.avatar_url || ""} />
            <AvatarFallback className="bg-primary/10 text-primary text-3xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <h1 className="text-2xl font-bold mb-2">
            {profile.display_name || profile.username}
          </h1>

          {profile.bio && (
            <p className="text-muted-foreground max-w-md mx-auto">
              {profile.bio}
            </p>
          )}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex justify-center gap-3 mt-6">
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.platform.toLowerCase()] || Globe;
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                    title={social.platform}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="space-y-4">
          {links.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No links to show yet.</p>
            </div>
          ) : (
            links.map((link) => {
              // Get the appropriate icon based on link_type or fall back to type-based icon
              const IconComponent = link.type === "product" 
                ? ShoppingBag 
                : linkTypeIcons[link.link_type || "website"] || Link2;
              
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full transition-link"
                >
                  <div
                    className={cn(
                      "p-4 rounded-xl flex items-center gap-4 group cursor-pointer border-2 hover:border-primary/30 shadow-sm",
                      gradientStyles[link.gradient_style] || "bg-card hover:bg-accent"
                    )}
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                        link.gradient_style === "none" && "bg-secondary"
                      )}
                    >
                      <IconComponent size={22} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base truncate">
                        {link.title}
                      </h3>
                      {link.type === "product" && link.price ? (
                        <p
                          className={cn(
                            "text-sm font-medium mt-0.5",
                            link.gradient_style !== "none"
                              ? "text-white/90"
                              : "text-primary"
                          )}
                        >
                          ${link.price}
                        </p>
                      ) : (
                        <p
                          className={cn(
                            "text-sm truncate",
                            link.gradient_style !== "none"
                              ? "text-white/80"
                              : "text-muted-foreground"
                          )}
                        >
                          {link.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                        </p>
                      )}
                    </div>

                    <div
                      className={cn(
                        "opacity-0 group-hover:opacity-100 transition-opacity",
                        link.gradient_style !== "none" && "text-white"
                      )}
                    >
                      <ExternalLink size={18} />
                    </div>
                  </div>
                </a>
              );
            })
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center">
        <Link
          href="/auth/sign-up"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Create your own TinyLink
        </Link>
      </footer>
    </div>
  );
}

// Main page component
export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent username={username} />
    </Suspense>
  );
}
