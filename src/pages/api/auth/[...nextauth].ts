import { signIn } from "@/lib/firebase/service";
import { compare } from "bcrypt";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// Define the shape of the user that NextAuth expects
interface AuthUser {
  id: string;
  email: string;
  fullname?: string;
  phone?: string;
  role?: string;
}

  // interface Session {
  //   user: {
  //     name?: string;
  //     email?: string;
  //     image?: string;
  //     fullname?: string;
  //     phone?: string;
  //     role?: string;
  //   };
  // }


const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AuthUser | null> {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          const user = await signIn(email); // Assuming signIn fetches the user by email

          if (!user || !user.password) {
            throw new Error("No user found with the provided email or password is incorrect");
          }

          if (!user) {
            throw new Error("No user found with the provided email");
          }

          const passwordConfirm = await compare(password, user.password);

          if (!passwordConfirm) {
            throw new Error("Password is incorrect");
          }

          return {
            id: user.id,
            email: user.email,
            fullname: user.fullname,
            phone: user.phone,
            role: user.role,
          }; // User is successfully authenticated

        } catch (error) {
          console.error(error);
          return null; // Returning null indicates failed login
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.provider === "credentials" && user) {
        const authUser = user as AuthUser; // Cast the user to AuthUser type
        token.email = authUser.email;
        token.name = authUser.fullname;
        token.phone = authUser.phone;
        token.role = authUser.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          // email: token.email,
          // fullname: token.name,
          // phone: token.phone,
          // role: token.role,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login", // Custom login page
  },
};

export default NextAuth(authOptions);
