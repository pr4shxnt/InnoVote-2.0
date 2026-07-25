import { useEffect, useState } from "react";
import { blockUser, listUsers, unblockUser } from "../../api/admin.ts";
import type { AdminUserRecord } from "../../types/index.ts";

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [blockNumber, setBlockNumber] = useState("");

  function load() {
    setLoading(true);
    listUsers()
      .then((res) => setUsers(res.users))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleBlock(e: React.FormEvent) {
    e.preventDefault();
    await blockUser(`+977${blockNumber}`);
    setBlockNumber("");
    load();
  }

  async function handleUnblock(phoneNumber: string) {
    await unblockUser(phoneNumber);
    load();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleBlock} className="flex gap-2 rounded-xl border border-[color:var(--border-card)] bg-[color:var(--bg-card)] p-4">
        <div className="flex flex-1 overflow-hidden rounded-lg border border-[color:var(--border-card)] focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-[color:var(--brand-primary-glow)]">
          <span className="flex items-center bg-[color:var(--bg-elevated)] px-3 py-2 text-sm text-[color:var(--text-muted)] border-r border-[color:var(--border-card)]">
            +977
          </span>
          <input
            required
            maxLength={10}
            placeholder="98XXXXXXXX"
            value={blockNumber}
            onChange={(e) => setBlockNumber(e.target.value.replace(/\D/g, ""))}
            className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none"
          />
        </div>
        <button type="submit" className="rounded-lg bg-status-error px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          Block
        </button>
      </form>
      <p className="-mt-4 text-xs text-[color:var(--text-tertiary)]">
        To unblock, enter the same number above and use the Unblock button on that voter's row below.
      </p>

      {loading ? (
        <p className="text-sm text-[color:var(--text-muted)]">Loading…</p>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between rounded-lg border border-[color:var(--border-card)] bg-[color:var(--bg-card)] px-4 py-3">
              <div>
                <p className="font-medium">
                  {u.displayName} <span className="text-xs text-[color:var(--text-muted)]">{u.phoneNumber}</span>
                </p>
                <p className="text-xs text-[color:var(--text-muted)]">
                  {u.hasVoted ? `Voted at ${u.votedAt ? new Date(u.votedAt).toLocaleString() : "—"}` : "Not voted"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    u.status === "BLOCKED" ? "bg-[#FEF2F2] text-status-error" : "bg-[#ECFDF5] text-status-success"
                  }`}
                >
                  {u.status}
                </span>
                {u.status === "BLOCKED" && (
                  <button
                    onClick={() => handleUnblock(`+977${blockNumber}`)}
                    disabled={!blockNumber}
                    title="Enter the number in the field above, then click here"
                    className="rounded-lg border border-[color:var(--border-card)] px-3 py-1 text-xs hover:bg-[color:var(--bg-elevated)] disabled:opacity-40"
                  >
                    Unblock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
