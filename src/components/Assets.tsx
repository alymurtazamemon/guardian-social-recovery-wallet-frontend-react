import { SiEthereum } from "react-icons/si";

function Assets(): JSX.Element {
    return (
        <div className="border flex flex-col justify-czenter items-center">
            <div className="border border-gray-400 w-fit p-3 rounded-full">
                <SiEthereum color="black" size={22} />
            </div>
        </div>
    );
}

export default Assets;
