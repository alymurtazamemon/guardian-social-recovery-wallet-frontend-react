import { Tab, TabList } from "@web3uikit/core";
import { GiWallet, GiTakeMyMoney } from "react-icons/gi";
import { BsPersonBoundingBox } from "react-icons/bs";
import { SiAdguard } from "react-icons/si";
import Assets from "./Assets";
import FundsManager from "./FundsManager";
import OwnershipManager from "./OwnershipManager";
import GuardiansManager from "./GuardiansManager";

interface TabsListPropsTypes {
    walletContractAddress: string;
    chainId: string;
}

function TabsList({
    chainId,
    walletContractAddress,
}: TabsListPropsTypes): JSX.Element {
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
                        guardianContractAddress={walletContractAddress!}
                        chainId={chainId}
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
                        guardianContractAddress={walletContractAddress!}
                        chainId={chainId}
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
                    <OwnershipManager
                        guardianContractAddress={walletContractAddress!}
                        chainId={chainId}
                    />
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
                        guardianContractAddress={walletContractAddress!}
                    />
                </Tab>
            </TabList>
        </div>
    );
}

export default TabsList;
