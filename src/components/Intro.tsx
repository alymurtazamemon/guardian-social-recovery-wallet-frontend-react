import { ConnectButton } from "@web3uikit/web3";

function Intro(): JSX.Element {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-white">
            <h1 className="text-9xl">👼</h1>
            <h1 className="tracking-widest mt-8 mb-4 text-5xl font-extrabold pt-1">
                GUARDIANS
            </h1>
            <h2 className="mb-16 text-xl">
                Securely manage and recover your digital assets with the help of
                trusted contacts.
            </h2>
            <ConnectButton />
        </div>
    );
}

export default Intro;
