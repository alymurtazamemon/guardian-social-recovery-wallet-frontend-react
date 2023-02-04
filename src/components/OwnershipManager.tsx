import { Input } from "@web3uikit/core";
import TextButton from "./TextButton";
import GuardianAndConfirmation from "./GuardianAndConfirmation";

function OwnershipManager(): JSX.Element {
    return (
        <div>
            <div className="flex flex-col justify-czenter items-center mt-8">
                <h1 className="text-4xl font-bold text-black mt-6">
                    Current Wallet Owner
                </h1>
                <h3 className="mt-6 mb-16 text-lg">
                    0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
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
                />
                <TextButton text="Request To Update Owner" />
            </div>
            <div className="mt-8">
                <h1 className="text-2xl text-black font-extrabold">
                    Information
                </h1>
                <p className="text-lg my-4">
                    Last Owner Update Request Time: {"01:01:2023 6:17:00 PM"}
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
                    <GuardianAndConfirmation />
                    <GuardianAndConfirmation />
                    <GuardianAndConfirmation />
                </ol>
            </div>
            <div className="flex flex-col items-center mt-4">
                <TextButton text="Confirm Owner Update Request" />
            </div>
        </div>
    );
}

export default OwnershipManager;
