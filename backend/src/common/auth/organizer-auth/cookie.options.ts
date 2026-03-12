export const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: false,
  path: '/',
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};
