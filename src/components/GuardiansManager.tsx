import { Input } from "@web3uikit/core";
import TextButton from "./TextButton";
import { abi } from "../constants";
import { useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";

interface GuardianManagerPropsTypes {
    guardianContractAddress: string;
}

function GuardiansManager({
    guardianContractAddress,
}: GuardianManagerPropsTypes): JSX.Element {
    const [guardians, setGuardians] = useState<string[]>([]);

    const { runContractFunction: getGuardians } = useWeb3Contract({
        abi: abi,
        contractAddress: guardianContractAddress,
        functionName: "getGuardians",
        params: {},
    });

    useEffect(() => {
        (async () => {
            const guardians = (await getGuardians()) as string[];
            setGuardians(guardians);
        })();
    }, []);

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
                />
                <TextButton text="Add Guardian" />

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
                    />
                </div>
                <TextButton text="Change Guardian" />

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
