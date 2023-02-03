import { ConnectButton } from "@web3uikit/web3";

function Header(): JSX.Element {
    return (
        <div className="flex items-center">
            <h1 className="text-4xl  mr-4">👼</h1>
            <h1 className="tracking-widest my-8 text-xl font-bold pt-1 mr-auto">
                GUARDIANS
            </h1>
            <ConnectButton />
        </div>
    );
}

export default Header;
