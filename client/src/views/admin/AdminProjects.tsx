import { useEffect, useState } from "react";
import {
  createProject,
  deleteProject,
  listAdminProjects,
  updateProject,
  type ProjectInput,
} from "../../api/admin.ts";
import { ImageUploadField } from "../../components/ImageUploadField.tsx";
import type { AdminProject } from "../../types/index.ts";

const emptyForm: ProjectInput = {
  title: "",
  description: "",
  boothNumber: "",
  imageUrl: "",
  teamName: "",
  teamMembers: [],
};

export function AdminProjects() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ProjectInput>(emptyForm);
  const [teamMembersInput, setTeamMembersInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    listAdminProjects()
      .then((res) => setProjects(res.projects))
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
      await updateProject(editingId, payload);
    } else {
      await createProject(payload);
    }
    setForm(emptyForm);
    setTeamMembersInput("");
    setEditingId(null);
    load();
  }

  function startEdit(project: AdminProject) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      boothNumber: project.boothNumber,
      imageUrl: project.imageUrl,
      teamName: project.teamName,
      teamMembers: project.teamMembers,
      isActive: project.isActive,
    });
    setTeamMembersInput(project.teamMembers.join(", "));
  }

  async function handleDelete(id: string) {
    await deleteProject(id);
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
        <input
          required
          placeholder="Booth Number"
          value={form.boothNumber}
          onChange={(e) => setForm({ ...form, boothNumber: e.target.value })}
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
            {editingId ? "Update Project" : "Create Project"}
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
          {projects.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-[color:var(--border-card)] bg-[color:var(--bg-card)] px-4 py-3">
              <div>
                <p className="font-medium">
                  {p.title} <span className="text-xs text-[color:var(--text-muted)]">Booth #{p.boothNumber}</span>
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
