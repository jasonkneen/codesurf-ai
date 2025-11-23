import { u as useSession } from "./fetchEvent-4t5qANvA.js";
function useAuthSession() {
  return useSession({
    password: "0".repeat(32),
    name: "auth",
    maxAge: 60 * 60 * 24 * 365,
    cookie: {
      secure: false,
      httpOnly: true
    }
  });
}
export {
  useAuthSession as u
};
