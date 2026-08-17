type IllustrationProps = {
  variant:
    | "welcome"
    | "profession"
    | "specialty"
    | "cities"
    | "cv"
    | "interests"
    | "success";
};

export function OnboardingIllustration({ variant }: IllustrationProps) {
  return (
    <div className="relative mx-auto aspect-[4/4.2] w-full max-w-md">
      <div
        className="absolute -inset-4 rounded-[2.5rem] opacity-90"
        style={{
          background:
            variant === "success"
              ? "radial-gradient(circle at 40% 30%, rgba(31,166,160,0.28), transparent 55%), radial-gradient(circle at 70% 75%, rgba(14,58,93,0.12), transparent 50%)"
              : "radial-gradient(circle at 30% 20%, rgba(31,166,160,0.2), transparent 50%), radial-gradient(circle at 80% 70%, rgba(14,58,93,0.12), transparent 45%)",
        }}
        aria-hidden
      />

      <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 shadow-[0_30px_80px_rgba(14,58,93,0.12)] backdrop-blur-xl">
        {variant === "welcome" && <WelcomeArt />}
        {variant === "profession" && <ProfessionArt />}
        {variant === "specialty" && <SpecialtyArt />}
        {variant === "cities" && <CitiesArt />}
        {variant === "cv" && <CvArt />}
        {variant === "interests" && <InterestsArt />}
        {variant === "success" && <SuccessArt />}
      </div>
    </div>
  );
}

function WelcomeArt() {
  return (
    <div className="flex h-full flex-col justify-between p-8">
      <div className="rounded-[1.25rem] bg-gradient-to-br from-mm-navy via-mm-navy-800 to-mm-teal p-5 text-white">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/60">
          MedJourney
        </p>
        <p className="mt-3 font-[family-name:var(--mm-font-display)] text-2xl leading-tight">
          Your training path, clarified.
        </p>
      </div>
      <div className="space-y-3">
        {["Build your profile", "Discover matches", "Apply with confidence"].map(
          (item, i) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-[1rem] border border-mm-border bg-mm-white px-4 py-3"
              style={{ opacity: 1 - i * 0.08 }}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mm-teal-50 text-[0.75rem] font-bold text-mm-teal">
                {i + 1}
              </span>
              <span className="text-[0.875rem] font-medium text-mm-navy">{item}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function ProfessionArt() {
  return (
    <div className="grid h-full grid-cols-2 gap-3 p-7">
      {["Medicine", "Dentistry", "Pharmacy", "Nursing"].map((name, i) => (
        <div
          key={name}
          className={`rounded-[1.25rem] border border-mm-border p-4 ${
            i === 0 ? "bg-mm-navy text-white" : "bg-mm-white text-mm-navy"
          }`}
        >
          <div
            className={`mb-6 h-8 w-8 rounded-[0.75rem] ${
              i === 0 ? "bg-mm-teal" : "bg-mm-teal-50"
            }`}
          />
          <p className="text-[0.875rem] font-semibold">{name}</p>
        </div>
      ))}
    </div>
  );
}

function SpecialtyArt() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-8">
      {["Internal Medicine", "Cardiology", "Critical Care", "Emergency"].map(
        (name, i) => (
          <div
            key={name}
            className={`rounded-full px-5 py-3 text-[0.875rem] font-semibold ${
              i === 0
                ? "bg-mm-teal text-white shadow-mm-teal"
                : "border border-mm-border bg-mm-white text-mm-navy"
            }`}
          >
            {name}
          </div>
        ),
      )}
    </div>
  );
}

function CitiesArt() {
  return (
    <div className="relative flex h-full items-center justify-center p-8">
      <div className="absolute h-40 w-40 rounded-full border border-mm-teal/30" />
      <div className="absolute h-56 w-56 rounded-full border border-mm-navy/10" />
      <div className="absolute h-72 w-72 rounded-full border border-mm-border" />
      {[
        { label: "Riyadh", x: "42%", y: "38%" },
        { label: "Jeddah", x: "22%", y: "58%" },
        { label: "Dammam", x: "62%", y: "55%" },
      ].map((city) => (
        <div
          key={city.label}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-mm-navy px-3 py-1.5 text-[0.75rem] font-semibold text-white shadow-mm-md"
          style={{ left: city.x, top: city.y }}
        >
          {city.label}
        </div>
      ))}
    </div>
  );
}

function CvArt() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <div className="w-full max-w-[220px] rounded-[1.25rem] border border-dashed border-mm-teal bg-mm-teal-50/50 px-6 py-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[1rem] bg-mm-teal text-white">
          <span className="text-xl font-bold">↑</span>
        </div>
        <p className="text-[0.9375rem] font-semibold text-mm-navy">Upload CV</p>
        <p className="mt-2 text-[0.75rem] text-mm-text-muted">
          PDF or DOCX · visual only
        </p>
      </div>
      <div className="mt-5 w-full max-w-[220px] rounded-[1rem] border border-mm-border bg-mm-white px-4 py-3">
        <p className="text-[0.75rem] font-semibold text-mm-navy">Amina_Hassan_CV.pdf</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mm-gray-100">
          <div className="h-full w-[78%] rounded-full bg-mm-teal" />
        </div>
      </div>
    </div>
  );
}

function InterestsArt() {
  return (
    <div className="flex h-full flex-col justify-between p-7">
      <div className="flex flex-wrap gap-2">
        {["Research", "Inpatient", "Teaching", "Cardiology"].map((tag, i) => (
          <span
            key={tag}
            className={`rounded-full px-3 py-1.5 text-[0.75rem] font-semibold ${
              i < 2 ? "bg-mm-teal text-white" : "bg-mm-gray-100 text-mm-navy"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="space-y-3">
        {["National Heart Center", "University Medical Center"].map((name) => (
          <div
            key={name}
            className="rounded-[1rem] border border-mm-border bg-mm-white px-4 py-3"
          >
            <p className="text-[0.875rem] font-semibold text-mm-navy">{name}</p>
            <p className="mt-1 text-[0.75rem] text-mm-text-muted">Preferred hospital</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuccessArt() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-mm-teal text-white shadow-mm-teal">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="mt-6 font-[family-name:var(--mm-font-display)] text-3xl tracking-tight text-mm-navy">
        You&apos;re ready
      </p>
      <p className="mt-3 max-w-xs text-[0.9375rem] text-mm-text-secondary">
        MedJourney is preparing personalized training matches for your profile.
      </p>
      <div className="mt-8 grid w-full grid-cols-3 gap-2">
        {["96%", "93%", "88%"].map((score) => (
          <div
            key={score}
            className="rounded-[1rem] border border-mm-border bg-mm-white py-3"
          >
            <p className="text-lg font-bold text-mm-navy">{score}</p>
            <p className="text-[0.625rem] uppercase tracking-wide text-mm-text-muted">
              Match
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
