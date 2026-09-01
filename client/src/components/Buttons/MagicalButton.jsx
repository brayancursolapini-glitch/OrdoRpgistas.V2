import "./MagicalButton.css";


export default function MagicalButton({

    children,
    onClick,
    type = "button",
    className = "",

}) {

    return (

        <button

            type={type}

            onClick={onClick}

            className={`
                magical-button
                ${className}
            `}

        >

            <span
                className="magical-button-content"
            >

                {children}

            </span>

        </button>

    );

}
