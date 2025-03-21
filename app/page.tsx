"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/editor");
  }, [router]);

  return null; // Optionally, you can return a loading spinner or message here
}