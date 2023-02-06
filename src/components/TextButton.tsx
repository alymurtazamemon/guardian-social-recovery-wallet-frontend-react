interface TextButtonPropsType {
    text: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

TextButton.defaultProps = {
    onClick: () => {},
};

function TextButton({ text, onClick }: TextButtonPropsType): JSX.Element {
    return (
        <button
            className="text-md text-white font-extrabold bg-[#0D72C4] p-4 rounded-full mt-6"
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default TextButton;
