import type { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto mt-[var(--navbar-height)] max-w-5xl px-4 py-8">{children}</div>;
}
