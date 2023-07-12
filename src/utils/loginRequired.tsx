
import { useSession } from "next-auth/react";

export default async function LoginRequired() {
  const { data: session, status } = await useSession();

  if (status === "unauthenticated") {
    throw new Error("Login First");
  }

  if (!session) {
    window.location.href = "/LoginContainer";
  }
  else{
    console.log(session)
  }
}
