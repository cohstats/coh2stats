import { CommanderDetails } from "./_components/commanderDetails";
import allCommandersJSON from "@/coh/data/cu2021/commanderData.json";

interface PageProps {
  params: Promise<{ race: string; commanderID: string }>;
}

export async function generateStaticParams() {
  const allCommanders = allCommandersJSON as Record<string, any>;

  return Object.entries(allCommanders)
    .filter(([_, data]: [string, any]) => data.races && data.races[0])
    .map(([commanderID, data]: [string, any]) => ({
      race: data.races[0],
      commanderID,
    }));
}

const CommanderDetailsPage = async ({ params }: PageProps) => {
  const { race, commanderID } = await params;
  return <CommanderDetails race={race} commanderID={commanderID} />;
};

export default CommanderDetailsPage;
