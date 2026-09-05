"use client";

import { ResearchDetailClient } from "@/components/dashboard/ResearchDetailClient";
import { use } from "react";

export default function ResearchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <ResearchDetailClient researchId={id} />;
}
