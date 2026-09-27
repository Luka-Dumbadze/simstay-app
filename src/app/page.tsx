import DesktopShell from "@/components/DesktopShell";
import { getStore } from "@/lib/simustay/store";

export const dynamic = "force-dynamic";

// /?reset=true restarts the demo from pristine start.json before the page renders, so the first frame is
// already clean; the client then removes the query so a reload does not reset again.
export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const urlReset = (await searchParams).reset === "true";
  if (urlReset) getStore().resetAll();
  return <DesktopShell urlReset={urlReset} />;
}
