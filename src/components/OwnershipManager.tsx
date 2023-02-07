import { Input } from "@web3uikit/core";
import TextButton from "./TextButton";
import GuardianAndConfirmation from "./GuardianAndConfirmation";
import { abi } from "../constants";
import { useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { BigNumber } from "ethers";

interface OwnershipManagerPropsTypes {
    guardianContractAddress: string;
}

function OwnershipManager({
    guardianContractAddress,
}: OwnershipManagerPropsTypes): JSX.Element {
    const [owner, setOwner] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [ownerUpdateRequestTime, setOwnerUpdateRequestTime] =
        useState<string>("0");

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
        })();
    }, []);

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
                <TextButton text="Request To Update Owner" />
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
                    <span className="text-[#008001] font-bold">Inactive</span>
                </p>
                <p className="text-lg my-4">
                    Owner Update Confirmation Time Left:{" "}
                    {"01:01:2023 6:17:00 PM"}
                </p>
                <p className="text-lg my-4">
                    No of Confirmed Confirmations: {3}
                </p>
                <h2 className="text-xl text-black font-bold my-4">
                    Confirmed By:
                </h2>
                <ol>
                    {/* <GuardianAndConfirmation />
                    <GuardianAndConfirmation />
                    <GuardianAndConfirmation /> */}
                </ol>
            </div>
            <div className="flex flex-col items-center mt-4">
                <TextButton text="Confirm Owner Update Request" />
            </div>
        </div>
    );
}

export default OwnershipManager;
