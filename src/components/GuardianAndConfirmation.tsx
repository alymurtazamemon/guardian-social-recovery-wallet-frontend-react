import { AiFillCheckCircle } from "react-icons/ai";
import { abi } from "../constants";
import { useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";

enum ParentComponent {
    OwnershipManager,
    FundsManager,
}

interface GuardianAndConfirmationPropsTypes {
    guardianContractAddress: string;
    guardianAddress: string;
    index: number;
    parent: ParentComponent;
    noOfConfirmations: number;
}

GuardianAndConfirmation.defaultProps = {
    noOfConfirmations: 0,
};

function GuardianAndConfirmation({
    guardianContractAddress,
    guardianAddress,
    index,
    parent,
    noOfConfirmations,
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

    const { runContractFunction: getIsOwnershipConfimedByGuardian } =
        useWeb3Contract({
            abi: abi,
            contractAddress: guardianContractAddress,
            functionName: "getIsOwnershipConfimedByGuardian",
            params: {
                guardian: guardianAddress,
            },
        });

    useEffect(() => {
        (async () => {
            const status = (
                parent == ParentComponent.FundsManager
                    ? await getGuardianConfirmationStatus()
                    : await getIsOwnershipConfimedByGuardian()
            ) as boolean;
            setStatus(status);
        })();
    }, [noOfConfirmations]);

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
