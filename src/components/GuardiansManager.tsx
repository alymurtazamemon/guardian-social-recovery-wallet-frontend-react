import { Input, useNotification } from "@web3uikit/core";
import TextButton from "./TextButton";
import { abi } from "../constants";
import { useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { AiFillBell } from "react-icons/ai";
import { ContractTransaction } from "ethers";

interface GuardianManagerPropsTypes {
    guardianContractAddress: string;
}

enum NotificationType {
    warning,
    success,
    error,
}

function GuardiansManager({
    guardianContractAddress,
}: GuardianManagerPropsTypes): JSX.Element {
    const dispatch = useNotification();

    const [guardians, setGuardians] = useState<string[]>([]);
    const [guardian, setGuardian] = useState<string>();
    const [oldGuardian, setOldGuardian] = useState<string>();
    const [newGuardian, setNewGuardian] = useState<string>();

    const { runContractFunction: getGuardians } = useWeb3Contract({
        abi: abi,
        contractAddress: guardianContractAddress,
        functionName: "getGuardians",
        params: {},
    });

    const { runContractFunction: addGuardian } = useWeb3Contract({
        abi: abi,
        contractAddress: guardianContractAddress,
        functionName: "addGuardian",
        params: {
            guardian: guardian,
        },
    });

    const { runContractFunction: changeGuardian } = useWeb3Contract({
        abi: abi,
        contractAddress: guardianContractAddress,
        functionName: "changeGuardian",
        params: {
            from: oldGuardian,
            to: newGuardian,
        },
    });

    useEffect(() => {
        (async () => {
            const guardians = (await getGuardians()) as string[];
            setGuardians(guardians);
        })();
    }, []);

    async function handleAddGuardianClick() {
        if (guardian == undefined) {
            _showNotification(
                NotificationType.warning,
                "Address Not Found",
                "Please input the address of guardian."
            );
            return;
        }

        await addGuardian({
            onSuccess: (tx) =>
                handleAddGuardianOnSuccess(tx as ContractTransaction),
            onError: _handleAllErrors,
        });
    }

    async function handleAddGuardianOnSuccess(tx: ContractTransaction) {
        await tx.wait(1);

        const guardians = (await getGuardians()) as string[];

        _showNotification(
            NotificationType.success,
            "Success",
            "New Guardian Added!"
        );

        setGuardians(guardians);
        setGuardian(undefined);
    }

    async function handleChangeGuardianOnClick() {
        if (oldGuardian == undefined) {
            _showNotification(
                NotificationType.warning,
                "Address Not Found",
                "Please input the address of existing guardian."
            );
            return;
        }

        if (newGuardian == undefined) {
            _showNotification(
                NotificationType.warning,
                "Address Not Found",
                "Please input the address of new guardian."
            );
            return;
        }

        await changeGuardian({
            onSuccess: (tx) =>
                handleChangeGuardianOnSuccess(tx as ContractTransaction),
            onError: _handleAllErrors,
        });
    }

    async function handleChangeGuardianOnSuccess(tx: ContractTransaction) {
        await tx.wait(1);

        const guardians = (await getGuardians()) as string[];

        _showNotification(
            NotificationType.success,
            "Success",
            `Guardian Changed from ${oldGuardian} to ${newGuardian}`
        );

        setGuardians(guardians);
        setOldGuardian(undefined);
        setNewGuardian(undefined);
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
        } else if (
            error.message.includes("Error__CanOnlyAddAfterDelayPeriod")
        ) {
            _showNotification(
                NotificationType.error,
                "Guardian Addition Not Allowed",
                "You can only add a guardian after the delay period. Please wait until the delay period is over and try again."
            );
        } else if (
            error.message.includes("Error__CanOnlyChangeAfterDelayPeriod")
        ) {
            _showNotification(
                NotificationType.error,
                "Guardian Change Not Allowed",
                "You can only change a guardian after the delay period. Please wait until the delay period is over and try again."
            );
        } else if (error.message.includes("Error__GuardianDoesNotExist")) {
            _showNotification(
                NotificationType.error,
                "Guardian Guardian Not Found",
                "The guardian does not exist in the guardians list. Please check the information and try again."
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
                    Your Wallet Guardians
                </h1>
                <ol className="mt-4 mb-4">
                    {guardians.map((guardian, index) => {
                        return (
                            <li key={index} className="mt-4">
                                {index + 1}. {guardian}
                            </li>
                        );
                    })}
                </ol>
            </div>
            <div className="mb-16">
                <h1 className="text-2xl text-black font-extrabold">
                    Information
                </h1>
                <p className="text-lg my-4">
                    Delay Required between Adding the Guardians: {"01 Day"}
                </p>
                <p className="text-lg my-4">
                    Last Guardian Added on: {"01:01:2023 6:17:00 PM"}
                </p>
                <p className="text-lg my-4">
                    Delay Required between Changing the Guardians: {"01 Day"}
                </p>
                <p className="text-lg my-4">
                    Last Guardian Changed on: {"01:01:2023 6:17:00 PM"}
                </p>
                <p className="text-lg my-4">
                    Delay Required between Removing the Guardians: {"01 Day"}
                </p>
                <p className="text-lg my-4">
                    Last Guardian Removed on: {"01:01:2023 6:17:00 PM"}
                </p>
            </div>
            <div className="flex flex-col justify-czenter items-center mt-8">
                <Input
                    label="Add Guardian"
                    placeholder="Enter new guardian address"
                    type="text"
                    validation={{
                        characterMinLength: 42,
                        characterMaxLength: 42,
                    }}
                    width="80%"
                    value={guardian}
                    onChange={(event) => setGuardian(event.target.value)}
                />
                <TextButton
                    text="Add Guardian"
                    onClick={handleAddGuardianClick}
                />
                <div className="flex w-full px-20">
                    <Input
                        label="From"
                        placeholder="Enter existing guardian address"
                        type="text"
                        validation={{
                            characterMinLength: 42,
                            characterMaxLength: 42,
                        }}
                        width="50%"
                        style={{ marginTop: "64px", marginRight: "8px" }}
                        value={oldGuardian}
                        onChange={(event) => setOldGuardian(event.target.value)}
                    />
                    <Input
                        label="To"
                        placeholder="Enter new guardian address"
                        type="text"
                        validation={{
                            characterMinLength: 42,
                            characterMaxLength: 42,
                        }}
                        width="50%"
                        style={{ marginTop: "64px", marginLeft: "8px" }}
                        value={newGuardian}
                        onChange={(event) => setNewGuardian(event.target.value)}
                    />
                </div>
                <TextButton
                    text="Change Guardian"
                    onClick={handleChangeGuardianOnClick}
                />
                <Input
                    label="Remove Guardian"
                    placeholder="Enter existing guardian address"
                    type="text"
                    validation={{
                        characterMinLength: 42,
                        characterMaxLength: 42,
                    }}
                    width="80%"
                    style={{ marginTop: "64px" }}
                />
                <TextButton text="Remove Guardian" />
            </div>
        </div>
    );
}

export default GuardiansManager;
