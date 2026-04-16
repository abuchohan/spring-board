"use client";

import { useState, useEffect } from "react";
import { getMeApi, type User } from "@/lib/api";

export function useMe() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getMeApi()
      .then((d) => setUser(d.user))
      .catch(() => {});
  }, []);

  return { user };
}
