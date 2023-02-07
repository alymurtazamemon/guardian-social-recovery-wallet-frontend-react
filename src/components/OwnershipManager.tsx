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
    const [ownerUpdateRequestStatus, setOwnerUpdateRequestStatus] =
        useState<boolean>(false);
    const [requiredConfirmations, setRequiredConfirmations] =
        useState<number>();
    const [confirmationTime, setConfirmationTime] = useState<string>("0");

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
                            {/* <GuardianAndConfirmation />
                    <GuardianAndConfirmation />
                    <GuardianAndConfirmation /> */}
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
