"use client";

import { LogoutForm } from "@/components/auth/logout-form";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-bold">Admin Page</h1>
      <div className="mt-4">
        <LogoutForm />
      </div>
    </main>
  );
}
