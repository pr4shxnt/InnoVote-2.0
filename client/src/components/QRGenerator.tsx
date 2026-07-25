import { QRCodeSVG } from "qrcode.react";

export function QRGenerator({ projectId, size = 128 }: { projectId: string; size?: number }) {
  const url = `${window.location.origin}/?project=${projectId}`;
  return (
    <div className="inline-flex flex-col items-center gap-2 rounded-lg bg-white p-3">
      <QRCodeSVG value={url} size={size} />
    </div>
  );
}
