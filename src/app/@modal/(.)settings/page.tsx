"use client";

import SettingsModal from "@/components/settings/SettingsModal";
import { useRouter } from "next/navigation";

export default function SettingsInterceptedPage() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return <SettingsModal isOpen={true} onClose={handleClose} />;
}
