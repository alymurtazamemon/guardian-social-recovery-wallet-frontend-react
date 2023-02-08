import { Loading } from "@web3uikit/core";

interface LoadingIndicatorPropsTypes {
    text: string;
}

function LoadingIndicator({ text }: LoadingIndicatorPropsTypes): JSX.Element {
    return (
        <div className="my-8">
            <Loading
                direction="bottom"
                fontSize={16}
                size={12}
                spinnerColor="#0D72C4"
                spinnerType="wave"
                text={text}
            />
        </div>
    );
}

export default LoadingIndicator;
