"use client";

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    // A hard navigation guarantees the server-rendered Navbar re-reads the
    // (now-cleared) session cookie instead of relying on router cache state.
    window.location.assign("/");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="hidden text-sm text-ivory/70 transition-colors hover:text-ivory sm:inline"
    >
      Log out
    </button>
  );
}
