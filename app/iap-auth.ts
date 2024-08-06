import {AuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: AuthOptions = {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { label: "Username", type: "text"},
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req, headers) {
          let projectNumber = '56723395868'
          let projectId = 'challengelatam-406716'
          console.log(headers)
          let iapJwt = headers.get('x-goog-iap-jwt-assertion');
          let expectedAudience = null;
          if (projectNumber && projectId) {
            // Expected Audience for App Engine.
            expectedAudience = `/projects/${projectNumber}/apps/${projectId}`;
          } else if (projectNumber && backendServiceId) {
            // Expected Audience for Compute Engine
            expectedAudience = `/projects/${projectNumber}/global/backendServices/${backendServiceId}`;
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
