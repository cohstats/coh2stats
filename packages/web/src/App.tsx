import React from "react";
import { Button } from "antd";
import { Layout } from "antd";
import "./App.css";
import { useFirestoreConnect } from "react-redux-firebase";
import Stats from "./pages/stats";
import { useLoading } from "./firebase";
import { Loading } from "./components/loading";

const { Header, Footer, Content } = Layout;

const App: React.FC = () => {
    useFirestoreConnect([
        {
            collection: "stats",
            doc: "daily",
            subcollections: [
                {
                    collection: "1611964800",
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
        <div className="App">
            <Layout className="layout">
                <Header>
                    <Button type="primary">Button</Button>
                </Header>
                <Content>
                    <Stats />
                </Content>
                <Footer style={{ textAlign: "center" }}>Footer</Footer>
            </Layout>
        </div>
    );
};

export default App;
