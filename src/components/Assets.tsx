import { SiEthereum } from "react-icons/si";
import {
    BsFillArrowDownCircleFill,
    BsFillArrowUpRightCircleFill,
} from "react-icons/bs";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { abi } from "../constants";
import { Input } from "@web3uikit/core";

interface AssetsPropsTypes {
    guardianContractAddress: string;
}

function Assets({ guardianContractAddress }: AssetsPropsTypes): JSX.Element {
    const [walletBalance, setWalletBalance] = useState("0");
    const [walletBalanceInUSD, setWalletBalanceInUSD] = useState("0");

    const { runContractFunction: getBalance } = useWeb3Contract({
        abi: abi,
        contractAddress: guardianContractAddress,
        functionName: "getBalance",
        params: {},
    });

    const { runContractFunction: getBalanceInUSD } = useWeb3Contract({
        abi: abi,
        contractAddress: guardianContractAddress,
        functionName: "getBalanceInUSD",
        params: {},
    });

    useEffect(() => {
        (async () => {
            const balance = (await getBalance()) as String;
            setWalletBalance(balance.toString());

            const balanceInUSD = (await getBalanceInUSD()) as String;
            setWalletBalanceInUSD(balanceInUSD.toString());
        })();
    }, []);

    return (
        <div className="flex flex-col justify-czenter items-center mt-8">
            <div className="border border-gray-400 w-fit p-2 rounded-full">
                <SiEthereum color="black" size={22} />
            </div>
            <h1 className="text-4xl font-medium text-black mt-6">
                {ethers.formatEther(walletBalance)} ETH
            </h1>
            <h2 className="mt-2 mb-4 text-lg">
                ${ethers.formatEther(walletBalanceInUSD)} USD
            </h2>
            <div className="flex mt-2">
                <button
                    className="flex flex-col items-center justify-center mx-4"
                    onClick={() => {
                        console.log("Deposit Clicked!");
                    }}
                >
                    <BsFillArrowDownCircleFill color="#0D72C4" size={40} />
                    <h1 className="text-[#0D72C4] m-2">Deposit</h1>
                </button>
                <button
                    className="flex flex-col items-center justify-center mx-4"
                    onClick={() => {
                        console.log("Send Clicked!");
                    }}
                >
                    <BsFillArrowUpRightCircleFill color="#0D72C4" size={40} />
                    <h1 className="text-[#0D72C4] m-2">Send</h1>
                </button>
                <button
                    className="flex flex-col items-center justify-center mx-4"
                    onClick={() => {
                        console.log("Send Clicked!");
                    }}
                >
                    <BsFillArrowUpRightCircleFill color="#0D72C4" size={40} />
                    <h1 className="text-[#0D72C4] m-2">Send All</h1>
                </button>
            </div>
            <Input
                label="Amount"
                placeholder="Enter Amount to Deposit/Send"
                type="number"
                validation={{
                    numberMin: 0,
                }}
                width="80%"
                style={{
                    marginTop: "32px",
                }}
            />
            <Input
                label="Address"
                placeholder="Enter Address to Send Funds"
                type="text"
                validation={{
                    characterMinLength: 42,
                    characterMaxLength: 42,
                }}
                width="80%"
                style={{
                    marginTop: "32px",
                }}
            />
        </div>
    );
}

export default Assets;
