import { AiFillBell, AiFillCheckCircle } from "react-icons/ai";
import { Input, useNotification } from "@web3uikit/core";
import TextButton from "./TextButton";
import GuardianAndConfirmation from "./GuardianAndConfirmation";
import { abi } from "../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";

interface FundsManagerPropsTypes {
    guardianContractAddress: string;
}

enum NotificationType {
    warning,
    success,
    error,
}

function FundsManager({
    guardianContractAddress,
}: FundsManagerPropsTypes): JSX.Element {
    const dispatch = useNotification();

    const { account } = useMoralis();
    const [owner, setOwner] = useState<string>("");
    const [dailyTransferLimit, setDailyTransferLimit] = useState<string>("0");
    const [dailyTransferLimitInUsd, setDailyTransferLimitInUsd] =
        useState<string>("0");
    const [
        dailyTransferLimitUpdateRequestTime,
        setDailyTransferLimitUpdateRequestTime,
    ] = useState<string>("0");
    const [
        dailyTransferLimitUpdateRequestStatus,
        setDailyTransferUpdateRequestStatus,
    ] = useState<boolean>(false);
    const [limit, setLimit] = useState<number>();

    const { runContractFunction: getOwner } = useWeb3Contract({
        abi: abi,
        contractAddress: guardianContractAddress,
        functionName: "owner",
        params: {},
    });

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

    const { runContractFunction: getLastDailyTransferUpdateRequestTime } =
        useWeb3Contract({
            abi: abi,
            contractAddress: guardianContractAddress,
            functionName: "getLastDailyTransferUpdateRequestTime",
            params: {},
        });

    const { runContractFunction: getDailyTransferLimitUpdateRequestStatus } =
        useWeb3Contract({
            abi: abi,
            contractAddress: guardianContractAddress,
            functionName: "getDailyTransferLimitUpdateRequestStatus",
            params: {},
        });

    useEffect(() => {
        (async () => {
            const dailyLimit = (await getDailyTransferLimit()) as String;
            setDailyTransferLimit(dailyLimit.toString());

            const dailyLimitInUsd =
                (await getDailyTransferLimitInUSD()) as String;
            setDailyTransferLimitInUsd(dailyLimitInUsd.toString());

            const requestTime =
                (await getLastDailyTransferUpdateRequestTime()) as BigNumber;
            setDailyTransferLimitUpdateRequestTime(
                requestTime.toNumber() == 0
                    ? "Never Requested"
                    : new Date(requestTime.toNumber() * 1000).toString()
            );

            const requestStatus =
                (await getDailyTransferLimitUpdateRequestStatus()) as boolean;
            // setDailyTransferUpdateRequestStatus(requestStatus);

            const owner = (await getOwner()) as String;
            setOwner(owner.toString());
        })();
    }, []);

    function handleRequestToUpdateLimitOnClick() {
        if (limit == undefined) {
            _showNotification(
                NotificationType.warning,
                "Amount Not Found",
                "Please input the limit amount in the amount field."
            );
            return;
        }
    }

    function _showNotification(
        type: NotificationType,
        title: string,
        message: string
    ) {
        dispatch({
            type:
                type == NotificationType.warning
                    ? "warning"
                    : type == NotificationType.success
                    ? "success"
                    : "error",
            title: title,
            message: message,
            icon: <AiFillBell />,
            position: "topR",
        });
    }

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

                {owner.toLowerCase() == account?.toLowerCase() &&
                    !dailyTransferLimitUpdateRequestStatus && (
                        <Input
                            label="Amount"
                            placeholder="Enter Daily Limit Amount"
                            type="number"
                            validation={{
                                numberMin: 1,
                            }}
                            width="80%"
                            value={limit}
                            onChange={(event) =>
                                setLimit(Number(event.target.value))
                            }
                        />
                    )}
                {owner.toLowerCase() == account?.toLowerCase() &&
                    !dailyTransferLimitUpdateRequestStatus && (
                        <TextButton
                            text="Request To Update Limit"
                            onClick={handleRequestToUpdateLimitOnClick}
                        />
                    )}
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
                    Last Daily Transfer Update Request Time:{" "}
                    {dailyTransferLimitUpdateRequestTime}
                </p>
                <p className="text-lg my-4">
                    Current Request Status:{" "}
                    <span
                        className={`${
                            dailyTransferLimitUpdateRequestStatus
                                ? "text-[#008001]"
                                : "text-[#0D72C4]"
                        } font-bold`}
                    >
                        {dailyTransferLimitUpdateRequestStatus
                            ? "Active"
                            : "Inactive"}
                    </span>
                </p>
                {dailyTransferLimitUpdateRequestStatus && (
                    <div>
                        <p className="text-lg my-4">
                            Dialy Transfer Update Confirmation Time Left:{" "}
                            {"01:01:2023 6:17:00 PM"}
                        </p>
                        {owner.toLowerCase() == account?.toLowerCase() && (
                            <div>
                                <h2 className="text-xl text-black font-bold my-4">
                                    Confirmed By:
                                </h2>
                                <ol>
                                    <GuardianAndConfirmation />
                                    <GuardianAndConfirmation />
                                    <GuardianAndConfirmation />
                                </ol>
                            </div>
                        )}
                        <div className="flex flex-col items-center mt-4">
                            {owner.toLowerCase() != account?.toLowerCase() && (
                                <TextButton text="Confirm Request" />
                            )}
                            {owner.toLowerCase() == account?.toLowerCase() && (
                                <TextButton text="Confirm And Update Daily Transfer Limit" />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FundsManager;
