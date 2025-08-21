"use client";

import { useUser } from "~/components/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface File {
  id: string;
  name: string;
  path: string;
  type: "file" | "folder";
  content?: string;
}

interface Props {
  params: { orgId: string; projectId: string };
}

export default function ProjectPage({ params }: Props) {
  const { user } = useUser();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState("");
  const [showCreateFile, setShowCreateFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    fetchProject();
  }, [user, router, params.orgId, params.projectId]);

  const fetchProject = async () => {
    try {
      // Mock data for now
      setProjectName("My Awesome Project");
      const mockFiles: File[] = [
        {
          id: "1",
          name: "index.js",
          path: "/index.js",
          type: "file",
          content: `// Welcome to CodeConnect!
// This is your collaborative development platform

console.log("Hello, CodeConnect!");

function greet(name) {
  return \`Hello, \${name}! Welcome to your project.\`;
}

// Start building something amazing
const message = greet("Developer");
console.log(message);
`,
        },
        {
          id: "2",
          name: "README.md",
          path: "/README.md",
          type: "file",
          content: `# My Awesome Project

Welcome to your new project on CodeConnect!

## Getting Started

This is a collaborative development platform where you can:

- Create and edit files
- Work with your team in real-time
- Organize your projects efficiently

## Features

- 🎨 Clean, minimalistic interface
- 📝 Monaco Editor integration
- 👥 Team collaboration
- 📁 File management

Start editing files to see the magic happen!
`,
        },
      ];
      setFiles(mockFiles);
      // Auto-select the first file
      if (mockFiles.length > 0) {
        setSelectedFile(mockFiles[0]!);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newFile: File = {
        id: "file-" + Date.now(),
        name: newFileName,
        path: "/" + newFileName,
        type: "file",
        content: getDefaultContent(newFileName),
      };

      setFiles((prev) => [...prev, newFile]);
      setSelectedFile(newFile);
      setShowCreateFile(false);
      setNewFileName("");
    } catch (error) {
      console.error("Error creating file:", error);
    }
  };

  const getDefaultContent = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "js":
      case "jsx":
        return '// New JavaScript file\nconsole.log("Hello, world!");';
      case "ts":
      case "tsx":
        return '// New TypeScript file\nconsole.log("Hello, world!");';
      case "py":
        return '# New Python file\nprint("Hello, world!")';
      case "html":
        return "<!DOCTYPE html>\n<html>\n<head>\n  <title>New Page</title>\n</head>\n<body>\n  <h1>Hello, world!</h1>\n</body>\n</html>";
      case "css":
        return "/* New CSS file */\nbody {\n  font-family: sans-serif;\n}";
      case "md":
        return "# New Markdown File\n\nStart writing your documentation here...";
      default:
        return "// New file\n";
    }
  };

  const getLanguage = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "js":
      case "jsx":
        return "javascript";
      case "ts":
      case "tsx":
        return "typescript";
      case "py":
        return "python";
      case "html":
        return "html";
      case "css":
        return "css";
      case "md":
        return "markdown";
      case "json":
        return "json";
      default:
        return "plaintext";
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (selectedFile && value !== undefined) {
      setSelectedFile({ ...selectedFile, content: value });
      // Update the file in the files array
      setFiles((prev) =>
        prev.map((file) =>
          file.id === selectedFile.id ? { ...file, content: value } : file,
        ),
      );
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-primary flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-primary bg-secondary flex-shrink-0 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/org/${params.orgId}`}
                className="text-secondary hover:text-primary transition-colors"
              >
                ← Back to Projects
              </Link>
              <h1 className="text-primary text-2xl font-bold">{projectName}</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCreateFile(true)}
                className="btn-primary text-sm"
              >
                New File
              </button>
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
      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer Sidebar */}
        <div className="sidebar w-64 flex-shrink-0 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-secondary mb-3 text-sm font-semibold tracking-wide uppercase">
              Files
            </h3>
            {loading ? (
              <div className="text-secondary text-sm">Loading files...</div>
            ) : (
              <div className="space-y-1">
                {files.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full rounded px-3 py-2 text-left text-sm transition-colors ${
                      selectedFile?.id === file.id
                        ? "bg-accent text-primary"
                        : "text-secondary hover:bg-tertiary hover:text-primary"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-xs">📄</span>
                      {file.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {selectedFile ? (
            <>
              {/* File Tab */}
              <div className="bg-secondary border-primary flex-shrink-0 border-b px-4 py-2">
                <span className="text-primary text-sm font-medium">
                  {selectedFile.name}
                </span>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 overflow-hidden">
                <MonacoEditor
                  height="100%"
                  language={getLanguage(selectedFile.name)}
                  value={selectedFile.content || ""}
                  onChange={handleEditorChange}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    rulers: [80],
                    wordWrap: "on",
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 16, bottom: 16 },
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <h3 className="text-primary mb-2 text-lg font-semibold">
                  Welcome to your project!
                </h3>
                <p className="text-secondary mb-4">
                  Select a file from the sidebar to start editing, or create a
                  new file.
                </p>
                <button
                  onClick={() => setShowCreateFile(true)}
                  className="btn-primary"
                >
                  Create Your First File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create File Modal */}
      {showCreateFile && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="bg-primary shadow-elevated w-full max-w-md rounded-lg p-6">
            <h3 className="text-primary mb-4 text-xl font-semibold">
              Create New File
            </h3>
            <form onSubmit={handleCreateFile}>
              <div className="mb-6">
                <label className="text-secondary mb-2 block text-sm font-medium">
                  File Name
                </label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="input"
                  placeholder="index.js"
                  required
                />
                <p className="text-tertiary mt-1 text-xs">
                  Include the file extension (e.g., .js, .ts, .py, .html)
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateFile(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
