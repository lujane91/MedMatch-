import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import {
  BookmarkCtaButton,
  SaveFiltersButton,
} from "@/components/demo/BrowseDemoActions";
import {
  DiscoveryCard,
  DiscoveryCardCompact,
} from "@/components/opportunities/DiscoveryCard";
import { OpportunitiesFilters } from "@/components/opportunities/OpportunitiesFilters";
import { Body, Caption, Card, Label, SectionTitle } from "@/components/ui";
import { ArrowRight, Search } from "@/components/ui/icons";
import {
  getRecentlyAddedBrowse,
  getRecommendedBrowse,
  getTrendingBrowse,
  professions,
  savedSearches,
} from "@/data/browse";

export default function OpportunitiesPage() {
  const recommended = getRecommendedBrowse(3);
  const trending = getTrendingBrowse();
  const recentlyAdded = getRecentlyAddedBrowse();

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-12 mm-animate-fade-up lg:space-y-16">
        {/* Header */}
        <header className="max-w-2xl">
          <Label>Discovery</Label>
          <h1 className="mt-3 font-[family-name:var(--mm-font-display)] text-[clamp(2rem,4vw,2.75rem)] leading-[1.1] tracking-[-0.03em] text-mm-navy">
            Browse Opportunities
          </h1>
          <Body className="mt-4 text-[1.0625rem]">
            Discover healthcare training programs that match your profile.
          </Body>
        </header>

        {/* Search + Smart Filters */}
        <OpportunitiesFilters />

        {/* Recommended For You */}
        <section id="recommended">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Label>Curated for you</Label>
              <SectionTitle as="h2" className="mt-2">
                Recommended for you
              </SectionTitle>
              <Caption className="mt-2">
                Ranked by specialty fit, training year, and preference signals.
              </Caption>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-1">
            {recommended.map((opportunity) => (
              <DiscoveryCard
                key={opportunity.id}
                opportunity={opportunity}
                featured
              />
            ))}
          </div>
        </section>

        {/* Explore by Profession */}
        <section id="professions">
          <div className="mb-7">
            <Label>Categories</Label>
            <SectionTitle as="h2" className="mt-2">
              Explore by profession
            </SectionTitle>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {professions.map((profession) => (
              <a
                key={profession.id}
                href="#recommended"
                className="group relative overflow-hidden rounded-[var(--mm-radius-xl)] text-left shadow-mm-sm transition-[transform,box-shadow] duration-[var(--mm-duration)] hover:-translate-y-1 hover:shadow-mm-md"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${profession.accent}`}
                />
                <div className="relative flex min-h-[11.5rem] flex-col justify-between p-5 text-white">
                  <div>
                    <p className="text-[1.0625rem] font-semibold tracking-tight">
                      {profession.name}
                    </p>
                    <p className="mt-2 text-[0.8125rem] leading-relaxed text-white/70">
                      {profession.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[0.75rem] font-medium text-white/65">
                      {profession.count} programs
                    </span>
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-[var(--mm-duration)] group-hover:translate-x-0.5"
                    />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Trending */}
        <section>
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <Label>Popular now</Label>
              <SectionTitle as="h2" className="mt-2">
                Trending programs
              </SectionTitle>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {trending.map((opportunity) => (
              <DiscoveryCardCompact
                key={opportunity.id}
                opportunity={opportunity}
              />
            ))}
          </div>
        </section>

        {/* Recently Added */}
        <section>
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <Label>Fresh listings</Label>
              <SectionTitle as="h2" className="mt-2">
                Recently added
              </SectionTitle>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recentlyAdded.map((opportunity) => (
              <DiscoveryCardCompact
                key={opportunity.id}
                opportunity={opportunity}
              />
            ))}
          </div>
        </section>

        {/* Saved Searches */}
        <section id="saved-searches">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <Label>Shortcuts</Label>
              <SectionTitle as="h2" className="mt-2">
                Saved searches
              </SectionTitle>
            </div>
            <SaveFiltersButton />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {savedSearches.map((search) => (
              <Link
                key={search.id}
                href="/opportunities#recommended"
                className="block"
              >
                <Card
                  variant="interactive"
                  className="flex h-full flex-col p-5 sm:p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-teal-50 text-mm-teal">
                    <Search size={18} strokeWidth={1.75} />
                  </div>
                  <p className="text-[0.9375rem] font-semibold text-mm-navy">
                    {search.name}
                  </p>
                  <Caption className="mt-2 flex-1 leading-relaxed">
                    {search.filters}
                  </Caption>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-[0.8125rem] font-medium text-mm-text-muted">
                      {search.results} results
                    </span>
                    <span className="inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-mm-teal">
                      Run
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Soft CTA */}
        <Card className="flex flex-col items-start justify-between gap-5 overflow-hidden border-mm-border bg-mm-navy p-7 text-white sm:flex-row sm:items-center sm:p-8">
          <div className="relative z-10 max-w-xl">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-mm-teal-500">
              Keep exploring
            </p>
            <h2 className="mt-2 font-[family-name:var(--mm-font-display)] text-2xl tracking-tight">
              Save roles as you discover them
            </h2>
            <p className="mt-2 text-[0.9375rem] text-white/65">
              Bookmark promising programs and return when you are ready to apply.
            </p>
          </div>
          <BookmarkCtaButton />
        </Card>
      </div>
    </AppShell>
  );
}
