"use client";

import SettingsModal from "@/components/settings/SettingsModal";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const handleClose = () => {
    router.push("/");
  };

  return <SettingsModal isOpen={true} onClose={handleClose} />;
}
