import {
    // contractAddresses,
    guardianFactoryAbi,
    guardianFactoryContractAddresses,
} from "../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import TextButton from "./TextButton";
import { ContractTransaction } from "ethers";
import { AiFillBell } from "react-icons/ai";
import { Input, useNotification } from "@web3uikit/core";
import TabsList from "./TabsList";
import LoadingIndicator from "./LoadingIndicator";

interface contractsAddressesInterface {
    [key: string]: string[];
}

enum NotificationType {
    warning,
    success,
    error,
}

function Main(): JSX.Element {
    const dispatch = useNotification();

    // const addresses: contractsAddressesInterface = contractAddresses;
    const guardianFactoryAddresses: contractsAddressesInterface =
        guardianFactoryContractAddresses;

    const { chainId: chainIdHex, account } = useMoralis();
    const chainId: string = parseInt(chainIdHex!).toString();
    // const guardianContractAddress =
    //     chainId in addresses ? addresses[chainId][0] : null;
    const guardianFactoryContractAddress =
        chainId in guardianFactoryAddresses
            ? guardianFactoryAddresses[chainId][0]
            : null;

    const [isOwner, setIsOwner] = useState<boolean>();
    const [isGuardian, setIsGuardian] = useState<boolean>();
    const [isGuardianConfirmed, setIsGuardianConfirmed] = useState<boolean>();
    const [showPopUp, setShowPopUp] = useState<boolean>(false);
    const [walletContractAddress, setWalletContractAddress] =
        useState<string>();
    const [ownerAddress, setOwnerAddress] = useState<string>();
    let [loading, setLoading] = useState(false);

    const { runContractFunction: getWallet } = useWeb3Contract({
        abi: guardianFactoryAbi,
        contractAddress: guardianFactoryContractAddress!,
        functionName: "getWallet",
        params: {},
    });

    const { runContractFunction: createWallet } = useWeb3Contract({
        abi: guardianFactoryAbi,
        contractAddress: guardianFactoryContractAddress!,
        functionName: "createWallet",
        params: {},
    });

    const { runContractFunction: getContractAddressByGuardian } =
        useWeb3Contract({
            abi: guardianFactoryAbi,
            contractAddress: guardianFactoryContractAddress!,
            functionName: "getContractAddressByGuardian",
            params: {
                ownerAddress: ownerAddress,
            },
        });

    useEffect(() => {
        setIsOwner(undefined);
        setIsGuardian(undefined);
        setIsGuardianConfirmed(undefined);
        setShowPopUp(false);
    }, [account]);

    async function handleOwnerOnClick() {
        const walletAddress = (await getWallet()) as string;

        if (walletAddress == "0x0000000000000000000000000000000000000000") {
            setShowPopUp(true);
        } else {
            setWalletContractAddress(walletAddress);
            setIsOwner(true);
        }
    }

    async function handleYesOnClick() {
        await createWallet({
            onSuccess: (tx) =>
                handleCreateWalletOnSuccess(tx as ContractTransaction),
            onError: _handleAllErrors,
        });
    }

    async function handleCreateWalletOnSuccess(tx: ContractTransaction) {
        setLoading(true);

        await tx.wait(1);

        // * add a waiting delay for hardhat network.
        if (chainId == "31337") {
            await timeout(5000);
        }

        const walletAddress = (await getWallet()) as string;

        setLoading(false);

        _showNotification(
            NotificationType.success,
            "Successs",
            `Your New Guardian Wallet is Created`
        );

        setWalletContractAddress(walletAddress);
        setShowPopUp(false);
        setIsOwner(true);
    }

    function handleNoOnClick() {
        setShowPopUp(false);
    }

    function handleGuardianOnClick() {
        setIsGuardian(true);
    }

    async function handleConfirmGuardian() {
        try {
            const contractAddress: string = (await getContractAddressByGuardian(
                { throwOnError: true }
            )) as string;

            setIsOwner(false);
            setIsGuardianConfirmed(true);
            setWalletContractAddress(contractAddress);
            setOwnerAddress(undefined);
        } catch (error: any) {
            _handleAllErrors(error);
        }
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
            error.message.includes("GuardianFactory__OwnerContractNotFound")
        ) {
            _showNotification(
                NotificationType.error,
                "Owner Contract Not Found",
                "The owner contract was not found. Please check the information and try again."
            );
        } else if (
            error.message.includes("GuardianFactory__AddressNotFoundAsGuardian")
        ) {
            _showNotification(
                NotificationType.error,
                "Guardian Not Found",
                "The address provided was not found in the guardians list."
            );
        } else if (
            error.message.includes("GuardianFactory__WalletAlreadyExist")
        ) {
            _showNotification(
                NotificationType.error,
                "Wallet Already Exists",
                "The wallet already exists. Please check the information and try again"
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
            {isGuardian && !isGuardianConfirmed ? (
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold">
                        Confirmation Required
                    </h1>
                    <Input
                        label="Owner Address"
                        placeholder="Enter wallet owner address."
                        type="text"
                        validation={{
                            characterMinLength: 42,
                            characterMaxLength: 42,
                        }}
                        width="80%"
                        style={{
                            marginTop: "32px",
                        }}
                        value={ownerAddress}
                        onChange={(event) =>
                            setOwnerAddress(event.target.value)
                        }
                    />
                    <TextButton
                        text="Confirm Owner Address"
                        onClick={handleConfirmGuardian}
                    />
                </div>
            ) : showPopUp ? (
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold">
                        You do not have Wallet. Do you want to create?
                    </h1>
                    <div className="flex">
                        <TextButton
                            text="Yes Create"
                            onClick={handleYesOnClick}
                            disabled={loading}
                        />
                        <div className="mx-4"></div>
                        <TextButton
                            text="No Do not Create"
                            onClick={handleNoOnClick}
                            disabled={loading}
                        />
                    </div>
                    {loading && (
                        <LoadingIndicator text="Transaction pending..." />
                    )}
                </div>
            ) : isOwner == undefined ? (
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold">
                        Please Select the Option Based on Your Role.
                    </h1>
                    <div className="flex">
                        <TextButton
                            text="Proceed As Owner"
                            onClick={handleOwnerOnClick}
                        />
                        <div className="mx-4"></div>
                        <TextButton
                            text="Proceed as Guardian"
                            onClick={handleGuardianOnClick}
                        />
                    </div>
                </div>
            ) : (
                <TabsList walletContractAddress={walletContractAddress!} />
            )}
        </div>
    );
}

export default Main;
