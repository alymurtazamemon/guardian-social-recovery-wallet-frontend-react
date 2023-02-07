import { AiFillCheckCircle } from "react-icons/ai";
import { Input } from "@web3uikit/core";
import TextButton from "./TextButton";
import GuardianAndConfirmation from "./GuardianAndConfirmation";
import { abi } from "../constants";
import { useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";

interface FundsManagerPropsTypes {
    guardianContractAddress: string;
}

function FundsManager({
    guardianContractAddress,
}: FundsManagerPropsTypes): JSX.Element {
    const [dailyTransferLimit, setDailyTransferLimit] = useState<string>("0");
    const [dailyTransferLimitInUsd, setDailyTransferLimitInUsd] =
        useState<string>("0");

    const { runContractFunction: getDailyTransferLimit } = useWeb3Contract({
        abi: abi,
        contractAddress: guardianContractAddress,
        functionName: "getDailyTransferLimit",
        params: {},
    });

    const { runContractFunction: getDailyTransferLimitInUSD } = useWeb3Contract(
        {
            abi: abi,
            contractAddress: guardianContractAddress,
            functionName: "getDailyTransferLimitInUSD",
            params: {},
        }
    );

    useEffect(() => {
        (async () => {
            const dailyLimit = (await getDailyTransferLimit()) as String;
            setDailyTransferLimit(dailyLimit.toString());

            const dailyLimitInUsd =
                (await getDailyTransferLimitInUSD()) as String;
            setDailyTransferLimitInUsd(dailyLimitInUsd.toString());
        })();
    }, []);

    return (
        <div>
            <div className="flex flex-col justify-czenter items-center mt-8">
                <h1 className="text-4xl font-bold text-black mt-6">
                    Daily Withdrawal Limit
                </h1>
                <h2 className="text-4xl font-medium text-black mt-6">
                    {ethers.utils.formatEther(dailyTransferLimit)} ETH
                </h2>
                <h3 className="mt-2 mb-16 text-lg">
                    ${ethers.utils.formatEther(dailyTransferLimitInUsd)} USD
                </h3>

                <Input
                    label="Amount"
                    placeholder="Enter Daily Limit Amount"
                    type="number"
                    validation={{
                        numberMin: 1,
                    }}
                    width="80%"
                />
                <TextButton text="Request To Update Limit" />
            </div>
            <div className="mt-8">
                <h1 className="text-2xl text-black font-extrabold">
                    Information
                </h1>
                <p className="text-lg my-4">
                    Current Daily Transfer Limit:{" "}
                    {ethers.utils.formatEther(dailyTransferLimit)} ETH
                </p>
                <p className="text-lg my-4">
                    Last Daily Tranfer Update Request Time:{" "}
                    {"01:01:2023 6:17:00 PM"}
                </p>
                <p className="text-lg my-4">
                    Current Request Status:{" "}
                    <span className="text-[#008001] font-bold">Inactive</span>
                </p>
                <p className="text-lg my-4">
                    Dialy Tranfer Update Confirmation Time Left:{" "}
                    {"01:01:2023 6:17:00 PM"}
                </p>
                <h2 className="text-xl text-black font-bold my-4">
                    Confirmed By:
                </h2>
                <ol>
                    <GuardianAndConfirmation />
                    <GuardianAndConfirmation />
                    <GuardianAndConfirmation />
                </ol>
            </div>
            <div className="flex flex-col items-center mt-4">
                <TextButton text="Confirm Request" />
                <TextButton text="Confirm And Update Daily Transfer Limit" />
            </div>
        </div>
    );
}

export default FundsManager;
