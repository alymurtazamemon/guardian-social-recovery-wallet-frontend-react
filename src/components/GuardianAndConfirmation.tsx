import { AiFillCheckCircle } from "react-icons/ai";
import { abi } from "../constants";
import { useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";

interface GuardianAndConfirmationPropsTypes {
    guardianContractAddress: string;
    guardianAddress: string;
    index: number;
}

function GuardianAndConfirmation({
    guardianContractAddress,
    guardianAddress,
    index,
}: GuardianAndConfirmationPropsTypes): JSX.Element {
    const [status, setStatus] = useState<boolean>(false);

    const { runContractFunction: getGuardianConfirmationStatus } =
        useWeb3Contract({
            abi: abi,
            contractAddress: guardianContractAddress,
            functionName: "getGuardianConfirmationStatus",
            params: {
                guardian: guardianAddress,
            },
        });

    useEffect(() => {
        (async () => {
            const status = (await getGuardianConfirmationStatus()) as boolean;
            setStatus(status);
        })();
    }, []);

    return (
        <div key={index} className="flex items-center mt-4">
            <li className="mr-4">
                {index + 1}. {guardianAddress}
            </li>
            {status && <AiFillCheckCircle color="green" size={30} />}
        </div>
    );
}

export default GuardianAndConfirmation;
