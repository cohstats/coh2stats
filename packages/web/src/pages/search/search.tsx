import React, { useEffect, useState } from "react";
import { firebase } from "../../firebase";
import Search from "antd/es/input/Search";
import { useHistory, useParams } from "react-router";
import routes from "../../routes";

const CustomSearch: React.FC = () => {
  const { push } = useHistory();

  const { searchParam } = useParams<{
    searchParam: string;
  }>();

  const [error, setError] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    (async () => {
      if (searchParam) {
        setIsLoading(true);

        const payLoad = { name: searchParam };
        const searchPlayers = firebase.functions().httpsCallable("searchPlayers");

        try {
          const { data } = await searchPlayers(payLoad);
          setSearchData(data);
        } catch (e) {
          console.error(e);
          setError("Error occurred during the search.");
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [searchParam]);

  const onSearch = async (value: string) => {
    push(routes.searchWithParam(value));
  };

  if (error) {
    return <>{error}</>;
  }

  return (
    <div style={{ textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
      <Search
        placeholder="Exact Steam account name"
        defaultValue={searchParam}
        onSearch={onSearch}
        style={{ width: 300, padding: 20 }}
        loading={loading}
        enterButton
      />
      <div>{JSON.stringify(searchData)}</div>
    </div>
  );
};

export default CustomSearch;
