import { SignJWT, importPKCS8 } from "jose";

export default defineEventHandler(async () => {
  const pkcs8 = process.env.NUXT_DEMO_JWT_PRIVATE_KEY!;
  const kid = process.env.NUXT_JWT_KID!;
  const key = await importPKCS8(pkcs8, "RS256");

  const now = Math.floor(Date.now() / 1000);
  const ttl = 120; // 2 min

  const token = await new SignJWT({ scope: "demo" })
    .setProtectedHeader({ alg: "RS256", kid })
    .setIssuedAt(now)
    .setNotBefore(now - 5)
    .setExpirationTime(now + ttl)
    .sign(key);

  return { token, exp: now + ttl };
});
