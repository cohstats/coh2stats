import React, { useEffect, useState } from "react";
import { firebase } from "../../firebase";
import Search from "antd/es/input/Search";

const SearchPlayground: React.FC = () => {
  const [error, setError] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const [playerGroups, setPlayerGroups] = useState([]);

  const onSearch = async (value: string) => {
    setIsLoading(true);

    const payLoad = { name: value };
    const searchPlayersOnRelic = firebase.functions().httpsCallable("searchPlayers");

    try {
      const { data } = await searchPlayersOnRelic(payLoad);
      console.log(data);
      setPlayerGroups(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Search
        placeholder="Exact Steam account name"
        onSearch={onSearch}
        style={{ width: 200 }}
        loading={loading}
        enterButton
      />
      <div>{JSON.stringify(playerGroups)}</div>
    </div>
  );
};

export default SearchPlayground;
