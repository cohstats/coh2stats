import React from "react";
import { Layout } from "antd";
import "./App.css";
import { useFirestoreConnect } from "react-redux-firebase";
import { Route, Switch } from "react-router-dom";
import { CommanderDetails } from "./pages/commanders/commanders";
import { CommandersList } from "./pages/commanders/commandersList";
import { RacePicker } from "./pages/commanders/racePicker";
import { BulletinList } from "./pages/commanders/bulletinList";
import Stats from "./pages/stats";
import { MainFooter } from "./components/main-footer";
import routes from "./routes";
import { MainHeader } from "./components/main-header";
import About from "./pages/about";
<<<<<<< HEAD
import { LastMatchesTable } from "./pages/matches/lastMatchesTable";
=======
import Playground from "./pages/playground";
>>>>>>> 743146ae8a680659012f0fe1468e3135edd6aca1

const { Content } = Layout;

const App: React.FC = () => {
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
              <Stats />
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
            <Route path={routes.aboutBase()}>
              <About />
            </Route>
            <Route path={routes.bulletinsBase()}>
              <BulletinList />
            </Route>
<<<<<<< HEAD
            <Route path={"/test"}>
              <LastMatchesTable />
=======
            <Route path={"/playground"}>
              <Playground />
>>>>>>> 743146ae8a680659012f0fe1468e3135edd6aca1
            </Route>
          </Switch>
        </Content>
        <MainFooter />
      </Layout>
    </div>
  );
};

export default App;
