export function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const jsonPayload = atob(base64Payload);
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Invalid JWT", e);
    return null;
  }
}

export function getFirstNameFromJwt(token) {
  const payload = parseJwt(token);
  if (!payload) return null;

  if (payload.given_name) return payload.given_name;

  const sub = payload.sub || "";
  return sub.includes("@") ? sub.split("@")[0] : sub;
}
