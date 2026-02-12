"use client";

import { Link } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ExternalLink,
  ShoppingBag,
  Link2,
  GripVertical,
  Edit,
  Trash2,
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkCardProps {
  link: Link;
  isEditing?: boolean;
  sortable?: boolean;
  onEdit?: (link: Link) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
  onClick?: (link: Link) => void;
}

const gradientStyles = {
  none: "",
  "gradient-1": "link-gradient-1 text-white border-0",
  "gradient-2": "link-gradient-2 text-white border-0",
  "gradient-3": "link-gradient-3 text-white border-0",
  "gradient-4": "link-gradient-4 text-white border-0",
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

export function LinkCard({
  link,
  isEditing = false,
  sortable = false,
  onEdit,
  onDelete,
  onToggleActive,
  onClick,
}: LinkCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id, disabled: !sortable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Get the appropriate icon based on link_type or fall back to type-based icon
  const IconComponent = link.type === "product" 
    ? ShoppingBag 
    : linkTypeIcons[link.link_type || "website"] || Link2;

  if (isEditing) {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className={cn(
          "p-4 flex items-center gap-3 transition-all duration-200",
          !link.is_active && "opacity-60",
          isDragging && "opacity-50 shadow-lg ring-2 ring-primary/20 z-50"
        )}
      >
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1"
        >
          <GripVertical size={20} />
        </div>

        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
            gradientStyles[link.gradient_style] || "bg-secondary"
          )}
        >
          <IconComponent size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{link.title}</h3>
          <p className="text-xs text-muted-foreground truncate">{link.url}</p>
          {link.type === "product" && link.price && (
            <p className="text-xs font-medium text-primary mt-0.5">
              ${link.price}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Switch
                    checked={link.is_active}
                    onCheckedChange={(checked) =>
                      onToggleActive?.(link.id, checked)
                    }
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{link.is_active ? "Visible" : "Hidden"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit?.(link)}
          >
            <Edit size={16} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete?.(link.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </Card>
    );
  }

  // Public view
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onClick?.(link)}
      className={cn(
        "block w-full transition-link",
        !link.is_active && "hidden"
      )}
    >
      <Card
        className={cn(
          "p-4 flex items-center gap-4 group cursor-pointer border-2 hover:border-primary/30",
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
          <h3 className="font-semibold text-base truncate">{link.title}</h3>
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
      </Card>
    </a>
  );
}
