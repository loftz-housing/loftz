import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { login } from "../actions";

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAuthed()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form action={login} className="card w-full max-w-sm p-8">
        <div className="mb-6 text-center font-display text-2xl font-semibold">
          LOFTZ Admin
        </div>
        <label className="label" htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          required
          className="field"
        />
        {error && (
          <p className="mt-2 text-sm text-[var(--color-danger)]">Wrong password.</p>
        )}
        <button type="submit" className="btn btn-primary mt-5 w-full">
          Sign in
        </button>
      </form>
    </div>
  );
}
