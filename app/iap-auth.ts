import {AuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

const {OAuth2Client} = require('google-auth-library');


export const authOptions: AuthOptions = {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { label: "Username", type: "text"},
          password: { label: "Passwordasddsa", type: "password" }
        },
        async authorize(credentials, req): Promise<any> {
          let projectNumber = '56723395868'
          let projectId = 'challengelatam-406716'
          let iapJwt = ''
          try {
            iapJwt = req.headers?.get('x-goog-iap-jwt-assertion');
          } catch (e) {
            //console.error('Error reading IAP JWT: ', e);
          }
          let expectedAudience = '';
          if (projectNumber && projectId) {
            // Expected Audience for App Engine.
            expectedAudience = `/projects/${projectNumber}/apps/${projectId}`;
          }

          const oAuth2Client = new OAuth2Client();

          async function verify() {
            // Verify the id_token, and access the claims.
            const response = await oAuth2Client.getIapPublicKeys();
            const ticket = await oAuth2Client.verifySignedJwtWithCertsAsync(
              iapJwt,
              response.pubkeys,
              expectedAudience,
              ['https://cloud.google.com/iap']
            );
            // Print out the info contained in the IAP ID token
            console.log(ticket.payload);
            return {...ticket.payload, 'accessToken': iapJwt};
            //return {id: "1", name: "test", email: "email"}
          }
          const user = verify()
          return user
        }
      })
    ],
    callbacks: {
      async signIn({ user, account, profile }) {
        console.log('signIn', user, account, profile)
        return true;
      },
      async redirect({ url, baseUrl }) {
        return '/';
      }
    }
  }
