import { CommandersList } from "./_components/commandersList";
import { validRaceNames } from "@/coh/types";

interface PageProps {
  params: Promise<{ race: string }>;
}

export async function generateStaticParams() {
  return validRaceNames.map((race) => ({ race }));
}

const CommandersListPage = async ({ params }: PageProps) => {
  const { race } = await params;
  return <CommandersList race={race} />;
};

export default CommandersListPage;
