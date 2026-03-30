import { CommandersList } from "./_components/commandersList";

interface PageProps {
  params: Promise<{ race: string }>;
}

const CommandersListPage = async ({ params }: PageProps) => {
  const { race } = await params;
  return <CommandersList race={race} />;
};

export default CommandersListPage;
