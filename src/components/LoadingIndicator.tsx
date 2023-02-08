import { Loading } from "@web3uikit/core";

interface LoadingIndicatorPropsTypes {
    text: string;
}

function LoadingIndicator({ text }: LoadingIndicatorPropsTypes): JSX.Element {
    return (
        <Loading
            direction="bottom"
            fontSize={16}
            size={12}
            spinnerColor="#35aee2"
            spinnerType="wave"
            text={text}
        />
    );
}

export default LoadingIndicator;
