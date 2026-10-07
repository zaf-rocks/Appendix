export const WELL_EMAIL = "zafvirtualstudios@gmail.com";

export function isWellEmail(email: string | null | undefined) {
  return (email || "").trim().toLowerCase() === WELL_EMAIL;
}
