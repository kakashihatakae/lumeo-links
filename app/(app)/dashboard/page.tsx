"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Profile, Link } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { LinkCard } from "@/components/link-card";
import { LinkEditor } from "@/components/link-editor";
import { ProfileEditor } from "@/components/profile-editor";
import {
  Plus,
  Settings,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLinkEditorOpen, setIsLinkEditorOpen] = useState(false);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get profile
      let { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      // If no profile exists, create one
      if (profileError?.code === "PGRST116" || !profileData) {
        const username = user.email
          ? `${user.email.split("@")[0].toLowerCase()}_${Math.random().toString(36).substring(2, 6)}`
          : `user_${Math.random().toString(36).substring(2, 8)}`;

        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            username,
            display_name: user.email?.split("@")[0] || "New User",
          })
          .select()
          .single();

        if (createError) throw createError;
        profileData = newProfile;
      } else if (profileError) {
        throw profileError;
      }

      setProfile(profileData);

      // Get links
      const { data: linksData, error: linksError } = await supabase
        .from("links")
        .select("*")
        .eq("profile_id", profileData.id)
        .order("position", { ascending: true });

      if (linksError) throw linksError;
      setLinks(linksData || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddLink = () => {
    setEditingLink(null);
    setIsLinkEditorOpen(true);
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setIsLinkEditorOpen(true);
  };

  const handleSaveLink = async (linkData: Partial<Link>) => {
    try {
      if (!profile) return;

      if (editingLink) {
        // Update existing link
        const { error } = await supabase
          .from("links")
          .update(linkData)
          .eq("id", editingLink.id);

        if (error) throw error;
      } else {
        // Create new link
        const { error } = await supabase.from("links").insert({
          ...linkData,
          profile_id: profile.id,
          position: links.length,
        });

        if (error) throw error;
      }

      await fetchData();
    } catch (err) {
      console.error("Error saving link:", err);
      setError(err instanceof Error ? err.message : "Failed to save link");
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      const { error } = await supabase.from("links").delete().eq("id", id);
      if (error) throw error;
      await fetchData();
    } catch (err) {
      console.error("Error deleting link:", err);
      setError(err instanceof Error ? err.message : "Failed to delete link");
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("links")
        .update({ is_active: isActive })
        .eq("id", id);

      if (error) throw error;
      await fetchData();
    } catch (err) {
      console.error("Error toggling link:", err);
      setError(err instanceof Error ? err.message : "Failed to update link");
    }
  };

  const handleSaveProfile = async (profileData: Partial<Profile>) => {
    try {
      if (profile) {
        // Update existing profile
        const { error } = await supabase
          .from("profiles")
          .update(profileData)
          .eq("id", profile.id);

        if (error) throw error;
      } else {
        // Create new profile (edge case - should not happen with fetchData fix)
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { error } = await supabase.from("profiles").insert({
          user_id: user.id,
          ...profileData,
        });

        if (error) throw error;
      }
      await fetchData();
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err instanceof Error ? err.message : "Failed to save profile");
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-3xl py-8">
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-3xl py-8">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchData}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="py-8 flex flex-col w-4/5">
        {/* Profile Section */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {profile?.display_name || profile?.username || "Your Profile"}
              </h1>
              <p className="text-muted-foreground mt-1">@{profile?.username}</p>
              {profile?.bio && (
                <p className="mt-3 text-sm max-w-md">{profile.bio}</p>
              )}
              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsProfileEditorOpen(true)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`/${profile?.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Page
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Links Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Links</h2>
            <Button onClick={handleAddLink} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </div>

          {links.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No links yet</h3>
              <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                Add your first link to get started. You can add regular links or
                products with prices.
              </p>
              <Button onClick={handleAddLink}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Link
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {links.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  isEditing
                  onEdit={handleEditLink}
                  onDelete={handleDeleteLink}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          )}
        </div>

        {/* Editors */}
        <LinkEditor
          link={editingLink}
          isOpen={isLinkEditorOpen}
          onClose={() => setIsLinkEditorOpen(false)}
          onSave={handleSaveLink}
        />

        <ProfileEditor
          profile={profile}
          isOpen={isProfileEditorOpen}
          onClose={() => setIsProfileEditorOpen(false)}
          onSave={handleSaveProfile}
        />
      </div>
    </div>
  );
}
