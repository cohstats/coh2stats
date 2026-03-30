import { CommanderDetails } from "./_components/commanderDetails";

interface PageProps {
  params: Promise<{ race: string; commanderID: string }>;
}

const CommanderDetailsPage = async ({ params }: PageProps) => {
  const { race, commanderID } = await params;
  return <CommanderDetails race={race} commanderID={commanderID} />;
};

export default CommanderDetailsPage;
