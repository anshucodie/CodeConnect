"use client";

import Link from "next/link";
import { useUser } from "~/components/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-6xl font-bold text-gray-900">
            Code<span className="text-gray-600">Connect</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            A minimalistic collaborative development platform. Create projects,
            manage files, and work together with your team in a clean,
            distraction-free environment.
          </p>
        </div>

        {/* Action Cards */}
        <div className="mx-auto mb-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <Link
            href="/auth/login"
            className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <div className="text-center">
              <h3 className="mb-3 text-2xl font-semibold text-gray-900 transition-colors group-hover:text-gray-700">
                Get Started
              </h3>
              <p className="text-gray-600">
                Sign in to create your first organization and start building
                projects together.
              </p>
            </div>
          </Link>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-center">
              <h3 className="mb-3 text-2xl font-semibold text-gray-900">
                Features
              </h3>
              <ul className="space-y-2 text-left text-gray-600">
                <li>• Organizations & team management</li>
                <li>• Project creation & collaboration</li>
                <li>• File management system</li>
                <li>• Role-based permissions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-700">
              Platform Status: Active
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
