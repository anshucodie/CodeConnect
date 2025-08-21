"use client";

import { useUser } from "~/components/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  createdAt: string;
}

interface Props {
  params: { orgId: string };
}

export default function OrganizationPage({ params }: Props) {
  const { user } = useUser();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [orgName, setOrgName] = useState("");
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    fetchProjects();
  }, [user, router, params.orgId]);

  const fetchProjects = async () => {
    try {
      // Mock data for now
      setOrgName("Your Organization");
      const mockProjects: Project[] = [];
      setProjects(mockProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Mock project creation
      const newProject: Project = {
        id: "project-" + Date.now(),
        name: newProjectName,
        description: newProjectDescription || null,
        slug: newProjectName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        createdAt: new Date().toISOString(),
      };

      setProjects((prev) => [...prev, newProject]);
      setShowCreateProject(false);
      setNewProjectName("");
      setNewProjectDescription("");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-primary min-h-screen">
      {/* Header */}
      <header className="border-primary bg-secondary border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-secondary hover:text-primary transition-colors"
              >
                ← Back to Organizations
              </Link>
              <h1 className="text-primary text-2xl font-bold">{orgName}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span className="text-secondary text-sm">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-primary text-3xl font-bold">Projects</h2>
            <p className="text-secondary">
              Create and manage your collaborative projects
            </p>
          </div>
          <button
            onClick={() => setShowCreateProject(true)}
            className="btn-primary"
          >
            Create Project
          </button>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-secondary">Loading projects...</div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/org/${params.orgId}/project/${project.id}`}
                className="card group cursor-pointer"
              >
                <div className="mb-4">
                  <h3 className="text-primary group-hover:text-secondary text-xl font-semibold">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-secondary mt-2 text-sm">
                      {project.description}
                    </p>
                  )}
                </div>
                <div className="text-tertiary flex items-center gap-2 text-sm">
                  <span>0 files</span>
                  <span>•</span>
                  <span>
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {projects.length === 0 && !loading && (
          <div className="py-12 text-center">
            <div className="card mx-auto max-w-md">
              <h3 className="text-primary mb-2 text-lg font-semibold">
                No projects yet
              </h3>
              <p className="text-secondary mb-4">
                Create your first project to start building something amazing.
              </p>
              <button
                onClick={() => setShowCreateProject(true)}
                className="btn-primary"
              >
                Create Your First Project
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      {showCreateProject && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="bg-primary shadow-elevated w-full max-w-md rounded-lg p-6">
            <h3 className="text-primary mb-4 text-xl font-semibold">
              Create New Project
            </h3>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="text-secondary mb-2 block text-sm font-medium">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="input"
                  placeholder="My Awesome Project"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="text-secondary mb-2 block text-sm font-medium">
                  Description (optional)
                </label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  className="input resize-none"
                  rows={3}
                  placeholder="A brief description of your project..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateProject(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
