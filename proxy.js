import { NextResponse } from "next/server";
import { pingVisit } from "./app/lib/visit-ping.js";

export const config = {
  matcher: "/",
};

export default async function proxy() {
  await pingVisit();
  return NextResponse.next();
}
