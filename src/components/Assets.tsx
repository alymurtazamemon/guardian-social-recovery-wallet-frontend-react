import { SiEthereum } from "react-icons/si";
import {
    BsFillArrowDownCircleFill,
    BsFillArrowUpRightCircleFill,
} from "react-icons/bs";

function Assets(): JSX.Element {
    return (
        <div className="flex flex-col justify-czenter items-center mt-8">
            <div className="border border-gray-400 w-fit p-2 rounded-full">
                <SiEthereum color="black" size={22} />
            </div>
            <h1 className="text-4xl font-medium text-black mt-6">
                9999.999 ETH
            </h1>
            <h2 className="mt-2 mb-4 text-lg">$16,540,491.77 USD</h2>
            <div className="flex mt-2">
                <button
                    className="flex flex-col items-center justify-center mx-4"
                    onClick={() => {
                        console.log("Deposit Clicked!");
                    }}
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
            </div>
        </div>
    );
}

export default Assets;
