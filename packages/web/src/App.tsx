import React from "react";
import { Layout } from "antd";
import "./App.css";
import { Route, Switch } from "react-router-dom";

import routes from "./routes";
import { CommanderDetails } from "./pages/commanders/commanderDetails";
import { CommandersList } from "./pages/commanders/commandersList";
import { RacePicker } from "./pages/commanders/racePicker";
import DesktopApp from "./pages/desktop-app/desktop-app";
import BulletinList from "./pages/bulletins";
import OldStats from "./pages/stats/old-stats";
import { MainFooter } from "./components/main-footer";
import { MainHeader } from "./components/main-header";
import About from "./pages/about";
import CustomSearch from "./pages/search";
import MainHome from "./components/main-home";
import CustomStats from "./pages/stats/custom-stats";
import Leaderboards from "./pages/ladders";
import PlayerCard from "./pages/players";
import MapStats from "./pages/map-stats";
import LiveMatches from "./pages/live-matches";
import { ErrorBoundary } from "./components/error-boundary";
import SingleMatch from "./pages/match";
import NotFound from "./pages/not-found";
import UserProfile from "./pages/profile";
import RecentMatches from "./pages/recent-matches/recent-matches";
import Regions from "./pages/regions";

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <div className="App">
      <Layout className="layout">
        <MainHeader />
        <Content>
          <ErrorBoundary>
            <Switch>
              <Route path={"/"} exact={true}>
                <MainHome />
              </Route>
              <Route path={routes.fullStatsOldDetails()}>
                <OldStats />
              </Route>
              <Route path={routes.mapStats()}>
                <MapStats />
              </Route>
              <Route path={routes.statsBase()}>
                <CustomStats />
              </Route>
              <Route path={routes.playerCardWithIdAndName()}>
                <PlayerCard />
              </Route>
              <Route path={routes.playerCardWithId()}>
                <PlayerCard />
              </Route>
              <Route path={routes.playerCardBase()}>
                <CustomSearch />
              </Route>
              <Route path={routes.leaderboardsBase()}>
                <Leaderboards />
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
              <Route path={routes.desktopAppBase()}>
                <DesktopApp />
              </Route>
              <Route path={routes.liveMatchesBase()}>
                <LiveMatches />
              </Route>
              <Route path={routes.regionsBase()}>
                <Regions />
              </Route>
              <Route path={routes.aboutBase()}>
                <About />
              </Route>
              <Route path={routes.bulletinsBase()}>
                <BulletinList />
              </Route>
              <Route path={routes.searchWithParam()}>
                <CustomSearch />
              </Route>
              <Route path={routes.searchBase()}>
                <CustomSearch />
              </Route>
              <Route path={routes.singleMatch()}>
                <SingleMatch />
              </Route>
              <Route path={routes.recentMatchesBase()}>
                <RecentMatches />
              </Route>
              <Route path="/userProfile">
                <UserProfile />
              </Route>
              <Route path="*">
                <NotFound />
              </Route>
            </Switch>
          </ErrorBoundary>
        </Content>
        <MainFooter />
      </Layout>
    </div>
  );
};

export default App;
