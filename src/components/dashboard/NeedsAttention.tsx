import Link from "next/link";
import type { AttentionItem } from "@/data/journey-dashboard";
import { DashboardSection } from "@/components/dashboard/DashboardSection";

export function NeedsAttention({ items }: { items: AttentionItem[] }) {
  if (items.length === 0) return null;

  return (
    <DashboardSection title="Needs Your Attention">
      <ul className="space-y-3">
        {items.map((item) => {
          const content = (
            <>
              <p className="text-[0.9375rem] font-semibold text-mm-navy">
                {item.title}
              </p>
              <p className="mt-1 text-[0.875rem] leading-relaxed text-mm-text-secondary">
                {item.detail}
              </p>
            </>
          );
          return (
            <li key={item.id}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="block rounded-[var(--mm-radius-lg)] border border-amber-200 bg-amber-50/70 px-4 py-3 transition-colors hover:border-amber-300"
                >
                  {content}
                </Link>
              ) : (
                <div className="rounded-[var(--mm-radius-lg)] border border-amber-200 bg-amber-50/70 px-4 py-3">
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </DashboardSection>
  );
}
