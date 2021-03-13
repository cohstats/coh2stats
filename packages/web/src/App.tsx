import React from "react";
import { Menu, Row, Typography } from "antd";
import { Layout } from "antd";
import "./App.css";
import { useFirestoreConnect } from "react-redux-firebase";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { CommanderDetails } from "./components/wip-ramp/commanders";
import { CommandersList } from "./components/wip-ramp/commandersList";
import { RacePicker } from "./components/wip-ramp/racePicker";
import Stats from "./pages/stats";
import { MainFooter } from "./components/main-footer";
import routes from "./routes";
import { MainHeader } from "./components/main-header";

const { Header, Footer, Content } = Layout;

const App: React.FC = () => {
  const { Title } = Typography;

  useFirestoreConnect([
    {
      collection: "stats",
      doc: "global",
      storeAs: "globalStats",
    },
  ]);

  return (
    <div className="App">
      <Layout className="layout">
        <MainHeader />
        <Content>
          <Switch>
            <Route path={"/stats/:frequency/:timestamp"}>
              <Stats />
            </Route>
            <Route path={"/stats"}>
              <Redirect to={"/stats/"} />
            </Route>
            <Route path={routes.commanderByID()}>
              <CommanderDetails />
            </Route>
            <Route path={routes.commanderList()}>
              <CommandersList />
            </Route>
            <Route path={routes.commanderBase()}>
              <RacePicker />
            </Route>
          </Switch>
        </Content>
        <MainFooter />
      </Layout>
    </div>
  );
};

export default App;
