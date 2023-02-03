import { useMoralis } from "react-moralis";
import "./App.css";
import Header from "./components/Header";
import { contractAddresses } from "./constants";
import { useEffect } from "react";

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

    return (
        <div className="mx-72">
            <Header />
            <div className="text-center">
                {isWeb3Enabled ? (
                    nftContractAddress ? (
                        <div>Do You Work</div>
                    ) : (
                        <div>Switch Network</div>
                    )
                ) : (
                    <div>Connect Your Wallet First</div>
                )}
            </div>
        </div>
    );
}

export default App;
