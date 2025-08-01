"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status:sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') router.push('/login');
  }, [session]);

  return (
    <main className="flex min-h-screen flex-col text-red-500 items-center justify-between p-24">
      MAIN PAGE
    </main>
  );
}
