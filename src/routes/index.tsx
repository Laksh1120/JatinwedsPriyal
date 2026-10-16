import { createFileRoute } from "@tanstack/react-router";

import { site } from "@/content/site";
import { InvitationPage, siteHead } from "@/pages/Invitation";

export const Route = createFileRoute("/")({
  head: () => siteHead(site),
  component: () => <InvitationPage site={site} />,
});
