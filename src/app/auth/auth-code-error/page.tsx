export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="w-full max-w-md rounded-lg bg-white/10 p-8 text-center backdrop-blur-sm">
        <h1 className="mb-4 text-3xl font-bold text-white">
          Authentication Error
        </h1>
        <p className="mb-6 text-gray-300">
          There was an error during the authentication process. Please try
          signing in again.
        </p>
        <a
          href="/auth/login"
          className="inline-block rounded bg-blue-500 px-6 py-3 text-white hover:bg-blue-600"
        >
          Try Again
        </a>
      </div>
    </div>
  );
}
