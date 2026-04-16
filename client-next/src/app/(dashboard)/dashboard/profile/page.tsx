"use client";

import { useMe } from "@/hooks/useMe";

export default function ProfilePage() {
  const { user } = useMe();

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>
      <div className="grid gap-4">
        <div className="grid gap-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
          <p className="text-sm font-medium">{user?.email}</p>
        </div>
        {user?.name && (
          <div className="grid gap-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Name</p>
            <p className="text-sm font-medium">{user.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
