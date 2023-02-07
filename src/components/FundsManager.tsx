import { AiFillBell, AiFillCheckCircle } from "react-icons/ai";
import { Input, useNotification } from "@web3uikit/core";
import TextButton from "./TextButton";
import GuardianAndConfirmation from "./GuardianAndConfirmation";
import { abi } from "../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { BigNumber, ContractTransaction, ethers } from "ethers";

interface FundsManagerPropsTypes {
    guardianContractAddress: string;
}

enum NotificationType {
    warning,
    success,
    error,
    info,
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
    const [confirmationTime, setConfirmationTime] = useState<string>("0");
    const [guardians, setGuardians] = useState<string[]>([]);

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

    const { runContractFunction: getDailyTransferLimitUpdateConfirmationTime } =
        useWeb3Contract({
            abi: abi,
            contractAddress: guardianContractAddress,
            functionName: "getDailyTransferLimitUpdateConfirmationTime",
            params: {},
        });

    const { runContractFunction: getDailyTransferLimitUpdateRequestStatus } =
        useWeb3Contract({
            abi: abi,
            contractAddress: guardianContractAddress,
            functionName: "getDailyTransferLimitUpdateRequestStatus",
            params: {},
        });

    const { runContractFunction: requestToUpdateDailyTransferLimit } =
        useWeb3Contract({
            abi: abi,
            contractAddress: guardianContractAddress,
            functionName: "requestToUpdateDailyTransferLimit",
            params: {
                limit:
                    limit == undefined
                        ? ethers.utils.parseEther("1")
                        : ethers.utils.parseEther(limit?.toString()),
            },
        });

    const { runContractFunction: confirmDailyTransferLimitRequest } =
        useWeb3Contract({
            abi: abi,
            contractAddress: guardianContractAddress,
            functionName: "confirmDailyTransferLimitRequest",
            params: {},
        });

    const { runContractFunction: getGuardians } = useWeb3Contract({
        abi: abi,
        contractAddress: guardianContractAddress,
        functionName: "getGuardians",
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
            setDailyTransferUpdateRequestStatus(requestStatus);

            const owner = (await getOwner()) as String;
            setOwner(owner.toString());

            const confirmationTime =
                (await getDailyTransferLimitUpdateConfirmationTime()) as BigNumber;

            setConfirmationTime(
                new Date(
                    (confirmationTime.toNumber() + requestTime.toNumber()) *
                        1000
                ).toString()
            );

            const guardians = (await getGuardians()) as string[];
            setGuardians(guardians);
        })();
    }, []);

    async function handleRequestToUpdateLimitOnClick() {
        if (limit == undefined) {
            _showNotification(
                NotificationType.warning,
                "Amount Not Found",
                "Please input the limit amount in the amount field."
            );
            return;
        }

        await requestToUpdateDailyTransferLimit({
            onSuccess: (tx) =>
                handleUpdateLimitOnSuccess(tx as ContractTransaction),
            onError: _handleAllErrors,
        });
    }

    async function handleUpdateLimitOnSuccess(tx: ContractTransaction) {
        await tx.wait(1);

        const dailyLimit = (await getDailyTransferLimit()) as String;
        const dailyLimitInUsd = (await getDailyTransferLimitInUSD()) as String;
        const requestStatus =
            (await getDailyTransferLimitUpdateRequestStatus()) as boolean;
        const requestTime =
            (await getLastDailyTransferUpdateRequestTime()) as BigNumber;
        const confirmationTime =
            (await getDailyTransferLimitUpdateConfirmationTime()) as BigNumber;

        _showNotification(
            NotificationType.info,
            "Requested",
            `Daily Transfer Limit Requested to Update to ${limit} ETH.`
        );

        setDailyTransferLimit(dailyLimit.toString());
        setDailyTransferLimitInUsd(dailyLimitInUsd.toString());
        setDailyTransferUpdateRequestStatus(requestStatus);
        setDailyTransferLimitUpdateRequestTime(
            requestTime.toNumber() == 0
                ? "Never Requested"
                : new Date(requestTime.toNumber() * 1000).toString()
        );
        setConfirmationTime(
            new Date(
                (confirmationTime.toNumber() + requestTime.toNumber()) * 1000
            ).toString()
        );
    }

    async function handleConfirmRequestOnClick() {
        await confirmDailyTransferLimitRequest({
            onSuccess: (tx) =>
                handleConfirmRequestOnSuccess(tx as ContractTransaction),
            onError: _handleAllErrors,
        });
    }

    async function handleConfirmRequestOnSuccess(tx: ContractTransaction) {
        await tx.wait(1);

        _showNotification(
            NotificationType.info,
            "Success",
            `Your permission is marked as confirmed.`
        );
    }

    function _handleAllErrors(error: Error) {
        if (error.message.includes("User denied transaction signature.")) {
            _showNotification(
                NotificationType.error,
                "Permission Denied",
                "User denied transaction signature."
            );
        } else if (error.message.toLowerCase().includes("nonce too high")) {
            _showNotification(
                NotificationType.error,
                "Invalid Nonce",
                "Reset your Metamask."
            );
        } else if (error.message.includes("Ownable: caller is not the owner")) {
            _showNotification(
                NotificationType.error,
                "Access Denied",
                "The caller is not the owner and does not have permission to perform this action."
            );
        } else if (error.message.includes("Error__GuardiansListIsEmpty")) {
            _showNotification(
                NotificationType.error,
                "Empty Guardians List",
                "The list of guardians is empty. Please add a guardian and try again."
            );
        } else if (error.message.includes("Error__InvalidLimit")) {
            _showNotification(
                NotificationType.error,
                "Invalid Limit",
                "The limit entered is not valid. Please check and enter a valid limit."
            );
        } else {
            _showNotification(
                NotificationType.error,
                error.name,
                error.message
            );
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
                    : type == NotificationType.info
                    ? "info"
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
                            Confirmation Till: {confirmationTime}
                        </p>
                        {owner.toLowerCase() == account?.toLowerCase() && (
                            <div>
                                <h2 className="text-xl text-black font-bold my-4">
                                    Confirmed By:
                                </h2>
                                <ol>
                                    {guardians.map((guardian, index) => {
                                        return (
                                            <GuardianAndConfirmation
                                                index={index}
                                                guardianContractAddress={
                                                    guardianContractAddress
                                                }
                                                guardianAddress={guardian}
                                            />
                                        );
                                    })}
                                </ol>
                            </div>
                        )}
                        <div className="flex flex-col items-center mt-4">
                            {owner.toLowerCase() != account?.toLowerCase() && (
                                <TextButton
                                    text="Confirm Request"
                                    onClick={handleConfirmRequestOnClick}
                                />
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
