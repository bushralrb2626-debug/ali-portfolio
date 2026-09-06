/**
 * Portfolio admin identity — mirrors Slorsh admin seat (display as Ali, Agency/Admin chip).
 */

export const PORTFOLIO_ADMIN = {
  id: "admin",
  name: "Ali",
  role: "admin" as const,
  planLabel: "Admin",
  roleLabel: "Agency",
};

export function adminDisplayName() {
  return process.env.ADMIN_DISPLAY_NAME?.trim() || PORTFOLIO_ADMIN.name;
}

export function adminEmail() {
  return (
    process.env.ADMIN_EMAIL?.trim() ||
    process.env.ADMIN_NOTIFY_EMAIL?.trim() ||
    "alimasterofall105@gmail.com"
  );
}
