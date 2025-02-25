import SettingsButton from "@/components/settings/SettingsButton";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between py-2">
        {/* Your existing header content */}
        <div className="flex items-center gap-2">
          {/* Other header buttons */}
          <SettingsButton />
        </div>
      </div>
    </header>
  );
}
