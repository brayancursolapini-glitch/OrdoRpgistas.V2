import "./MagicalButton.css";


export default function MagicalButton({

    children,

    onClick,

    type = "button",

    className = "",

    disabled = false,

}) {

    return (

        <button

            type={
                type
            }

            disabled={
                disabled
            }

            onClick={
                onClick
            }

            className={`
                magical-button
                ${className}
            `}

        >

            <span
                className="magical-button-glow"
            />


            <span
                className="magical-button-content"
            >

                {children}

            </span>

        </button>

    );

}
