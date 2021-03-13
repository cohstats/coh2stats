import React from "react";
import { Menu, Row, Typography } from "antd";
import { Layout } from "antd";
import "./App.css";
import { useFirestoreConnect } from "react-redux-firebase";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { RampComponent } from "./components/wip-ramp/commanders";
import { CommandersList } from "./components/wip-ramp/commandersList";
import { RacePicker } from "./components/wip-ramp/racePicker";
import Stats from "./pages/stats";
import { MainFooter } from "./components/MainFooter";

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
                <Header>
                    {/*CoH2*/}
                    {/*<Title style={{display: "inline"}}>CoH 2 Logs & Stats</Title>*/}
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
                        <Menu.Item key="1">Stats</Menu.Item>
                        <Menu.Item disabled={true} key="2">
                            Players
                        </Menu.Item>
                        <Menu.Item disabled={true} key="2">
                            Matches
                        </Menu.Item>
                        <Menu.Item key="3">Commanders</Menu.Item>
                        <Menu.Item key="4">Intel Bulletins</Menu.Item>
                        <Menu.Item key="5">About</Menu.Item>
                    </Menu>
                </Header>
                <Content>
                    <Switch>
                        <Route path={"/stats/:frequency/:timestamp"}>
                            <Stats />
                        </Route>
                        <Route path={"/stats"}>
                            <Redirect to={"/stats/"} />
                        </Route>
                        <Route path={"/commanders/:race/:commanderID"}>
                            <RampComponent />
                        </Route>
                        <Route path={"/commanders/:race"}>
                            <CommandersList />
                        </Route>

                        <Route path={"/commanders"}>
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
