"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { token } = useSelector((state) => state.admin);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login"); 
    }
  }, [token, router]); 

  return null; 
}
