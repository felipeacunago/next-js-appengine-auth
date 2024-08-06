import {AuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

const {OAuth2Client} = require('google-auth-library');

export const authOptions: AuthOptions = {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { label: "Username", type: "text"},
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req): Promise<any> {
          let projectNumber = '56723395868'
          let projectId = 'challengelatam-406716'
          let iapJwt = ''
          if (req.headers) {
            iapJwt = req.headers.get('x-goog-iap-jwt-assertion');
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
            console.log(ticket);
            return ticket;
          }
        }
      })
    ],
  }
