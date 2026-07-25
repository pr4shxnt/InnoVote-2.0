import { useEffect, useState } from "react";
import {
  createResearchPaper,
  deleteResearchPaper,
  listAdminResearchPapers,
  updateResearchPaper,
  type ResearchPaperInput,
} from "../../api/admin.ts";
import { ImageUploadField } from "../../components/ImageUploadField.tsx";
import type { AdminResearchPaper } from "../../types/index.ts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emptyForm: ResearchPaperInput = { title: "", description: "", imageUrl: "", teamName: "", teamMembers: [] };

export function AdminResearchPapers() {
  const [papers, setPapers] = useState<AdminResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ResearchPaperInput>(emptyForm);
  const [teamMembersInput, setTeamMembersInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    listAdminResearchPapers()
      .then((res) => setPapers(res.papers))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const teamMembers = teamMembersInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = { ...form, teamMembers };
    if (editingId) {
      await updateResearchPaper(editingId, payload);
    } else {
      await createResearchPaper(payload);
    }
    setForm(emptyForm);
    setTeamMembersInput("");
    setEditingId(null);
    load();
  }

  function startEdit(paper: AdminResearchPaper) {
    setEditingId(paper.id);
    setForm({
      title: paper.title,
      description: paper.description,
      imageUrl: paper.imageUrl,
      teamName: paper.teamName,
      teamMembers: paper.teamMembers,
      isActive: paper.isActive,
    });
    setTeamMembersInput(paper.teamMembers.join(", "));
  }

  async function handleDelete(id: string) {
    await deleteResearchPaper(id);
    load();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            {editingId ? "Update Research Paper" : "Create Research Paper"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="col-span-full space-y-1">
              <Label htmlFor="paper-title">Title</Label>
              <Input
                id="paper-title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="col-span-full space-y-1">
              <Label>Image</Label>
              <ImageUploadField value={form.imageUrl ?? ""} onChange={(imageUrl) => setForm({ ...form, imageUrl })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="paper-team">Team Name</Label>
              <Input
                id="paper-team"
                value={form.teamName}
                onChange={(e) => setForm({ ...form, teamName: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="paper-members">Team Members (comma separated)</Label>
              <Input id="paper-members" value={teamMembersInput} onChange={(e) => setTeamMembersInput(e.target.value)} />
            </div>
            <div className="col-span-full space-y-1">
              <Label htmlFor="paper-description">Description</Label>
              <textarea
                id="paper-description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="flex min-h-16 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div className="col-span-full flex gap-2">
              <Button type="submit">{editingId ? "Update Research Paper" : "Create Research Paper"}</Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                    setTeamMembersInput("");
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : papers.length === 0 ? (
        <p className="text-sm text-muted-foreground">No research papers yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {papers.map((p) => (
            <Card key={p.id} className="flex flex-col overflow-hidden">
              <div className="aspect-[1189/841] w-full overflow-hidden bg-muted">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className="h-full w-full object-contain" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <CardContent className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold leading-tight text-foreground">{p.title}</p>
                  {p.isActive ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="destructive">Inactive</Badge>
                  )}
                </div>

                {p.description && <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>}

                {(p.teamName || p.teamMembers.length > 0) && (
                  <div className="text-xs text-muted-foreground">
                    {p.teamName && <p className="font-medium text-foreground">{p.teamName}</p>}
                    {p.teamMembers.length > 0 && <p className="mt-0.5">{p.teamMembers.join(", ")}</p>}
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <Badge variant="secondary">
                    {p.voteCount} {p.voteCount === 1 ? "vote" : "votes"}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(p)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
