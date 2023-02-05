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
            dispatch({
                type: "warning",
                title: "Amount Not Found",
                message: "Please enter deposit amount in the amount field.",
                icon: <AiFillBell />,
                position: "topR",
            });
            return;
        }

        if (typeof ethereum != "undefined") {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();

            const tx: ContractTransaction = await signer.sendTransaction({
                to: guardianContractAddress,
                data: "0x",
                value: ethers.utils.parseEther(amount.toString()),
            });

            await tx.wait(1);

            dispatch({
                type: "success",
                title: "Successs",
                message: `${amount} successfully deposited.`,
                icon: <AiFillBell />,
                position: "topR",
            });

            setAmount(undefined);
        }
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
