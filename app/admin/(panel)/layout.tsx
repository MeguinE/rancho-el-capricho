import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { haySesion } from "@/lib/auth";
import { logoutAction } from "@/app/admin/acciones";
import NavAdmin from "@/components/admin/NavAdmin";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await haySesion())) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-[100svh] fondo-rancho">
      <header className="sticky top-0 z-40 bg-madera/92 backdrop-blur-xl border-b border-cuero/40">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-4">
          <Link
            href="/admin"
            className="font-slab font-bold uppercase tracking-[0.07em] text-crema text-lg flex items-center gap-2.5"
          >
            <span className="text-atardecer" aria-hidden="true">
              ★
            </span>
            Rancho · Admin
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-crema/55 hover:text-atardecer text-sm transition-colors hidden sm:inline"
            >
              Ver sitio ↗
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="btn btn--pastilla text-xs">
                Salir
              </button>
            </form>
          </div>
        </div>

        <NavAdmin />
      </header>

      <main className="mx-auto max-w-6xl px-5 py-9">{children}</main>
    </div>
  );
}
