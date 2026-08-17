type SectionHeaderProps = {
  title: string;
  subtitle: string;
  description?: string;
  onDark?: boolean;
};

export function SectionHeader({
  title,
  subtitle,
  description,
  onDark = false,
}: SectionHeaderProps) {
  return (
    <header
      className={`landing-section-header${onDark ? " landing-section-header--on-dark" : ""}`}
    >
      <h2 className="landing-h2">{title}</h2>
      <p className="landing-subtitle">{subtitle}</p>
      {description ? (
        <p className="landing-section-desc">{description}</p>
      ) : null}
    </header>
  );
}
