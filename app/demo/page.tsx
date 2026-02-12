import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Video,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Demo data
const demoProfile = {
  username: "alexdesigns",
  display_name: "Alex Designs",
  bio: "Creative designer & content creator. Sharing my work and favorite tools.",
  avatar_url: null,
  background_style: "dots" as const,
};

interface DemoLink {
  id: string;
  title: string;
  url: string;
  type: "link" | "product";
  link_type: string;
  price: number | null;
  gradient_style: "none" | "gradient-1" | "gradient-2" | "gradient-3" | "gradient-4";
  is_active: boolean;
}

const demoLinks: DemoLink[] = [
  {
    id: "1",
    title: "My Portfolio",
    url: "https://example.com/portfolio",
    type: "link",
    link_type: "website",
    price: null,
    gradient_style: "gradient-1",
    is_active: true,
  },
  {
    id: "2",
    title: "Design Course",
    url: "https://example.com/course",
    type: "product",
    link_type: "other",
    price: 49.99,
    gradient_style: "gradient-2",
    is_active: true,
  },
  {
    id: "3",
    title: "Instagram",
    url: "https://instagram.com/alexdesigns",
    type: "link",
    link_type: "instagram",
    price: null,
    gradient_style: "none",
    is_active: true,
  },
  {
    id: "4",
    title: "YouTube Channel",
    url: "https://youtube.com/alexdesigns",
    type: "link",
    link_type: "youtube",
    price: null,
    gradient_style: "none",
    is_active: true,
  },
  {
    id: "5",
    title: "Merchandise",
    url: "https://example.com/merch",
    type: "product",
    link_type: "other",
    price: 24.99,
    gradient_style: "gradient-4",
    is_active: true,
  },
];

const demoSocials = [
  { platform: "instagram", url: "https://instagram.com" },
  { platform: "twitter", url: "https://twitter.com" },
  { platform: "youtube", url: "https://youtube.com" },
];

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  github: Github,
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

export const metadata = {
  title: "Demo Profile | TinyLink",
  description: "See what your TinyLink page could look like",
};

export default function DemoPage() {
  const initials = demoProfile.display_name.charAt(0).toUpperCase();

  return (
    <div className={cn("min-h-screen bg-pattern-dots")}>
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-4">
        <div className="container max-w-xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-white rotate-180" />
            </div>
            <span className="font-semibold">Back to Home</span>
          </Link>
          <Button size="sm" asChild>
            <Link href="/auth/sign-up">Create Yours</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-xl mx-auto px-4 py-16">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-background shadow-xl">
            <AvatarImage src={demoProfile.avatar_url || ""} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white text-3xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <h1 className="text-2xl font-bold mb-2">
            {demoProfile.display_name}
          </h1>

          <p className="text-muted-foreground max-w-md mx-auto">
            {demoProfile.bio}
          </p>

          {/* Social Links */}
          <div className="flex justify-center gap-3 mt-6">
            {demoSocials.map((social, index) => {
              const Icon = socialIcons[social.platform] || Link2;
              return (
                <a
                  key={index}
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
        </div>

        {/* Links */}
        <div className="space-y-4">
          {demoLinks.map((link) => {
            // Get the appropriate icon based on link_type or fall back to type-based icon
            const IconComponent = link.type === "product" 
              ? ShoppingBag 
              : linkTypeIcons[link.link_type] || Link2;
            
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
          })}
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="py-12 text-center">
        <p className="text-muted-foreground mb-4">Want your own page like this?</p>
        <Button size="lg" asChild>
          <Link href="/auth/sign-up">
            Create Your Free Page
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </footer>
    </div>
  );
}
