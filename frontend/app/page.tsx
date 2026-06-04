import { redirect } from "next/navigation";

export default function Home() {
  // Land on the login page. Real token-based gating arrives with the API in
  // Sprint 7; until then this is the entry point.
  redirect("/login");
}
