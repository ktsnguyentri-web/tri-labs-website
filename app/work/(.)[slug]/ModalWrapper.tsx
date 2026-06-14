"use client";

import { useRouter } from "next/navigation";
import React, { ReactElement } from "react";

interface ChildProps {
  onClose?: () => void;
}

export function ModalWrapper({ children }: { children: ReactElement<ChildProps> }) {
  const router = useRouter();

  return React.cloneElement(children, {
    onClose: () => router.back(),
  });
}
