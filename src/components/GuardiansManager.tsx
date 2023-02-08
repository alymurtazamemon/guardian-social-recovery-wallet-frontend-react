import { Input, useNotification } from "@web3uikit/core";
import TextButton from "./TextButton";
import { abi } from "../constants";
import { useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { AiFillBell } from "react-icons/ai";
import { BigNumber, ContractTransaction } from "ethers";
import LoadingIndicator from "./LoadingIndicator";

interface GuardianManagerPropsTypes {
    chainId: string;
    guardianContractAddress: string;
}

enum NotificationType {
    warning,
    success,
    error,
}

function GuardiansManager({
    chainId,
    guardianContractAddress,
}: GuardianManagerPropsTypes): JSX.Element {
    const dispatch = useNotification();

    const [guardians, setGuardians] = useState<string[]>([]);
    const [guardian, setGuardian] = useState<string>();
    const [oldGuardian, setOldGuardian] = useState<string>();
    const [newGuardian, setNewGuardian] = useState<string>();
    const [removeGuardian, setRemoveGuardian] = useState<string>();
    const [lastGuardianAddTime, setLastGuardianAddTime] = useState<string>();
    const [lastGuardianChangeTime, setLastGuardianChangeTime] =
        useState<string>();
    const [lastGuardianRemovalTime, setLastGuardianRemovalTime] =
        useState<string>();
    let [loading, setLoading] = useState(false);

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

    const { runContractFunction: removeGuardianFunction } = useWeb3Contract({
        abi: abi,
        contractAddress: guardianContractAddress,
        functionName: "removeGuardian",
        params: {
            guardian: removeGuardian,
        },
    });

    const { runContractFunction: getLastGuardianAddTime } = useWeb3Contract({
        abi: abi,
        contractAddress: guardianContractAddress,
        functionName: "getLastGuardianAddTime",
        params: {},
    });

    const { runContractFunction: getLastGuardianChangeTime } = useWeb3Contract({
        abi: abi,
        contractAddress: guardianContractAddress,
        functionName: "getLastGuardianChangeTime",
        params: {},
    });

    const { runContractFunction: getLastGuardianRemovalTime } = useWeb3Contract(
        {
            abi: abi,
            contractAddress: guardianContractAddress,
            functionName: "getLastGuardianRemovalTime",
            params: {},
        }
    );

    useEffect(() => {
        (async () => {
            const guardians = (await getGuardians()) as string[];
            setGuardians(guardians);

            const addTimestamp = (await getLastGuardianAddTime()) as BigNumber;

            setLastGuardianAddTime(
                addTimestamp.toNumber() == 0
                    ? "Never Added"
                    : new Date(addTimestamp.toNumber() * 1000).toString()
            );

            const changeTimestamp =
                (await getLastGuardianChangeTime()) as BigNumber;
            setLastGuardianChangeTime(
                changeTimestamp.toNumber() == 0
                    ? "Never Changed"
                    : new Date(changeTimestamp.toNumber() * 1000).toString()
            );

            const removalTimestamp =
                (await getLastGuardianRemovalTime()) as BigNumber;
            setLastGuardianRemovalTime(
                removalTimestamp.toNumber() == 0
                    ? "Never Removed"
                    : new Date(removalTimestamp.toNumber() * 1000).toString()
            );
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
        setLoading(true);
        await tx.wait(1);

        const guardians = (await getGuardians()) as string[];
        const addTimestamp = (await getLastGuardianAddTime()) as BigNumber;

        // * add a waiting delay for hardhat network.
        if (chainId == "31337") {
            await timeout(5000);
        }
        setLoading(false);

        _showNotification(
            NotificationType.success,
            "Success",
            "New Guardian Added!"
        );

        setGuardians(guardians);
        setLastGuardianAddTime(
            addTimestamp.toNumber() == 0
                ? "Never Added"
                : new Date(addTimestamp.toNumber() * 1000).toString()
        );
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
        setLoading(true);
        await tx.wait(1);

        const guardians = (await getGuardians()) as string[];
        const changeTimestamp =
            (await getLastGuardianChangeTime()) as BigNumber;

        // * add a waiting delay for hardhat network.
        if (chainId == "31337") {
            await timeout(5000);
        }
        setLoading(false);

        _showNotification(
            NotificationType.success,
            "Success",
            `Guardian Changed from ${oldGuardian} to ${newGuardian}`
        );

        setGuardians(guardians);
        setLastGuardianChangeTime(
            changeTimestamp.toNumber() == 0
                ? "Never Changed"
                : new Date(changeTimestamp.toNumber() * 1000).toString()
        );
        setOldGuardian(undefined);
        setNewGuardian(undefined);
    }

    async function handleRemoveGuardianOnClick() {
        if (removeGuardian == undefined) {
            _showNotification(
                NotificationType.warning,
                "Address Not Found",
                "Please input the address of existing guardian."
            );
            return;
        }

        await removeGuardianFunction({
            onSuccess: (tx) =>
                handleRemoveGuardianOnSuccess(tx as ContractTransaction),
            onError: _handleAllErrors,
        });
    }

    async function handleRemoveGuardianOnSuccess(tx: ContractTransaction) {
        setLoading(true);
        await tx.wait(1);

        const guardians = (await getGuardians()) as string[];
        const removalTimestamp =
            (await getLastGuardianRemovalTime()) as BigNumber;

        // * add a waiting delay for hardhat network.
        if (chainId == "31337") {
            await timeout(5000);
        }
        setLoading(false);

        _showNotification(
            NotificationType.success,
            "Success",
            `Removed Guardian with Address ${removeGuardian}`
        );

        setGuardians(guardians);
        setLastGuardianRemovalTime(
            removalTimestamp.toNumber() == 0
                ? "Never Removed"
                : new Date(removalTimestamp.toNumber() * 1000).toString()
        );
        setRemoveGuardian(undefined);
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
                "Guardian Not Found",
                "The guardian does not exist in the guardians list. Please check the information and try again."
            );
        } else if (
            error.message.includes("Error__CanOnlyRemoveAfterDelayPeriod")
        ) {
            _showNotification(
                NotificationType.error,
                "Removal Not Allowed",
                "You can only remove after the delay period. Please wait until the delay period is over and try again."
            );
        } else if (error.message.includes("Error__GuardiansListIsEmpty")) {
            _showNotification(
                NotificationType.error,
                "Empty Guardians List",
                "The list of guardians is empty. Please add a guardian and try again."
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

    function timeout(delay: number) {
        return new Promise((res) => setTimeout(res, delay));
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
                {loading && <LoadingIndicator text="Transaction pending..." />}
            </div>
            <div className="mb-16">
                <h1 className="text-2xl text-black font-extrabold">
                    Information
                </h1>
                <p className="text-lg my-4">
                    Delay Required between Adding the Guardians: 1 Day
                </p>
                <p className="text-lg my-4">
                    Last Guardian Added on: {lastGuardianAddTime}
                </p>
                <p className="text-lg my-4">
                    Delay Required between Changing the Guardians: 1 Day
                </p>
                <p className="text-lg my-4">
                    Last Guardian Changed on: {lastGuardianChangeTime}
                </p>
                <p className="text-lg my-4">
                    Delay Required between Removing the Guardians: 3 Days
                </p>
                <p className="text-lg my-4">
                    Last Guardian Removed on: {lastGuardianRemovalTime}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    value={removeGuardian}
                    onChange={(event) => setRemoveGuardian(event.target.value)}
                />
                <TextButton
                    text="Remove Guardian"
                    onClick={handleRemoveGuardianOnClick}
                    disabled={loading}
                />
            </div>
        </div>
    );
}

export default GuardiansManager;
