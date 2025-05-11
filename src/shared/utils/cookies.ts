import Cookies from "js-cookie";

const TOKEN_KEY = "token";

export const setTokenCookie = (token: string, expiresInSec: number) => {
  Cookies.set(TOKEN_KEY, token, {
    expires: expiresInSec / 86400,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
};

export const getTokenCookie = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const removeTokenCookie = (): void => {
  Cookies.remove(TOKEN_KEY, { path: "/" });
};
