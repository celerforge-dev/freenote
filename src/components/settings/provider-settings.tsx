import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProviderSettingsProps {
  baseUrl: string;
  apiKey: string;
  onBaseUrlChange: (value: string) => void;
  onApiKeyChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ProviderSettings({
  baseUrl,
  apiKey,
  onBaseUrlChange,
  onApiKeyChange,
  onSave,
  onCancel,
}: ProviderSettingsProps) {
  return (
    <div className="space-y-4 py-4">
      <h3 className="text-lg font-medium">LLM Provider</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Configure your OpenAI API settings to connect with the AI services.
      </p>
      <div className="grid gap-2">
        <Label htmlFor="baseUrl">API Base URL</Label>
        <Input
          id="baseUrl"
          value={baseUrl}
          onChange={(e) => onBaseUrlChange(e.target.value)}
          placeholder="https://api.openai.com/v1"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Default: https://api.openai.com/v1
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="apiKey">API Key</Label>
        <Input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="Enter your OpenAI API key"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Your API key is stored locally and never shared.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          You can get your API key from{" "}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            OpenAI&apos;s API Keys page
          </a>{" "}
          after creating an account.
        </p>
      </div>
      <div className="mt-8 flex items-center justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>Save changes</Button>
      </div>
    </div>
  );
}
