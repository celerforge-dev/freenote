import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface EmbeddingsSettingsProps {
  autoUpdate: boolean;
  onAutoUpdateChange: (value: boolean) => void;
  onSync: () => void;
  isSyncing: boolean;
}

export function EmbeddingsSettings({
  autoUpdate,
  onAutoUpdateChange,
  onSync,
  isSyncing,
}: EmbeddingsSettingsProps) {
  return (
    <div className="space-y-6 py-4">
      <div>
        <h3 className="text-lg font-medium">Embeddings</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your AI embeddings settings and synchronization.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-update" className="text-base">
              Auto-update Embeddings
            </Label>
            <p className="text-[13px] text-muted-foreground">
              Automatically update embeddings when notes are modified
            </p>
          </div>
          <Switch
            id="auto-update"
            checked={autoUpdate}
            onCheckedChange={onAutoUpdateChange}
          />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <div className="space-y-1">
          <h4 className="font-medium">Manual Synchronization</h4>
          <p className="text-[13px] text-muted-foreground">
            Update embeddings for all notes to ensure your AI has the latest
            content
          </p>
        </div>
        <Button
          onClick={onSync}
          disabled={isSyncing}
          className="w-full sm:w-auto"
        >
          <Icons.refreshCw
            className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
          />
          {isSyncing ? "Synchronizing..." : "Synchronize Now"}
        </Button>
      </div>
    </div>
  );
}
