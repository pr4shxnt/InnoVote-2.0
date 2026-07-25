import { useEffect, useState } from "react";
import { blockUser, listUsers, unblockUser } from "../../api/admin.ts";
import type { AdminUserRecord } from "../../types/index.ts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Block a Voter</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBlock} className="flex gap-2">
            <div className="flex flex-1 overflow-hidden rounded-md border border-input bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <span className="flex items-center border-r border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
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
            <Button type="submit" variant="destructive">
              Block
            </Button>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">
            To unblock, enter the same number above and use the Unblock button on that voter's row below.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <p className="p-4 text-sm text-muted-foreground">Loading…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Voter</TableHead>
                  <TableHead>Voting Activity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <p className="font-medium text-foreground">{u.displayName}</p>
                      <p className="text-xs text-muted-foreground">{u.phoneNumber}</p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {u.hasVoted ? `Voted at ${u.votedAt ? new Date(u.votedAt).toLocaleString() : "—"}` : "Not voted"}
                    </TableCell>
                    <TableCell>
                      {u.status === "BLOCKED" ? (
                        <Badge variant="destructive">Blocked</Badge>
                      ) : (
                        <Badge variant="success">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {u.status === "BLOCKED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!blockNumber}
                          title="Enter the number in the field above, then click here"
                          onClick={() => handleUnblock(`+977${blockNumber}`)}
                        >
                          Unblock
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
