interface TextButtonPropsType {
    text: string;
}

function TextButton({ text }: TextButtonPropsType): JSX.Element {
    return (
        <button
            className="text-md text-white font-extrabold bg-[#0D72C4] p-4 rounded-full mt-6"
            onClick={() => {
                console.log("Request Clicked!");
            }}
        >
            {text}
        </button>
    );
}

export default TextButton;
