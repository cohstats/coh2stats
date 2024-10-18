import React from "react";
import { Layout } from "antd";
import "./App.css";
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
import { Routes, Route, CompatRouter } from "react-router-dom-v5-compat";

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <div className="App">
      <Layout className="layout">
        <MainHeader />
        <Content>
          <ErrorBoundary>
            <CompatRouter>
              <Routes>
                <Route path={"/"} element={<MainHome />} />
                <Route path={routes.fullStatsOldDetails()} element={<OldStats />} />
                <Route path={routes.mapStats()} element={<MapStats />} />
                <Route path={routes.statsBase()} element={<CustomStats />} />
                <Route path={routes.playerCardWithIdAndName()} element={<PlayerCard />} />
                <Route path={routes.playerCardWithId()} element={<PlayerCard />} />
                <Route path={routes.playerCardBase()} element={<PlayersPage />} />
                <Route path={routes.leaderboardsBase()} element={<Leaderboards />} />
                <Route path={routes.commanderByID()} element={<CommanderDetails />} />
                <Route path={routes.commanderList()} element={<CommandersList />} />
                <Route path={routes.commanderBase()} element={<RacePicker />} />
                <Route path={routes.desktopAppBase()} element={<DesktopApp />} />
                <Route path={routes.liveMatchesBase()} element={<LiveMatches />} />
                <Route path={routes.regionsBase()} element={<Regions />} />
                <Route path={routes.aboutBase()} element={<About />} />
                <Route path={routes.bulletinsBase()} element={<BulletinList />} />
                <Route path={routes.searchWithParam()} element={<CustomSearch />} />
                <Route path={routes.searchBase()} element={<CustomSearch />} />
                <Route path={routes.singleMatch()} element={<SingleMatch />} />
                <Route path={routes.recentMatchesBase()} element={<RecentMatches />} />
                <Route path="/userProfile" element={<UserProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </CompatRouter>
          </ErrorBoundary>
        </Content>
        <MainFooter />
      </Layout>
    </div>
  );
};

export default App;
