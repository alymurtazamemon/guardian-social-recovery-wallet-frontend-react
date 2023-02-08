import { useMoralis } from "react-moralis";
import "./App.css";
import Header from "./components/Header";
import { useEffect } from "react";
import Intro from "./components/Intro";
import TabsList from "./components/TabsList";
import Main from "./components/Main";

function App() {
    const { isWeb3Enabled } = useMoralis();

    useEffect(() => {}, [isWeb3Enabled]);

    console.log("App Component Called");
    console.log(`isWeb3Enabled: ${isWeb3Enabled}`);

    return isWeb3Enabled ? (
        <div className="h-screen mx-72">
            <Header />
            <Main />
        </div>
    ) : (
        <Intro />
    );
}

export default App;
