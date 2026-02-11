"use client";

import { useState } from "react";
import { Profile } from "@/lib/database.types";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Camera } from "lucide-react";

interface ProfileEditorProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: Partial<Profile>) => void;
}

export function ProfileEditor({
  profile,
  isOpen,
  onClose,
  onSave,
}: ProfileEditorProps) {
  const [formData, setFormData] = useState<Partial<Profile>>({
    username: "",
    display_name: "",
    bio: "",
    avatar_url: "",
    theme: "auto",
    background_style: "solid",
    ...profile,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof Profile, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const initials = formData.display_name?.charAt(0).toUpperCase() ||
    formData.username?.charAt(0).toUpperCase() || "?";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarImage src={formData.avatar_url || ""} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors"
              >
                <Camera size={16} />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Avatar upload coming soon
            </p>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">@</span>
              <Input
                id="username"
                placeholder="yourname"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value.toLowerCase())}
                required
                pattern="[a-z0-9_]+"
                title="Only lowercase letters, numbers, and underscores"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Your unique profile URL: /{formData.username}
            </p>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              placeholder="Your Name"
              value={formData.display_name || ""}
              onChange={(e) => handleChange("display_name", e.target.value)}
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell your audience about yourself..."
              value={formData.bio || ""}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground text-right">
              {(formData.bio?.length || 0)}/200
            </p>
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={formData.theme}
              onValueChange={(v) => handleChange("theme", v as Profile["theme"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (System)</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Background Style */}
          <div className="space-y-2">
            <Label htmlFor="background">Background Style</Label>
            <Select
              value={formData.background_style || "solid"}
              onValueChange={(v) =>
                handleChange("background_style", v as Profile["background_style"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="dots">Dots Pattern</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Save Profile
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
