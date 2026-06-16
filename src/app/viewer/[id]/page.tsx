import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import PDFViewer from "@/components/PDFViewer";

export default async function ViewerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: resource } = await supabase
    .from("resources")
    .select("*")
    .eq("id", id)
    .single();

  if (!resource) notFound();

  const backLink = resource.price > 0 ? "/fiches-pedagogiques" : "/resources";

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="bg-white border-b-3 border-ink px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={backLink}
            className="w-10 h-10 rounded-xl bg-cream border-2 border-ink flex items-center justify-center text-ink hover:bg-sun-light transition-colors shrink-0"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-ink truncate text-sm sm:text-base">
              {resource.title}
            </h1>
            <p className="text-xs text-ink/50 truncate">
              {resource.class_level && `${resource.class_level} · `}
              {resource.file_type?.toUpperCase()} · {resource.file_size ? `${(resource.file_size / 1024).toFixed(0)} Ko` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {resource.price > 0 && (
            <span className="text-coral font-display font-bold text-sm bg-coral-light px-3 py-1.5 rounded-full border-2 border-ink">
              {resource.price} DA
            </span>
          )}
        </div>
      </header>
      <div className="flex-1 flex flex-col min-h-0" style={{ height: "calc(100vh - 64px)" }}>
        <PDFViewer resourceId={id} title={resource.title} />
      </div>
    </div>
  );
}
