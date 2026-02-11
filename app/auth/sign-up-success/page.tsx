import Link from "next/link";

export default function SignUpSuccess() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-8 text-center">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Check your email
        </h1>
        <p className="text-muted-foreground mb-6">
          We've sent you a confirmation link. Please check your email and click
          the link to verify your account.
        </p>

        <Link
          href="/auth/login"
          className="inline-block bg-primary text-primary-foreground px-8 py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Back to Login
        </Link>
      </div>
    </main>
  );
}
