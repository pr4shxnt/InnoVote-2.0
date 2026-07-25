import { useEffect, useState } from "react";
import { Calendar, Eye, Trophy, Vote } from "lucide-react";
import { getRound, updateRound } from "../../api/admin.ts";
import type { VotingRound } from "../../types/index.ts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function AdminResults() {
  const [round, setRound] = useState<VotingRound | null>(null);
  const [revealAtInput, setRevealAtInput] = useState("");
  const [votingOpensAtInput, setVotingOpensAtInput] = useState("");
  const [votingClosesAtInput, setVotingClosesAtInput] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    getRound()
      .then((res) => {
        setRound(res.round);
        setRevealAtInput(res.round.resultRevealAt ? res.round.resultRevealAt.slice(0, 16) : "");
        setVotingOpensAtInput(res.round.votingOpensAt ? res.round.votingOpensAt.slice(0, 16) : "");
        setVotingClosesAtInput(res.round.votingClosesAt ? res.round.votingClosesAt.slice(0, 16) : "");
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSetRevealAt(e: React.FormEvent) {
    e.preventDefault();
    const { round: updated } = await updateRound({
      resultRevealAt: revealAtInput ? new Date(revealAtInput).toISOString() : null,
    });
    setRound(updated);
  }

  async function handleTogglePublish() {
    if (!round) return;
    const { round: updated } = await updateRound({ isPublished: !round.isPublished });
    setRound(updated);
  }

  async function handleSetVotingWindow(e: React.FormEvent) {
    e.preventDefault();
    const { round: updated } = await updateRound({
      votingOpensAt: votingOpensAtInput ? new Date(votingOpensAtInput).toISOString() : null,
      votingClosesAt: votingClosesAtInput ? new Date(votingClosesAtInput).toISOString() : null,
    });
    setRound(updated);
  }

  async function handleSetOverride(override: "open" | "closed" | null) {
    const { round: updated } = await updateRound({ votingManualOverride: override });
    setRound(updated);
  }

  if (loading || !round) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 space-y-0">
          <Vote className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base font-semibold text-foreground">Voting Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2.5">
            <div>
              <p className="text-sm font-medium text-foreground">
                {round.votingOpen ? "Open — voters can cast votes" : "Closed to voters"}
              </p>
              {round.votingManualOverride && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Manual override: forced {round.votingManualOverride}. Schedule below is ignored until cleared.
                </p>
              )}
            </div>
            {round.votingOpen ? <Badge variant="success">Open</Badge> : <Badge variant="warning">Closed</Badge>}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => handleSetOverride("open")}
              className="bg-status-success text-white hover:bg-status-success/90"
            >
              Force Open Now
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleSetOverride("closed")}>
              Force Close Now
            </Button>
            {round.votingManualOverride && (
              <Button size="sm" variant="outline" onClick={() => handleSetOverride(null)}>
                Clear Override
              </Button>
            )}
          </div>

          <Separator />

          <div>
            <p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              Scheduled Voting Window
            </p>
            <p className="mb-3 text-xs text-muted-foreground">
              Leave a field blank for no bound. Ignored while a manual override is active.
            </p>
            <form onSubmit={handleSetVotingWindow} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="voting-opens-at">Opens At</Label>
                  <Input
                    id="voting-opens-at"
                    type="datetime-local"
                    value={votingOpensAtInput}
                    onChange={(e) => setVotingOpensAtInput(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="voting-closes-at">Closes At</Label>
                  <Input
                    id="voting-closes-at"
                    type="datetime-local"
                    value={votingClosesAtInput}
                    onChange={(e) => setVotingClosesAtInput(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" size="sm">
                Save Voting Window
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2 space-y-0">
          <Trophy className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base font-semibold text-foreground">Results Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2.5">
            <p className="text-sm font-medium text-foreground">
              {round.isPublished ? "Published — visible to voters" : "Hidden from voters"}
            </p>
            {round.isPublished ? <Badge variant="success">Published</Badge> : <Badge variant="warning">Hidden</Badge>}
          </div>

          <Button size="sm" onClick={handleTogglePublish}>
            {round.isPublished ? "Unpublish Results" : "Publish Results Now"}
          </Button>

          <Separator />

          <div>
            <p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              Scheduled Reveal Time
            </p>
            <p className="mb-3 text-xs text-muted-foreground">
              Results auto-publish at this time, in addition to the manual toggle above.
            </p>
            <form onSubmit={handleSetRevealAt} className="flex gap-2">
              <Input
                type="datetime-local"
                value={revealAtInput}
                onChange={(e) => setRevealAtInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm">
                Save
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
