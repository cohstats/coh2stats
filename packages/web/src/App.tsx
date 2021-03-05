import React from "react";
import { Typography } from "antd";
import { Layout } from "antd";
import "./App.css";
import { useFirestoreConnect } from "react-redux-firebase";
import Stats from "./pages/stats";
import { Route, Router, Switch } from "react-router-dom";

const { Header, Footer, Content } = Layout;

const App: React.FC = () => {
    const { Title } = Typography;

    useFirestoreConnect([
        {
            collection: "stats",
            doc: "daily",
            subcollections: [
                {
                    collection: "1614470400",
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
        </Switch>
    );
};

export default App;
