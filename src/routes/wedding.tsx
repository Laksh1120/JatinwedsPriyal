import { createFileRoute, notFound } from "@tanstack/react-router";

import { brideReception, isBrideSite } from "@/content/site";
import { InvitationPage, siteHead } from "@/pages/Invitation";

// Reception-only version of the bride's invitation, served at /wedding. It only exists on the bride's deployment (VITE_SITE=bride).
export const Route = createFileRoute("/wedding")({
  beforeLoad: () => {
    if (!isBrideSite) throw notFound();
  },
  head: () => siteHead(brideReception),
  component: () => <InvitationPage site={brideReception} />,
});
