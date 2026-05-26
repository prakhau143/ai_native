import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#050b1a" }}>
      <div className="text-center px-6">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-2xl font-bold text-white mb-2">Audit not found</h1>
        <p className="text-slate-400 text-sm mb-8 max-w-xs mx-auto">
          This report link may have expired or the ID is incorrect.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#06b6d4,#6366f1)" }}
        >
          Run a new audit →
        </Link>
      </div>
    </div>
  );
}
