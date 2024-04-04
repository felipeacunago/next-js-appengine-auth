import {AuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
    ],
    pages: {
        signIn: "/auth/signIn",
    },
    callbacks: {
      async jwt({token, user, account, profile}) {
        if (account) {
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
          token.image = user.image;
          token.id_token = account.id_token;
          token.prueba = account;
        }
        return token;
      },
      async session({ session, token }: { session: any, token: any }) {
        session.user = token;
        return session;
      },
      async redirect({ url, baseUrl }) {
        return '/';
      }
    }
  }
  