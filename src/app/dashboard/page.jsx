"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/my-listings");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full bg-black select-none">
      {/* High-Performance Hero UI & Tailwind Dynamic Spinner Component */}
      <div className="w-8 h-8 border-3 border-zinc-800 border-t-[var(--vibrant-lime)] rounded-full animate-spin" />
    </div>
  );
}
