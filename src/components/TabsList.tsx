import { Tab, TabList } from "@web3uikit/core";
import { GiWallet, GiTakeMyMoney } from "react-icons/gi";
import { BsPersonBoundingBox } from "react-icons/bs";
import { SiAdguard } from "react-icons/si";
import Assets from "./Assets";
import FundsManager from "./FundsManager";
import OwnershipManager from "./OwnershipManager";
import GuardiansManager from "./GuardiansManager";
import { contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { useState } from "react";

interface contractAddressesInterface {
    [key: string]: string[];
}

function TabsList(): JSX.Element {
    const addresses: contractAddressesInterface = contractAddresses;
    const { chainId: chainIdHex } = useMoralis();
    const chainId: string = parseInt(chainIdHex!).toString();
    const guardianContractAddress =
        chainId in addresses ? addresses[chainId][0] : null;

    return (
        <div className="p-12 bg-white min-h-screen">
            <TabList
                defaultActiveKey={1}
                onChange={function noRefCheck() {}}
                tabStyle="bulbUnion"
                isWidthAuto={true}
            >
                <Tab
                    tabKey={1}
                    tabName={
                        <div style={{ display: "flex" }}>
                            <GiWallet
                                size={22}
                                style={{ marginRight: "8px" }}
                            />
                            <span style={{ paddingLeft: "4px" }}>Assets</span>
                        </div>
                    }
                >
                    <Assets
                        guardianContractAddress={guardianContractAddress!}
                    />
                </Tab>
                <Tab
                    tabKey={2}
                    tabName={
                        <div style={{ display: "flex" }}>
                            <GiTakeMyMoney
                                size={22}
                                style={{ marginRight: "8px" }}
                            />
                            <span style={{ paddingLeft: "4px" }}>
                                Manage Funds
                            </span>
                        </div>
                    }
                >
                    <FundsManager
                        guardianContractAddress={guardianContractAddress!}
                    />
                </Tab>
                <Tab
                    tabKey={3}
                    tabName={
                        <div style={{ display: "flex" }}>
                            <BsPersonBoundingBox
                                size={22}
                                style={{ marginRight: "8px" }}
                            />
                            <span style={{ paddingLeft: "4px" }}>
                                Manage Ownership
                            </span>
                        </div>
                    }
                >
                    <OwnershipManager />
                </Tab>
                <Tab
                    tabKey={4}
                    tabName={
                        <div style={{ display: "flex" }}>
                            <SiAdguard
                                size={22}
                                style={{ marginRight: "8px" }}
                            />
                            <span style={{ paddingLeft: "4px" }}>
                                Manage Guardians
                            </span>
                        </div>
                    }
                >
                    <GuardiansManager
                        guardianContractAddress={guardianContractAddress!}
                    />
                </Tab>
            </TabList>
        </div>
    );
}

export default TabsList;
