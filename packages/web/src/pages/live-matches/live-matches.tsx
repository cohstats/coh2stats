import React, {useEffect, useState} from "react";
import LiveMatchesCard from "./live-matches-card";
import firebaseAnalytics from "../../analytics";
import config from "../../config";
import { useQuery} from "../../utils/helpers";
import {Loading} from "../../components/loading";
import {Row, Select} from "antd";
import {AlertBox} from "../../components/alert-box";
import routes from "../../routes";
import {useHistory} from "react-router";

const { Option } = Select;

const LiveMatches: React.FC = () => {
  const { push } = useHistory();
  const query = useQuery();

  const playerGroup = query.get("playerGroup") || "1";
  const startQuery = query.get("view") || 0;
  const count = 10;


  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [data, setData] = useState<null | Record<string, any>>(null);

  useEffect(() => {
    firebaseAnalytics.liveMatchesDisplayed();

    setIsLoading(true);

    (async () => {
      try {
        const response = await fetch(
          `https://${config.firebaseFunctions.location}-coh2-ladders-prod.cloudfunctions.net/getLiveGamesHttp?playerGroup=${playerGroup}&start=${startQuery}&count=${count}`,
        );
        if (!response.ok) {
          throw new Error(
            `API request failed with code: ${response.status}, res: ${await response.text()}`,
          );
        }
        setData(await response.json());
      } catch (e) {
        let errorMessage = "Failed to do something exceptional";
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        console.error(e);
        setError(JSON.stringify(errorMessage));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [playerGroup, startQuery]);


  console.log(isLoading)
  console.log(error)
  console.log(data)


  const changeRoute = (params: Record<string, any>) => {
    const {
      playerGroupToLoad,
    } = params;

    const searchValue = `?${new URLSearchParams({
      playerGroup: playerGroupToLoad || (playerGroup),
    })}`

    push({
      pathname: routes.liveMatchesBase(),
      search: searchValue,
    });
  }

  const onPlayerGroupSelect = (value: string) => {
    changeRoute({playerGroupToLoad: value})
  };

  let content = <div></div>;


  if(isLoading){
    content = (
      <div style={{ paddingTop: 50 }}>
        <Loading />
    </div>
    )
  }

  if(error){
    content = (
      <Row justify="center" style={{ paddingTop: "10px" }}>
        <AlertBox
          type={"error"}
          message={"There was an error loading the live matches"}
          description={`${JSON.stringify(error)}`}
        />
      </Row>
    )
  }

  if (!error && !isLoading){
    content =(<div>{JSON.stringify(data)}</div>);
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <LiveMatchesCard />

      <Select
        value={playerGroup}
        onChange={onPlayerGroupSelect}
        style={{ width: 120 }}
        size={"large"}
      >
        <Option value="1">1 vs 1</Option>
        <Option value="2">2 vs 2</Option>
        <Option value="3">3 vs 3</Option>
        <Option value="4">4 vs 4</Option>
        <Option value="5">VS AI</Option>
        <Option value="0">Custom Games</Option>
      </Select>

      {content}
    </div>
  );
};

export default LiveMatches;
