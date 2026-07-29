import { getCurrentUser } from "@/lib/auth";
import SettingsForm from "@/components/dashboard/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-2xl italic text-ivory">Settings</h1>
        <p className="mt-1 text-sm text-ivory/50">
          Manage your account.
        </p>

        <div className="mt-8">
          <SettingsForm
            userId={user._id.toString()}
            initialName={user.name}
            initialEmail={user.email}
          />
        </div>
      </div>
    </div>
  );
}
