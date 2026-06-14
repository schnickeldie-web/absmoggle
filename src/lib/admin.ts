const initialAdmin = process.env.NEXT_PUBLIC_INITIAL_ADMIN_USERNAME ?? "Benjamin";

export function getDefaultAdminUsernames() {
  return [initialAdmin, "admin"].map((name) => name.toLowerCase());
}

export function isAdminUser(username?: string | null, extraAdmins: string[] = []) {
  if (!username) return false;
  const allowed = [...getDefaultAdminUsernames(), ...extraAdmins.map((name) => name.toLowerCase())];
  return allowed.includes(username.toLowerCase());
}
