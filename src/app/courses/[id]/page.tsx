"use client";

import { use } from "react";
import { CourseDetailClient } from "@/components/dashboard/CourseDetailClient";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <CourseDetailClient courseId={id} />;
}
