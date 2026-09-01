import "./MagicalButton.css";

export default function MagicalButton({
    children,
    variant = "primary",
    className = "",
    ...props
}) {

    return (

        <button
            {...props}
            className={`magical-button magical-button-${variant} ${className}`}
        >

            <span>
                {children}
            </span>

        </button>

    );

}
