import type { Profile } from "@prisma/client";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function ProfileSettingsView({ profile }: { profile: Profile }) {
  const supabase = useSupabaseClient();
  const user = useUser();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<Profile["username"]>(null);
  const [full_name, setFullName] = useState<Profile["full_name"]>(null);
  const [avatar_url, setAvatarUrl] = useState<Profile["avatar_url"]>(null);

  useEffect(() => {
    getProfile();
  }, [profile]);

  async function getProfile() {
    try {
      setLoading(true);
      if (profile) {
        setUsername(profile.username);
        setFullName(profile.full_name);
        setAvatarUrl(profile.avatar_url);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    full_name,
    avatar_url,
  }: {
    username: Profile["username"];
    full_name: Profile["full_name"];
    avatar_url: Profile["avatar_url"];
  }) {
    try {
      setLoading(true);
      if (!user) throw new Error("No user");

      const updates = {
        id: user.id,
        username,
        full_name,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      if (error) throw error;
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Error updating the data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="text-md form-control card m-4 gap-2 rounded-3xl border-2 border-base-300 p-8">
        <h2 className="text-xl">Account Settings</h2>
        <div>
          <label className="label inline-block" htmlFor="email">
            Email:
          </label>
          <input
            className="input-bordered input input-sm"
            id="email"
            type="text"
            value={user?.email}
            disabled
          />
        </div>
        <div>
          <label className="label inline-block" htmlFor="name">
            Full Name:
          </label>
          <input
            className="input-bordered input input-sm"
            id="name"
            type="text"
            value={full_name ?? ""}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label className="label inline-block" htmlFor="username">
            Username:
          </label>
          <div className="inline-block">
            <label className="input-group">
              <span className="px-2">@</span>
              <input
                className="input-bordered input input-sm"
                id="username"
                type="text"
                value={username ?? ""}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div>
          <button
            className="btn-outline btn-primary btn-wide btn mt-4"
            onClick={() => updateProfile({ username, full_name, avatar_url })}
            disabled={false}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>

    </>
  );
}
