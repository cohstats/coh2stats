import React, { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import routes from "../../../routes";

/**
 * This is old stats format, it's used for redirect from the old links
 *
 */
const OldStats: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const frequency = params?.frequency as string | undefined;
  const timestamp = params?.timestamp as string | undefined;
  const type = params?.type as string | undefined;
  const race = params?.race as string | undefined;

  const statsSourceQuery = searchParams?.get("statsSource");

  useEffect(() => {
    const searchValue = `?${new URLSearchParams({
      range: frequency || "",
      statsSource: statsSourceQuery || "all",
      type: type || "",
      race: race || "",
      timeStamp: timestamp || "",
    })}`;

    router.push(`${routes.statsBase()}${searchValue}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default OldStats;
