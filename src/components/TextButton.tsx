interface TextButtonPropsType {
    text: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    disabled: boolean | undefined;
}

TextButton.defaultProps = {
    onClick: () => {},
    disabled: undefined,
};

function TextButton({
    text,
    onClick,
    disabled,
}: TextButtonPropsType): JSX.Element {
    return (
        <button
            className="text-md text-white font-extrabold bg-[#0D72C4] p-4 rounded-full mt-6"
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
}

export default TextButton;
