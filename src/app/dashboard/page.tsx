"use client";

import { useUser } from "~/components/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Organization {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  role: string;
}

export default function DashboardPage() {
  const { user, loading, signOut } = useUser();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [orgLoading, setOrgLoading] = useState(true);
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgDescription, setNewOrgDescription] = useState("");

  useEffect(() => {
    if (!user && !loading) {
      router.push("/auth/login");
      return;
    }
    if (user) {
      fetchOrganizations();
    }
  }, [user, loading, router]);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("/api/organizations");
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data.organizations || []);
      } else {
        console.error("Failed to fetch organizations");
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setOrgLoading(false);
    }
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newOrgName,
          description: newOrgDescription,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrganizations((prev) => [...prev, data.organization]);
        setShowCreateOrg(false);
        setNewOrgName("");
        setNewOrgDescription("");
      } else {
        console.error("Failed to create organization");
      }
    } catch (error) {
      console.error("Error creating organization:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-primary flex min-h-screen items-center justify-center">
        <div className="text-secondary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="bg-primary min-h-screen">
      {/* Header */}
      <header className="border-primary bg-secondary border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-primary text-2xl font-bold">
                Code<span className="text-secondary">Connect</span>
              </h1>
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
              <button onClick={signOut} className="btn-secondary text-sm">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-primary text-3xl font-bold">Organizations</h2>
            <p className="text-secondary">
              Manage your workspaces and collaborate with teams
            </p>
          </div>
          <button
            onClick={() => setShowCreateOrg(true)}
            className="btn-primary"
          >
            Create Organization
          </button>
        </div>

        {/* Organizations Grid */}
        {orgLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-secondary">Loading organizations...</div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => (
              <Link
                key={org.id}
                href={`/org/${org.id}`}
                className="card group cursor-pointer"
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-primary group-hover:text-secondary text-xl font-semibold">
                      {org.name}
                    </h3>
                    <span className="bg-accent text-secondary rounded-full px-2 py-1 text-xs font-medium">
                      {org.role}
                    </span>
                  </div>
                  {org.description && (
                    <p className="text-secondary mt-2 text-sm">
                      {org.description}
                    </p>
                  )}
                </div>
                <div className="text-tertiary flex items-center gap-2 text-sm">
                  <span>0 projects</span>
                  <span>•</span>
                  <span>0 members</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {organizations.length === 0 && !orgLoading && (
          <div className="py-12 text-center">
            <div className="card mx-auto max-w-md">
              <h3 className="text-primary mb-2 text-lg font-semibold">
                No organizations yet
              </h3>
              <p className="text-secondary mb-4">
                Create your first organization to start collaborating with your
                team.
              </p>
              <button
                onClick={() => setShowCreateOrg(true)}
                className="btn-primary"
              >
                Create Your First Organization
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Create Organization Modal */}
      {showCreateOrg && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="bg-primary shadow-elevated w-full max-w-md rounded-lg p-6">
            <h3 className="text-primary mb-4 text-xl font-semibold">
              Create New Organization
            </h3>
            <form onSubmit={handleCreateOrg}>
              <div className="mb-4">
                <label className="text-secondary mb-2 block text-sm font-medium">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className="input"
                  placeholder="My Awesome Team"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="text-secondary mb-2 block text-sm font-medium">
                  Description (optional)
                </label>
                <textarea
                  value={newOrgDescription}
                  onChange={(e) => setNewOrgDescription(e.target.value)}
                  className="input resize-none"
                  rows={3}
                  placeholder="A brief description of your organization..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateOrg(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
