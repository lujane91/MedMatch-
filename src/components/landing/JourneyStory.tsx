import {
  Briefcase,
  CalendarDays,
  FlaskConical,
  GraduationCap,
  Hospital,
  Medal,
  Stethoscope,
} from "lucide-react";

const stages = [
  {
    title: "Medical School",
    detail: "Summer Electives",
    icon: GraduationCap,
  },
  {
    title: "Internship",
    detail: "Clinical Rotations",
    icon: Stethoscope,
  },
  {
    title: "Residency",
    detail: "Specialty Training",
    icon: Hospital,
  },
  {
    title: "Fellowship",
    detail: "Subspecialty Training",
    icon: Medal,
  },
  {
    title: "Medical Practice",
    detail: "GP · Specialist · Consultant",
    icon: Briefcase,
  },
];

const services = [
  {
    title: "Research",
    detail: "Find projects and collaborators.",
    icon: FlaskConical,
  },
  {
    title: "Conferences",
    detail: "Discover conferences that match your interests.",
    icon: CalendarDays,
  },
  {
    title: "Careers",
    detail: "Find opportunities for your next step.",
    icon: Briefcase,
  },
];

const profileItems = [
  "Education",
  "Electives",
  "Internship",
  "Research",
  "Conferences",
  "Residency",
  "Fellowship",
];

export function JourneyStory() {
  return (
    <>
      <section id="journey" className="bg-white">
        <div className="landing-container landing-section">
          <h2 className="landing-h2 landing-journey-title">
            Every stage. One journey.
          </h2>

          <ol className="landing-journey-track" aria-label="Medical training stages">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <li key={stage.title} className="landing-journey-step">
                  <article className="landing-card landing-card-interactive landing-journey-card">
                    <div className="landing-journey-card-top">
                      <span className="landing-journey-icon" aria-hidden>
                        <Icon size={16} strokeWidth={1.75} />
                      </span>
                      <span className="landing-journey-index">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="landing-h3-sans text-[1.0625rem]">
                      {stage.title}
                    </h3>
                    <p className="landing-caption mt-1.5">{stage.detail}</p>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section id="along-your-journey" className="landing-section">
        <div className="landing-container">
          <h2 className="landing-h2 landing-journey-title">
            More along your journey.
          </h2>

          <div className="landing-journey-services">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.title}
                  className="landing-card landing-card-interactive landing-journey-service"
                >
                  <div className="landing-journey-icon" aria-hidden>
                    <Icon size={16} strokeWidth={1.75} />
                  </div>
                  <h3 className="landing-h3-sans mt-3">{service.title}</h3>
                  <p className="landing-body mt-1.5 text-[0.875rem] leading-snug sm:leading-[1.45]">
                    {service.detail}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="growing-profile" className="bg-white">
        <div className="landing-container landing-section">
          <h2 className="landing-h2 landing-journey-title">
            Your journey grows with you.
          </h2>
          <p className="landing-lead landing-journey-lead">
            One verified profile that follows your medical career.
          </p>

          <div className="landing-card landing-profile-preview">
            <p className="landing-eyebrow">MedJourney Profile</p>
            <ul className="landing-profile-chips">
              {profileItems.map((item) => (
                <li key={item} className="landing-profile-chip">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
