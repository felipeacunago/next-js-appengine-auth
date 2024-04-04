import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";

export type Token = {
  name: String;
  access_token: String;
  email: String;
  id_token: String;
  expires_at: BigInteger;
  refresh_token: String;
}

async function refreshAccessToken(token: any) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        grant_type: "refresh_token",
        refresh_token: token.refresh_token,
      })

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      id_token: refreshedTokens.id_token,
      expires_at: Date.now()/1000 + refreshedTokens.expires_in ,
    }
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: { params: { access_type: 'offline', prompt: 'consent' } }
    }),
  ],
  pages: {
    signIn: '/auth/signIn'
  },
  callbacks: {
    async jwt({token, user, account }) {
      if (account) {
        return {
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
          id_token: account.id_token,
          user
        }
      }

      if (Date.now()/1000 > (token.expires_at as number)) {
        const newToken: Token = await refreshAccessToken(token);
        return {
          ...token,
          access_token: newToken.access_token,
          expires_at: newToken.expires_at,
          id_token: newToken.id_token,
        };
      }
      
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if(token){
        session = {
          ...session,
          access_token: token.access_token,
          expires_at: token.expires_at,
          refresh_token: token.refresh_token,
          id_token: token.id_token,
          user: token.user
        }
        session.error = token.error
      }
      return session;
    }
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };