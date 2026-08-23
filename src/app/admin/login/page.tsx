import { loginAction } from "@/app/admin/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold">Admin login</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Use the email and password from your <code>.env</code> file.
      </p>
      {error ? (
        <p className="mt-4 rounded-lg border border-red-900 bg-red-950/50 px-3 py-2 text-sm text-red-200">
          Invalid email or password.
        </p>
      ) : null}
      <form action={loginAction} className="mt-6 space-y-4">
        <label className="block space-y-2 text-sm">
          <span className="text-zinc-400">Email</span>
          <input
            name="email"
            type="text"
            autoComplete="username"
            required
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="text-zinc-400">Password</span>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-400 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-300"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
