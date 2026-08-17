type CircularProgressProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
};

export function CircularProgress({
  value,
  size = 132,
  strokeWidth = 10,
  label = "Complete",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--mm-gray-100)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--mm-teal-600)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-[family-name:var(--mm-font-display)] text-[1.875rem] leading-none tracking-tight text-mm-navy">
          {value}%
        </span>
        <span className="mt-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-mm-text-muted">
          {label}
        </span>
      </div>
    </div>
  );
}
