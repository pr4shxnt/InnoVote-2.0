import { useState } from "react";
import { uploadImage } from "../api/admin.ts";
import { ApiError } from "../api/client.ts";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUploadField({ value, onChange }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="col-span-full flex items-start gap-3">
      {value ? (
        <img src={value} alt="Preview" className="h-16 w-16 rounded-lg object-cover" />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-[color:var(--border-card)] text-[10px] text-[color:var(--text-muted)]">
          No image
        </div>
      )}
      <div className="flex-1 space-y-1">
        <input
          placeholder="Image URL"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-[color:var(--border-card)] bg-transparent px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        />
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-[color:var(--text-muted)]">
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
          <span className="rounded-lg border border-[color:var(--border-card)] px-3 py-1.5 hover:bg-[color:var(--bg-elevated)]">
            {uploading ? "Uploading…" : "Upload image"}
          </span>
        </label>
        {error && <p className="text-xs text-status-error">{error}</p>}
      </div>
    </div>
  );
}
