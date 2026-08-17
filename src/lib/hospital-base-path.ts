/**
 * Demo Mode mounts the Hospital Admin UI under `/demo/*`.
 * Normal production routes remain under `/hospital/*`.
 */
export function hospitalBaseFromPathname(pathname: string | null | undefined) {
  return pathname?.startsWith("/demo") ? "/demo" : "/hospital";
}

/** Rewrite a `/hospital/...` href to the active base (`/hospital` or `/demo`). */
export function withHospitalBase(
  pathname: string | null | undefined,
  href: string,
) {
  const base = hospitalBaseFromPathname(pathname);
  if (base === "/demo" && href.startsWith("/hospital")) {
    return `/demo${href.slice("/hospital".length)}`;
  }
  return href;
}
