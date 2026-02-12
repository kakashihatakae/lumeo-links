"use client";

import { useState } from "react";
import { Link } from "@/lib/database.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkEditorProps {
  link: Link | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: Partial<Link>) => void;
}

const gradientOptions = [
  { value: "none", label: "Default", class: "" },
  { value: "gradient-1", label: "Violet", class: "link-gradient-1" },
  { value: "gradient-2", label: "Rose", class: "link-gradient-2" },
  { value: "gradient-3", label: "Teal", class: "link-gradient-3" },
  { value: "gradient-4", label: "Amber", class: "link-gradient-4" },
];

const linkTypeOptions = [
  { value: "website", label: "Website", icon: Globe },
  { value: "instagram", label: "Instagram", icon: Instagram },
  // { value: "twitter", label: "Twitter", icon: Twitter },
  { value: "x", label: "X (Twitter)", icon: Twitter },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "tiktok", label: "TikTok", icon: Video },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "github", label: "GitHub", icon: Github },
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "twitch", label: "Twitch", icon: Twitch },
  { value: "discord", label: "Discord", icon: MessageCircle },
  { value: "spotify", label: "Spotify", icon: Music },
  // { value: "apple", label: "Apple", icon: Smartphone },
  // { value: "google", label: "Google", icon: Globe },
  // { value: "amazon", label: "Amazon", icon: ShoppingCart },
  { value: "other", label: "Other", icon: Link2 },
];

export function LinkEditor({ link, isOpen, onClose, onSave }: LinkEditorProps) {
  const isEditing = !!link?.id;
  const [formData, setFormData] = useState<Partial<Link>>(isEditing ? {...link} : {
    title: "",
    url: "",
    type: "link",
    price: null,
    currency: "USD",
    gradient_style: "none",
    is_active: true,
  });

  const isProduct = formData.type === "product";
  const selectedLinkType =
    linkTypeOptions.find((o) => o.value === formData.link_type) ||
    linkTypeOptions[0];
  const SelectedIcon = selectedLinkType.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof Link, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const title = isEditing ? `Edit new ${formData.type}` : `Add new ${formData.type}`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Link Type Tabs */}
          <Tabs
            value={formData.type}
            onValueChange={(v) => handleChange("type", v as "link" | "product")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="link"
                className="flex items-center gap-2"
                disabled={isEditing && formData.type != "link"}
              >
                <Link2 size={16} />
                Link
              </TabsTrigger>
              <TabsTrigger
                value="product"
                className="flex items-center gap-2"
                disabled={isEditing && formData.type != "product"}
              >
                <ShoppingBag size={16} />
                Product
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Link Type Selection */}
          {formData.type === "link" && (
            <div className="space-y-2">
              <Label>Link Type</Label>
              <Select
                value={formData.link_type || "website"}
                onValueChange={(v) =>
                  handleChange("link_type", v as Link["link_type"])
                }
              >
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <SelectedIcon className="w-4 h-4" />
                      {selectedLinkType.label}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {linkTypeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This determines which icon appears on your page
              </p>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              {isProduct ? "Product Name" : "Link Title"}
            </Label>
            <Input
              id="title"
              placeholder={isProduct ? "My Awesome Product" : "My Website"}
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url">
              {isProduct ? "Product URL" : "Link URL"}
            </Label>
            <div className="relative">
              <Input
                id="url"
                type="url"
                placeholder="https://..."
                value={formData.url}
                onChange={(e) => handleChange("url", e.target.value)}
                required
                className="pr-10"
              />
              <ExternalLink
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>

          {/* Price (only for products) */}
          {isProduct && (
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.currency || "USD"}
                  onValueChange={(v) => handleChange("currency", v)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="29.99"
                  value={formData.price || ""}
                  onChange={(e) =>
                    handleChange(
                      "price",
                      e.target.value ? parseFloat(e.target.value) : null,
                    )
                  }
                  className="flex-1"
                />
              </div>
            </div>
          )}

          {/* Style */}
          <div className="space-y-3">
            <Label>Card Style</Label>
            <div className="grid grid-cols-5 gap-2">
              {gradientOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange("gradient_style", option.value)}
                  className={cn(
                    "h-10 rounded-lg border-2 transition-all",
                    option.class || "bg-secondary",
                    formData.gradient_style === option.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-border",
                  )}
                  title={option.label}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {
                gradientOptions.find((o) => o.value === formData.gradient_style)
                  ?.label
              }
            </p>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="active">Visible</Label>
              <p className="text-xs text-muted-foreground">
                Show this on your profile
              </p>
            </div>
            <Switch
              id="active"
              checked={formData.is_active}
              onCheckedChange={(v) => handleChange("is_active", v)}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {isEditing ? "Save Changes" : "Add Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
