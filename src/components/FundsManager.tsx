import { AiFillCheckCircle } from "react-icons/ai";
import { Input } from "@web3uikit/core";
import TextButton from "./TextButton";

function FundsManager(): JSX.Element {
    return (
        <div>
            <div className="flex flex-col justify-czenter items-center mt-8">
                <h1 className="text-4xl font-bold text-black mt-6">
                    Daily Withdrawal Limit
                </h1>
                <h2 className="text-4xl font-medium text-black mt-6">1 ETH</h2>
                <h3 className="mt-2 mb-16 text-lg">$16,540,491.77 USD</h3>

                <Input
                    label="Amount"
                    placeholder="Enter Daily Limit Amount"
                    type="number"
                    validation={{
                        required: true,
                        numberMin: 1,
                    }}
                    width="80%"
                />
                <TextButton text="Request To Update Limit" />
            </div>
            <div className="mt-8">
                <h1 className="text-2xl text-black font-extrabold">
                    Information
                </h1>
                <p className="text-lg my-4">
                    Current Daily Transfer Limit: {1} ETH
                </p>
                <p className="text-lg my-4">
                    Last Daily Tranfer Update Request Time:{" "}
                    {"01:01:2023 6:17:00 PM"}
                </p>
                <p className="text-lg my-4">
                    Current Request Status:{" "}
                    <span className="text-[#008001] font-bold">Inactive</span>
                </p>
                <p className="text-lg my-4">
                    Dialy Tranfer Update Confirmation Time Left:{" "}
                    {"01:01:2023 6:17:00 PM"}
                </p>
                <h2 className="text-xl text-black font-bold my-4">
                    Confirmed By:
                </h2>
                <ol>
                    <GuardianAndConfirmation />
                    <GuardianAndConfirmation />
                    <GuardianAndConfirmation />
                </ol>
            </div>
        </div>
    );
}

function GuardianAndConfirmation(): JSX.Element {
    return (
        <div className="flex items-center mt-4">
            <li className="mr-4">
                1. 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
            </li>
            <AiFillCheckCircle color="green" size={30} />
        </div>
    );
}

export default FundsManager;
