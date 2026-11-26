import { redirect } from "next/navigation";

export default function ProfessionsRedirectPage() {
  redirect("/explore?tab=professional");
}
