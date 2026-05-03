"use client";

import { useRouter } from "next/navigation";
import React from "react";

export function ModalWrapper({ children }: { children: React.ReactElement }) {
  const router = useRouter();

  return React.cloneElement(children, {
    onClose: () => router.back(),
  });
}
