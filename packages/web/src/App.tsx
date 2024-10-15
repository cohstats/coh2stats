import React from "react";
import { Layout } from "antd";
import "./App.css";
import { Switch } from "react-router-dom";
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
import PlayerCard from "./pages/players/player-card";
import MapStats from "./pages/map-stats";
import LiveMatches from "./pages/live-matches";
import { ErrorBoundary } from "./components/error-boundary";
import SingleMatch from "./pages/match";
import NotFound from "./pages/not-found";
import UserProfile from "./pages/profile";
import RecentMatches from "./pages/recent-matches/recent-matches";
import Regions from "./pages/about/regions";
import PlayersPage from "./pages/players";
import { CompatRoute, CompatRouter } from "react-router-dom-v5-compat";

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <div className="App">
      <Layout className="layout">
        <MainHeader />
        <Content>
          <ErrorBoundary>
          <CompatRouter>
            <Switch>
              <CompatRoute path={"/"} exact={true}>
                <MainHome />
              </CompatRoute>
              <CompatRoute path={routes.fullStatsOldDetails()}>
                <OldStats />
              </CompatRoute>
              <CompatRoute path={routes.mapStats()}>
                <MapStats />
              </CompatRoute>
              <CompatRoute path={routes.statsBase()}>
                <CustomStats />
              </CompatRoute>
              <CompatRoute path={routes.playerCardWithIdAndName()}>
                <PlayerCard />
              </CompatRoute>
              <CompatRoute path={routes.playerCardWithId()}>
                <PlayerCard />
              </CompatRoute>
              <CompatRoute path={routes.playerCardBase()}>
                <PlayersPage />
              </CompatRoute>
              <CompatRoute path={routes.leaderboardsBase()}>
                <Leaderboards />
              </CompatRoute>
              <CompatRoute path={routes.commanderByID()}>
                <CommanderDetails />
              </CompatRoute>
              <CompatRoute path={routes.commanderList()}>
                <CommandersList />
              </CompatRoute>
              <CompatRoute path={routes.commanderBase()}>
                <RacePicker />
              </CompatRoute>
              <CompatRoute path={routes.desktopAppBase()}>
                <DesktopApp />
              </CompatRoute>
              <CompatRoute path={routes.liveMatchesBase()}>
                <LiveMatches />
              </CompatRoute>
              <CompatRoute path={routes.regionsBase()}>
                <Regions />
              </CompatRoute>
              <CompatRoute path={routes.aboutBase()}>
                <About />
              </CompatRoute>
              <CompatRoute path={routes.bulletinsBase()}>
                <BulletinList />
              </CompatRoute>
              <CompatRoute path={routes.searchWithParam()}>
                <CustomSearch />
              </CompatRoute>
              <CompatRoute path={routes.searchBase()}>
                <CustomSearch />
              </CompatRoute>
              <CompatRoute path={routes.singleMatch()}>
                <SingleMatch />
              </CompatRoute>
              <CompatRoute path={routes.recentMatchesBase()}>
                <RecentMatches />
              </CompatRoute>
              <CompatRoute path="/userProfile">
                <UserProfile />
              </CompatRoute>
              <CompatRoute path="*">
                <NotFound />
              </CompatRoute>
            </Switch>
          </CompatRouter>
          </ErrorBoundary>
        </Content>
        <MainFooter />
      </Layout>
    </div>
  );
};

export default App;
