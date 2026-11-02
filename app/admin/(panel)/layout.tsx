import { redirect } from "next/navigation";
import { haySesion } from "@/lib/auth";
import { logoutAction } from "@/app/admin/acciones";
import NavAdmin from "@/components/admin/NavAdmin";

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
      <header className="sticky top-0 z-40 bg-[#1a1410]/90 backdrop-blur border-b border-cuero/40">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-4">
          <a
            href="/admin"
            className="font-slab font-bold uppercase tracking-[0.08em] text-crema text-lg flex items-center gap-2"
          >
            <span className="text-atardecer">★</span> Rancho · Admin
          </a>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="text-crema/60 hover:text-atardecer text-sm hidden sm:inline"
            >
              Ver sitio ↗
            </a>
            <form action={logoutAction}>
              <button className="btn btn--pastilla text-xs">Salir</button>
            </form>
          </div>
        </div>
        <NavAdmin />
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
