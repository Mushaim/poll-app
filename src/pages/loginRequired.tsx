
import { useSession } from "next-auth/react";
import router, { Router } from "next/router";

export default async function LoginRequired() {
  const { data: session, status } =  await useSession();

  if (!session) {
    router.push("/LoginContainer")
  }
  else{
    console.log(session)
  }
}
