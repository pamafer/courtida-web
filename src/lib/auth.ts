import { supabase } from "./supabase";

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "moderator" | "user";
  club_id: string | null;
  avatar_initials: string | null;
  is_active: boolean;
  club?: {
    id: string;
    name: string;
    slug: string;
    plan: string;
  };
};

export async function getUserProfile(): Promise<UserProfile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, clubs(id, name, slug, plan)")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
    club_id: profile.club_id,
    avatar_initials: profile.avatar_initials,
    is_active: profile.is_active,
    club: profile.clubs || undefined,
  } as UserProfile;
}

export function getDashboardPath(role: string): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "moderator":
      return "/club";
    case "user":
      return "/app";
    default:
      return "/";
  }
}
