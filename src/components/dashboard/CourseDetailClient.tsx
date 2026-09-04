"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { formatCourseDateRange } from "@/data/courses";
import { useCourseStore } from "@/lib/course-store";
import { cn } from "@/lib/cn";

export function CourseDetailClient({ courseId }: { courseId: string }) {
  const { hydrated, getCourse, isSaved, toggleSave } = useCourseStore();
  const course = getCourse(courseId);

  if (!hydrated) {
    return (
      <AppShell title="Courses">
        <p className="text-mm-text-muted">Loading…</p>
      </AppShell>
    );
  }

  if (!course) {
    return (
      <AppShell title="Courses">
        <div className="mx-auto max-w-3xl space-y-4">
          <p className="text-mm-text-secondary">Course not found.</p>
          <Link href="/courses" className="font-semibold text-mm-teal">
            Back to Courses
          </Link>
        </div>
      </AppShell>
    );
  }

  const saved = isSaved(course.id);

  return (
    <AppShell title="Courses">
      <div className="mx-auto max-w-3xl space-y-5 pb-24 lg:pb-8">
        <Link
          href="/courses"
          className="text-[0.875rem] font-semibold text-mm-teal"
        >
          Back to Courses
        </Link>

        <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-[1.25rem] font-semibold tracking-tight text-mm-navy">
                {course.title}
              </h1>
              <p className="mt-2 text-[0.9375rem] font-medium text-mm-navy">
                Provider: {course.provider}
              </p>
              <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
                {course.providerKind} · {course.institution}
              </p>
            </div>
            <span className="rounded-full bg-mm-gray-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-mm-text-muted">
              {course.courseType}
            </span>
          </div>

          <p className="mt-4 text-[0.9375rem] leading-relaxed text-mm-text-secondary">
            {course.description}
          </p>

          <dl className="mt-5 grid gap-3 text-[0.8125rem] sm:grid-cols-2">
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                City
              </dt>
              <dd className="mt-1 text-mm-navy">{course.city}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Country
              </dt>
              <dd className="mt-1 text-mm-navy">{course.country}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Date
              </dt>
              <dd className="mt-1 text-mm-navy">
                {formatCourseDateRange(course.startDate, course.endDate)}
              </dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Healthcare Field
              </dt>
              <dd className="mt-1 text-mm-navy">
                {course.healthcareFields.join(", ")}
              </dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Specialty / Category
              </dt>
              <dd className="mt-1 text-mm-navy">
                {course.specialty} · {course.category}
              </dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Course Type
              </dt>
              <dd className="mt-1 text-mm-navy">{course.courseType}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Duration
              </dt>
              <dd className="mt-1 text-mm-navy">{course.duration}</dd>
            </div>
            {course.certification ? (
              <div className="sm:col-span-2">
                <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                  Certification
                </dt>
                <dd className="mt-1 text-mm-navy">{course.certification}</dd>
              </div>
            ) : null}
            <div className="sm:col-span-2">
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Who Can Attend
              </dt>
              <dd className="mt-1 text-mm-navy">
                {course.whoCanAttend.join(", ")}
              </dd>
            </div>
            {course.requirements ? (
              <div className="sm:col-span-2">
                <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                  Requirements
                </dt>
                <dd className="mt-1 text-mm-navy">{course.requirements}</dd>
              </div>
            ) : null}
            {course.registrationDeadline ? (
              <div>
                <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                  Registration Deadline
                </dt>
                <dd className="mt-1 text-mm-navy">
                  {formatCourseDateRange(
                    course.registrationDeadline,
                    course.registrationDeadline,
                  )}
                </dd>
              </div>
            ) : null}
            {typeof course.availableSeats === "number" ? (
              <div>
                <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                  Available Seats
                </dt>
                <dd className="mt-1 text-mm-navy">{course.availableSeats}</dd>
              </div>
            ) : null}
            {course.fee ? (
              <div>
                <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                  Course Fee
                </dt>
                <dd className="mt-1 text-mm-navy">{course.fee}</dd>
              </div>
            ) : null}
          </dl>

          <p className="mt-5 text-[0.75rem] text-mm-text-muted">
            Demo listing. Saving a course does not mean attendance or
            completion. Passport stamps require verified completion later.
          </p>
        </section>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => toggleSave(course.id)}
            className={cn(
              "min-h-11 flex-1 rounded-[var(--mm-radius-lg)] border text-[0.875rem] font-semibold",
              saved
                ? "border-mm-teal bg-mm-teal-50 text-mm-teal"
                : "border-mm-border text-mm-navy",
            )}
          >
            {saved ? "Saved" : "Save Course"}
          </button>
          {course.registrationUrl ? (
            <a
              href={course.registrationUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal text-[0.875rem] font-semibold text-white"
            >
              View Course / Register
            </a>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
