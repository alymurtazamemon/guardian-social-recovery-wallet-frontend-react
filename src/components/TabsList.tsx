import { Tab, TabList } from "@web3uikit/core";
import { GiWallet, GiTakeMyMoney } from "react-icons/gi";
import { BsPersonBoundingBox } from "react-icons/bs";
import { SiAdguard } from "react-icons/si";
import Assets from "./Assets";
import FundsManager from "./FundsManager";

function TabsList(): JSX.Element {
    return (
        <div className="p-12 bg-white">
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
                    <Assets />
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
                    <FundsManager />
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
                    <p>Tab 3</p>
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
                    <p>Tab 4</p>
                </Tab>
            </TabList>
        </div>
    );
}

export default TabsList;
