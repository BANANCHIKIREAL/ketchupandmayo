import { NextResponse } from "next/server";
import { pingVisit } from "./app/lib/visit-ping.js";

export const config = {
  matcher: "/",
};

const DEDUPE_WINDOW_MS = 10_000;
let lastPingAt = 0;

export default async function proxy() {
  const now = Date.now();
  if (now - lastPingAt > DEDUPE_WINDOW_MS) {
    lastPingAt = now;
    await pingVisit();
  }
  return NextResponse.next();
}
