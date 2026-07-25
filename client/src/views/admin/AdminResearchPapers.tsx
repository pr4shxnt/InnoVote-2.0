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
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2 rounded-xl border border-[color:var(--border-card)] bg-[color:var(--bg-card)] p-4 sm:grid-cols-2">
        <input
          required
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-lg border border-[color:var(--border-card)] bg-transparent px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        />
        <ImageUploadField value={form.imageUrl ?? ""} onChange={(imageUrl) => setForm({ ...form, imageUrl })} />
        <input
          placeholder="Team Name"
          value={form.teamName}
          onChange={(e) => setForm({ ...form, teamName: e.target.value })}
          className="rounded-lg border border-[color:var(--border-card)] bg-transparent px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        />
        <input
          placeholder="Team members (comma separated)"
          value={teamMembersInput}
          onChange={(e) => setTeamMembersInput(e.target.value)}
          className="rounded-lg border border-[color:var(--border-card)] bg-transparent px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="col-span-full rounded-lg border border-[color:var(--border-card)] bg-transparent px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        />
        <div className="col-span-full flex gap-2">
          <button type="submit" className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600">
            {editingId ? "Update Research Paper" : "Create Research Paper"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setTeamMembersInput("");
              }}
              className="rounded-lg border border-[color:var(--border-card)] px-4 py-2 text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-[color:var(--text-muted)]">Loading…</p>
      ) : (
        <div className="space-y-2">
          {papers.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-[color:var(--border-card)] bg-[color:var(--bg-card)] px-4 py-3">
              <div>
                <p className="font-medium">
                  {p.title} <span className="text-xs text-[color:var(--text-muted)]">{p.teamName}</span>
                </p>
                {!p.isActive && <span className="text-xs text-status-error">Inactive</span>}
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[color:var(--bg-elevated)] px-3 py-1 text-xs font-semibold text-primary-500">
                  {p.voteCount} {p.voteCount === 1 ? "vote" : "votes"}
                </span>
                <button onClick={() => startEdit(p)} className="rounded-lg border border-[color:var(--border-card)] px-3 py-1 text-xs hover:bg-[color:var(--bg-elevated)]">
                  Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="rounded-lg border border-status-error px-3 py-1 text-xs text-status-error hover:bg-[#FEF2F2]">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
