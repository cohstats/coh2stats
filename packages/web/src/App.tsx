import React from "react";
import { Typography } from "antd";
import { Layout } from "antd";
import "./App.css";
import { useFirestoreConnect } from "react-redux-firebase";
import StatsDetails from "./pages/stats";
import { Route, Router, Switch } from "react-router-dom";
import { RampComponent } from "./components/wip-ramp/commanders";
import { CommandersList } from "./components/wip-ramp/commandersList";
import { RacePicker } from "./components/wip-ramp/racePicker";
const { Header, Footer, Content } = Layout;

const App: React.FC = () => {
    const { Title } = Typography;

    useFirestoreConnect([
        {
            collection: "stats",
            doc: "daily",
            subcollections: [
                {
                    collection: "1615334400",
                    doc: "stats",
                },
            ],
            storeAs: "stats",
        },
        {
            collection: "stats",
            doc: "global",
            storeAs: "globalStats",
        },
    ]);

    return (
        <Switch>
            <Route path={"/stats/:frequency/:timestamp/:type/:race"}>
                <div className="App">
                    <Layout className="layout">
                        <Header>
                            <Title>Company of Heroes 2 Logs and Statistics</Title>
                        </Header>
                        <Content>
                            <StatsDetails />
                        </Content>
                        <Footer style={{ textAlign: "center" }}>Footer</Footer>
                    </Layout>
                </div>
            </Route>
            <Route path={"/commanders/:race/:commanderID"}>
                <div className="App">
                    <Layout className="layout">
                        <Header>
                            {/* ellipsis=true to prevent text overflowing on the next line when window width is too low */}
                            <Title ellipsis={true} style={{ textAlign: "left" }}>
                                Company of Heroes 2 Logs and Statistics
                            </Title>
                        </Header>
                        <Content>
                            <RampComponent />
                        </Content>
                        <Footer style={{ textAlign: "center" }}>Footer</Footer>
                    </Layout>
                </div>
            </Route>

            <Route path={"/commanders/:race"}>
                <div className="App">
                    <Layout className="layout">
                        <Header>
                            {/* ellipsis=true to prevent text overflowing on the next line when window width is too low */}
                            <Title ellipsis={true} style={{ textAlign: "left" }}>
                                Company of Heroes 2 Logs and Statistics
                            </Title>
                        </Header>
                        <Content>
                            <CommandersList />
                        </Content>
                        <Footer style={{ textAlign: "center" }}>Footer</Footer>
                    </Layout>
                </div>
            </Route>

            <Route path={"/commanders"}>
                <div className="App">
                    <Layout className="layout">
                        <Header>
                            {/* ellipsis=true to prevent text overflowing on the next line when window width is too low */}
                            <Title ellipsis={true} style={{ textAlign: "left" }}>
                                Company of Heroes 2 Logs and Statistics
                            </Title>
                        </Header>
                        <Content>
                            <RacePicker />
                        </Content>
                        <Footer style={{ textAlign: "center" }}>Footer</Footer>
                    </Layout>
                </div>
            </Route>
        </Switch>
    );
};

export default App;
