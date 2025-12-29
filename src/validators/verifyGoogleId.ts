import { OAuth2Client } from "google-auth-library";
import { AuthenticationError } from "../utils/ApiError";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyGoogleIdToken(idToken: string) {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new AuthenticationError("Invalid Google token");
  }

  if (!payload.email_verified) {
    throw new AuthenticationError("Google email not verified");
  }

  return {
    email: payload.email!,
    googleId: payload.sub!, // authProviderId
    firstName: payload.given_name,
    lastName: payload.family_name,
    picture: payload.picture,
  };
}
