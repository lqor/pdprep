import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password({
      profile: (params) => {
        const email = String(params.email ?? "").trim().toLowerCase();
        const name = String(params.name ?? "").trim().replace(/\s+/g, " ");

        if (!email) {
          throw new Error("Email is required");
        }

        if (params.flow === "signUp") {
          if (!name) {
            throw new Error("Full name is required");
          }
          if (name.length < 2 || name.length > 80) {
            throw new Error("Full name must be between 2 and 80 characters");
          }
        }

        return {
          email,
          name: name || email.split("@")[0],
        };
      },
      validatePasswordRequirements: (password) => {
        if (password.length < 12) {
          throw new Error("Password must be at least 12 characters long");
        }
        if (!/[a-z]/.test(password)) {
          throw new Error("Password must include a lowercase letter");
        }
        if (!/[A-Z]/.test(password)) {
          throw new Error("Password must include an uppercase letter");
        }
        if (!/[0-9]/.test(password)) {
          throw new Error("Password must include a number");
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
          throw new Error("Password must include a symbol");
        }
      },
    }),
  ],
});
