import { SiEthereum } from "react-icons/si";
import {
    BsFillArrowDownCircleFill,
    BsFillArrowUpRightCircleFill,
} from "react-icons/bs";
import { useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { abi } from "../constants";
import { Input, useNotification } from "@web3uikit/core";
import { AiFillBell } from "react-icons/ai";
import { ContractTransaction, ethers } from "ethers";

enum NotificationType {
    warning,
    success,
    error,
}

interface AssetsPropsTypes {
    guardianContractAddress: string;
}

const { ethereum } = window as any;

function Assets({ guardianContractAddress }: AssetsPropsTypes): JSX.Element {
    const dispatch = useNotification();

    const [walletBalance, setWalletBalance] = useState("0");
    const [walletBalanceInUSD, setWalletBalanceInUSD] = useState("0");
    const [amount, setAmount] = useState<number>();
    const [address, setAddress] = useState("");

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

    const { runContractFunction: send } = useWeb3Contract({
        abi: abi,
        contractAddress: guardianContractAddress,
        functionName: "send",
        params: {
            to: address,
            amount:
                amount != undefined
                    ? ethers.utils.parseEther(amount!.toString())
                    : "0",
        },
    });

    const { runContractFunction: sendAll } = useWeb3Contract({
        abi: abi,
        contractAddress: guardianContractAddress,
        functionName: "sendAll",
        params: {
            to: address,
        },
    });

    useEffect(() => {
        (async () => {
            const balance = (await getBalance()) as String;
            setWalletBalance(balance.toString());

            const balanceInUSD = (await getBalanceInUSD()) as String;
            setWalletBalanceInUSD(balanceInUSD.toString());
        })();
    }, []);

    async function handleOnDepositClick() {
        if (amount == undefined) {
            _showNotification(
                NotificationType.warning,
                "Amount Not Found",
                "Please input deposit amount in the amount field."
            );
            return;
        }

        if (typeof ethereum != "undefined") {
            try {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();

                const tx: ContractTransaction = await signer.sendTransaction({
                    to: guardianContractAddress,
                    data: "0x",
                    value: ethers.utils.parseEther(amount.toString()),
                });

                await tx.wait(1);

                const balance = (await getBalance()) as String;
                const balanceInUSD = (await getBalanceInUSD()) as String;

                _showNotification(
                    NotificationType.success,
                    "Successs",
                    `${amount} ETH successfully deposited.`
                );

                setWalletBalance(balance.toString());
                setWalletBalanceInUSD(balanceInUSD.toString());
                setAmount(undefined);
            } catch (error: any) {
                _handleAllErrors(error);
            }
        }
    }

    async function handleOnSendClick() {
        if (amount == undefined) {
            _showNotification(
                NotificationType.warning,
                "Amount Not Found",
                "Please input deposit amount in the amount field."
            );

            return;
        }

        if (address == "") {
            _showNotification(
                NotificationType.warning,
                "Address Not Found",
                "Please input the address of receiver."
            );
            return;
        }

        await send({
            onSuccess: (tx) => handleSendOnSuccess(tx as ContractTransaction),
            onError: _handleAllErrors,
        });
    }

    async function handleSendOnSuccess(tx: ContractTransaction) {
        await tx.wait(1);

        const balance = (await getBalance()) as String;
        const balanceInUSD = (await getBalanceInUSD()) as String;

        _showNotification(
            NotificationType.success,
            "Successs",
            `${amount} ETH sent to ${address}`
        );

        setWalletBalance(balance.toString());
        setWalletBalanceInUSD(balanceInUSD.toString());
        setAmount(undefined);
        setAddress("");
    }

    async function handleOnSendAllClick() {
        if (address == "") {
            _showNotification(
                NotificationType.warning,
                "Address Not Found",
                "Please input the address of receiver."
            );
            return;
        }

        await sendAll({
            onSuccess: (tx) =>
                handleSendAllOnSuccess(tx as ContractTransaction),
            onError: _handleAllErrors,
        });
    }

    async function handleSendAllOnSuccess(tx: ContractTransaction) {
        await tx.wait(1);

        _showNotification(
            NotificationType.success,
            "Successs",
            `${ethers.utils.formatEther(walletBalance)} ETH sent to ${address}`
        );

        setAmount(undefined);
        setAddress("");
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
        } else if (error.message.includes("Error__InvalidAmount")) {
            _showNotification(
                NotificationType.error,
                "Invalid Amount Error",
                "The amount entered is not valid. Please check and enter a valid amount."
            );
        } else if (error.message.includes("Ownable: caller is not the owner")) {
            _showNotification(
                NotificationType.error,
                "Access Denied",
                "The caller is not the owner and does not have permission to perform this action."
            );
        } else if (error.message.includes("Error__DailyTransferLimitExceed")) {
            _showNotification(
                NotificationType.error,
                "Daily Transfer Limit Exceeded",
                "The transfer amount exceeds your daily transfer limit. Please try a smaller amount or request to increase limit."
            );
        } else if (error.message.includes("Error__TransactionFailed")) {
            _showNotification(
                NotificationType.error,
                "Transaction Failed",
                "Your transaction was unsuccessful. Please try again later."
            );
        } else if (error.message.includes("Error__BalanceIsZero")) {
            _showNotification(
                NotificationType.error,
                "Insufficient Balance",
                "Your account balance is zero. Please add funds to your account and try again."
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
        <div className="flex flex-col justify-czenter items-center mt-8">
            <div className="border border-gray-400 w-fit p-2 rounded-full">
                <SiEthereum color="black" size={22} />
            </div>
            <h1 className="text-4xl font-medium text-black mt-6">
                {ethers.utils.formatEther(walletBalance)} ETH
            </h1>
            <h2 className="mt-2 mb-4 text-lg">
                ${ethers.utils.formatEther(walletBalanceInUSD)} USD
            </h2>
            <div className="flex mt-2">
                <button
                    className="flex flex-col items-center justify-center mx-4"
                    onClick={handleOnDepositClick}
                >
                    <BsFillArrowDownCircleFill color="#0D72C4" size={40} />
                    <h1 className="text-[#0D72C4] m-2">Deposit</h1>
                </button>
                <button
                    className="flex flex-col items-center justify-center mx-4"
                    onClick={handleOnSendClick}
                >
                    <BsFillArrowUpRightCircleFill color="#0D72C4" size={40} />
                    <h1 className="text-[#0D72C4] m-2">Send</h1>
                </button>
                <button
                    className="flex flex-col items-center justify-center mx-4"
                    onClick={handleOnSendAllClick}
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
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
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
                value={address}
                onChange={(event) => setAddress(event.target.value)}
            />
        </div>
    );
}

export default Assets;
