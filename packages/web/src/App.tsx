import React from "react";
import { Typography } from "antd";
import { Layout } from "antd";
import "./App.css";
import { useFirestoreConnect } from "react-redux-firebase";
import Stats from "./pages/stats";
import { Route, Router, Switch } from "react-router-dom";
import { RampComponent } from "./components/wip-ramp/commanders";

const { Header, Footer, Content } = Layout;

const App: React.FC = () => {
    const { Title } = Typography;

    useFirestoreConnect([
        {
            collection: "stats",
            doc: "daily",
            subcollections: [
                {
                    collection: "1614902400",
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
            <Route path={"/stats/:frequency/:timestamp/:type"}>
                <div className="App">
                    <Layout className="layout">
                        <Header>
                            <Title>Company of Heroes 2 Logs and Statistics</Title>
                        </Header>
                        <Content>
                            <Stats />
                        </Content>
                        <Footer style={{ textAlign: "center" }}>Footer</Footer>
                    </Layout>
                </div>
            </Route>
            <Route path={"/commanders/:race/:commanderID"}>
                <div className="App">
                    <Layout className="layout">
                        <Header>
                            <Title>Company of Heroes 2 Logs and Statistics</Title>
                        </Header>
                        <Content>
                            <RampComponent />
                        </Content>
                        <Footer style={{ textAlign: "center" }}>Footer</Footer>
                    </Layout>
                </div>
            </Route>
        </Switch>
    );
};

export default App;
