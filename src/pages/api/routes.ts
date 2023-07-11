// import { getServerSession } from "next-auth";
// import { NextResponse } from "next/server";
// import { AuthOptions } from "next-auth";
// import { authOptions } from "./auth/[...nextauth]";

// export async function GET(request:Request) {
//   const session = await getServerSession(authOptions);
//   if (session) {
//     return NextResponse.json(session.user);
//   }
//   return NextResponse.redirect("/login");
// }