const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,20}$/;

export function validateUsername(username: string) {
  const normalized = username.trim();

  if (!USERNAME_PATTERN.test(normalized)) {
    return {
      valid: false,
      normalized,
      message: "3-20 Zeichen, nur Buchstaben, Zahlen und Unterstrich."
    };
  }

  return { valid: true, normalized, message: "OK" };
}

export function makeAvatarLabel(username: string) {
  return username.slice(0, 2).toUpperCase();
}
