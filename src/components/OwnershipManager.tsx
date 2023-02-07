import { Input, useNotification } from "@web3uikit/core";
import TextButton from "./TextButton";
import GuardianAndConfirmation from "./GuardianAndConfirmation";
import { abi } from "../constants";
import { useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { BigNumber, ContractTransaction } from "ethers";
import { AiFillBell } from "react-icons/ai";

interface OwnershipManagerPropsTypes {
    guardianContractAddress: string;
}

enum NotificationType {
    warning,
    success,
    error,
    info,
}

enum ParentComponent {
    OwnershipManager,
    FundsManager,
}

function OwnershipManager({
    guardianContractAddress,
}: OwnershipManagerPropsTypes): JSX.Element {
    const dispatch = useNotification();

    const [owner, setOwner] = useState<string>("");
    const [address, setAddress] = useState<string>();
    const [ownerUpdateRequestTime, setOwnerUpdateRequestTime] =
        useState<string>("0");
    const [ownerUpdateRequestStatus, setOwnerUpdateRequestStatus] =
        useState<boolean>(false);
    const [requiredConfirmations, setRequiredConfirmations] =
        useState<number>();
    const [confirmationTime, setConfirmationTime] = useState<string>("0");
    const [guardians, setGuardians] = useState<string[]>([]);

    const { runContractFunction: getOwner } = useWeb3Contract({
        abi: abi,
        contractAddress: guardianContractAddress,
        functionName: "owner",
        params: {},
    });

    const { runContractFunction: getLastOwnerUpdateRequestTime } =
        useWeb3Contract({
            abi: abi,
            contractAddress: guardianContractAddress,
            functionName: "getLastOwnerUpdateRequestTime",
            params: {},
        });

    const { runContractFunction: getIsOwnerUpdateRequested } = useWeb3Contract({
        abi: abi,
        contractAddress: guardianContractAddress,
        functionName: "getIsOwnerUpdateRequested",
        params: {},
    });

    const { runContractFunction: getNoOfConfirmations } = useWeb3Contract({
        abi: abi,
        contractAddress: guardianContractAddress,
        functionName: "getNoOfConfirmations",
        params: {},
    });

    const { runContractFunction: getOwnerUpdateConfirmationTime } =
        useWeb3Contract({
            abi: abi,
            contractAddress: guardianContractAddress,
            functionName: "getOwnerUpdateConfirmationTime",
            params: {},
        });

    const { runContractFunction: requestToUpdateOwner } = useWeb3Contract({
        abi: abi,
        contractAddress: guardianContractAddress,
        functionName: "requestToUpdateOwner",
        params: {
            newOwnerAddress: address,
        },
    });

    const { runContractFunction: getGuardians } = useWeb3Contract({
        abi: abi,
        contractAddress: guardianContractAddress,
        functionName: "getGuardians",
        params: {},
    });

    useEffect(() => {
        (async () => {
            const owner = (await getOwner()) as string;
            setOwner(owner);

            const requestTime =
                (await getLastOwnerUpdateRequestTime()) as BigNumber;
            setOwnerUpdateRequestTime(
                requestTime.toNumber() == 0
                    ? "Never Requested"
                    : new Date(requestTime.toNumber() * 1000).toString()
            );

            const requestStatus =
                (await getIsOwnerUpdateRequested()) as boolean;
            setOwnerUpdateRequestStatus(requestStatus);

            const requiredConfirmations =
                (await getNoOfConfirmations()) as BigNumber;
            setRequiredConfirmations(requiredConfirmations.toNumber());

            const confirmationTime =
                (await getOwnerUpdateConfirmationTime()) as BigNumber;

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

    async function handleUpdateOwnerRequestOnClick() {
        if (address == undefined) {
            _showNotification(
                NotificationType.warning,
                "Amount Not Found",
                "Please input the new address in the address field."
            );
            return;
        }

        await requestToUpdateOwner({
            onSuccess: (tx) =>
                handleUpdateOwnerRequestOnSuccess(tx as ContractTransaction),
            onError: _handleAllErrors,
        });
    }

    async function handleUpdateOwnerRequestOnSuccess(tx: ContractTransaction) {
        await tx.wait(1);

        _showNotification(
            NotificationType.info,
            "Requested",
            `Owner Requested to Update to ${address}.`
        );

        setAddress(undefined);
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
        } else if (error.message.includes("Error__RequestTimeExpired")) {
            _showNotification(
                NotificationType.error,
                "Request Time Expired",
                "The time for the request has expired. Please submit a new request to continue."
            );
        } else if (
            error.message.includes("Error__AlreadyConfirmedByGuardian")
        ) {
            _showNotification(
                NotificationType.error,
                "Already Confirmed by Guardian",
                "The request has already been confirmed by the guardian. No further action is required."
            );
        } else if (error.message.includes("Error__UpdateNotRequested")) {
            _showNotification(
                NotificationType.error,
                "Update Not Requested",
                "No update has been requested. Please submit a request for update and try again."
            );
        } else if (error.message.includes("Error__AddressNotFoundAsGuardian")) {
            _showNotification(
                NotificationType.error,
                "Guardian Not Found",
                "The address provided was not found in the guardians list."
            );
        } else if (error.message.includes("Error__AddressAlreadyAnOwner")) {
            _showNotification(
                NotificationType.error,
                "Address Already an Owner",
                "The provided address is already an owner."
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
                    Current Wallet Owner
                </h1>
                <h3 className="mt-6 mb-16 text-lg">
                    {owner.slice(0, 6)}...
                    {owner.slice(owner.length - 6, owner.length)}
                </h3>

                {!ownerUpdateRequestStatus && (
                    <Input
                        label="New Address"
                        placeholder="Enter new owner address"
                        type="text"
                        validation={{
                            characterMinLength: 42,
                            characterMaxLength: 42,
                        }}
                        width="80%"
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                    />
                )}
                {!ownerUpdateRequestStatus && (
                    <TextButton
                        text="Request To Update Owner"
                        onClick={handleUpdateOwnerRequestOnClick}
                    />
                )}
            </div>
            <div className="mt-8">
                <h1 className="text-2xl text-black font-extrabold">
                    Information
                </h1>
                <p className="text-lg my-4">
                    Last Owner Update Request Time: {ownerUpdateRequestTime}
                </p>
                <p className="text-lg my-4">
                    Current Request Status:{" "}
                    <span
                        className={`${
                            ownerUpdateRequestStatus
                                ? "text-[#008001]"
                                : "text-[#0D72C4]"
                        } font-bold`}
                    >
                        {ownerUpdateRequestStatus ? "Active" : "Inactive"}
                    </span>
                </p>
                {ownerUpdateRequestStatus && (
                    <div>
                        <p className="text-lg my-4">
                            Confirmation Till: {confirmationTime}
                        </p>
                        <p className="text-lg my-4">
                            No of Confirmed Confirmations:{" "}
                            {requiredConfirmations}
                        </p>
                        <h2 className="text-xl text-black font-bold my-4">
                            Confirmed By:
                        </h2>
                        <ol>
                            {guardians.map((guardian, index) => {
                                return (
                                    <GuardianAndConfirmation
                                        parent={
                                            ParentComponent.OwnershipManager
                                        }
                                        index={index}
                                        guardianContractAddress={
                                            guardianContractAddress
                                        }
                                        guardianAddress={guardian}
                                    />
                                );
                            })}
                        </ol>
                        <div className="flex flex-col items-center mt-4">
                            <TextButton text="Confirm Owner Update Request" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OwnershipManager;
