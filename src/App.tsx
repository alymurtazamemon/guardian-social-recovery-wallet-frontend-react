import { useMoralis } from "react-moralis";
import "./App.css";
import Header from "./components/Header";
import { contractAddresses } from "./constants";
import { useEffect } from "react";
import Intro from "./components/Intro";

interface contractAddressesInterface {
    [key: string]: string[];
}

function App() {
    const addresses: contractAddressesInterface = contractAddresses;
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis();
    const chainId: string = parseInt(chainIdHex!).toString();
    const nftContractAddress =
        chainId in addresses ? addresses[chainId][0] : null;

    useEffect(() => {}, [isWeb3Enabled]);

    console.log("App Component Called");
    console.log(`isWeb3Enabled: ${isWeb3Enabled}`);

    return isWeb3Enabled ? (
        <div className="h-screen mx-72">
            <Header />
        </div>
    ) : (
        <Intro />
    );
}

export default App;
