export async function requireAdmin() {
  return { user: { email: "admin" } };
}
