import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../contexts/authContext";
import { doDeleteCurrentUser } from "../firebase/auth";

const API_BASE_URL = "http://127.0.0.1:8000";

function Profile() {
  const { currentUser, userLoggedIn, userProfile, refreshUserProfile } = useAuth();
  const [form, setForm] = useState({
    username: "",
    profile_pic: "",
    bio: "",
    linkedin: "",
    github: "",
    x_handle: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (userProfile) {
      setForm({
        username: userProfile.username || "",
        profile_pic: userProfile.profile_pic || "",
        bio: userProfile.bio || "",
        linkedin: userProfile.linkedin || "",
        github: userProfile.github || "",
        x_handle: userProfile.x_handle || "",
      });
    }
  }, [userProfile]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!currentUser?.uid) {
      return;
    }

    try {
      setIsSaving(true);
      setStatus("");
      // Updated: persist profile through FastAPI directly.
      await axios.put(`${API_BASE_URL}/users/${currentUser.uid}/profile`, form);
      await refreshUserProfile();
      setStatus("Profile updated successfully.");
    } catch {
      setStatus("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Added: random profile visual update is now generated and persisted by backend.
  const handleRandomizeProfile = async () => {
    if (!currentUser?.uid) {
      return;
    }

    try {
      setIsRandomizing(true);
      setStatus("");
      // Updated: backend generates username/avatar to keep data source in Python backend.
      const response = await axios.post(`${API_BASE_URL}/users/${currentUser.uid}/randomize`);
      const updated = response.data;
      setForm((prev) => ({
        ...prev,
        username: updated.username || prev.username,
        profile_pic: updated.profile_pic || prev.profile_pic,
      }));
      await refreshUserProfile();
      setStatus("Random profile style applied.");
    } catch {
      setStatus("Failed to randomize profile. Please try again.");
    } finally {
      setIsRandomizing(false);
    }
  };

  // Added: permanent delete flow for Firebase auth + backend data with confirmation.
  const handleDeleteAccount = async () => {
    if (!currentUser?.uid) {
      return;
    }

    const confirmed = window.confirm(
      "This will permanently delete your account, profile, and question history. This action cannot be undone. Continue?",
    );
    if (!confirmed) {
      return;
    }

    const userId = currentUser.uid;

    try {
      setIsDeleting(true);
      setStatus("");
      await doDeleteCurrentUser();
      // Updated: delete all backend records for this user after Firebase deletion.
      await axios.delete(`${API_BASE_URL}/users/${userId}/full-delete`);
    } catch (error) {
      if (error?.code === "auth/requires-recent-login") {
        setStatus("Please log in again, then retry account deletion.");
      } else {
        setStatus("Account deletion failed. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (!userLoggedIn) {
    return <Navigate to="/Login" />;
  }

  return (
    <div className="page-shell mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <div className="section-pop stagger-1 glass-card rounded-2xl p-5 sm:p-7">
        <h1 className="retro-title mb-6 text-center text-4xl text-rose-100 sm:text-5xl">Edit Profile</h1>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <img
                src={form.profile_pic || "https://api.dicebear.com/9.x/thumbs/svg?seed=default-profile"}
                alt="Profile"
                className="h-20 w-20 rounded-full border border-white/20 bg-slate-900/70 object-cover"
              />
              <div>
                <p className="text-sm text-slate-200">{currentUser?.email || userProfile?.email || ""}</p>
                <p className="text-xs text-slate-400">{userProfile?.auth_provider || "unknown"}</p>
              </div>
            </div>
            <button
              type="button"
              disabled={isRandomizing || isSaving || isDeleting}
              className="warm-button cursor-pointer rounded-lg border border-rose-100/25 px-4 py-2 text-sm font-semibold"
              onClick={handleRandomizeProfile}
            >
              {isRandomizing ? "Randomizing..." : "Random Pic"}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm text-slate-300">
              <span>Username</span>
              <input
                value={form.username}
                onChange={(e) => updateField("username", e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-slate-950/60 px-3 py-2 text-slate-100 focus:border-rose-300 focus:outline-none"
                required
              />
            </label>
            <label className="space-y-1 text-sm text-slate-300">
              <span>Profile Pic URL</span>
              <input
                value={form.profile_pic}
                onChange={(e) => updateField("profile_pic", e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-slate-950/60 px-3 py-2 text-slate-100 focus:border-rose-300 focus:outline-none"
                placeholder="https://..."
              />
            </label>
          </div>

          <label className="block space-y-1 text-sm text-slate-300">
            <span>Bio</span>
            <textarea
              value={form.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              className="min-h-24 w-full rounded-lg border border-white/15 bg-slate-950/60 px-3 py-2 text-slate-100 focus:border-rose-300 focus:outline-none"
              placeholder="Write a short bio"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="space-y-1 text-sm text-slate-300">
              <span>LinkedIn</span>
              <input
                value={form.linkedin}
                onChange={(e) => updateField("linkedin", e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-slate-950/60 px-3 py-2 text-slate-100 focus:border-rose-300 focus:outline-none"
                placeholder="linkedin.com/in/..."
              />
            </label>
            <label className="space-y-1 text-sm text-slate-300">
              <span>GitHub</span>
              <input
                value={form.github}
                onChange={(e) => updateField("github", e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-slate-950/60 px-3 py-2 text-slate-100 focus:border-rose-300 focus:outline-none"
                placeholder="github.com/..."
              />
            </label>
            <label className="space-y-1 text-sm text-slate-300">
              <span>X</span>
              <input
                value={form.x_handle}
                onChange={(e) => updateField("x_handle", e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-slate-950/60 px-3 py-2 text-slate-100 focus:border-rose-300 focus:outline-none"
                placeholder="x.com/..."
              />
            </label>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-300">{status}</p>
            <button
              type="submit"
              disabled={isSaving || isDeleting}
              className="warm-button cursor-pointer rounded-lg border border-rose-100/25 px-5 py-2 text-sm font-semibold disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </div>

          <div className="rounded-xl border border-red-300/20 bg-red-500/10 p-4">
            <p className="text-sm font-semibold text-red-200">Danger Zone</p>
            <p className="mt-1 text-xs text-red-100/80">
              Delete your account permanently. This removes Firebase auth, profile data, and question history.
            </p>
            <button
              type="button"
              disabled={isDeleting || isSaving}
              onClick={handleDeleteAccount}
              className="mt-3 cursor-pointer rounded-lg border border-red-200/30 bg-red-500/80 px-4 py-2 text-sm font-semibold text-red-50 transition hover:-translate-y-0.5 hover:bg-red-500 disabled:opacity-60"
            >
              {isDeleting ? "Deleting Account..." : "Delete Account Permanently"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
