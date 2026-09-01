import {
    useTheme,
} from "../../context/ThemeContext";

import "./ThemeParticles.css";


export default function ThemeParticles() {

    const {
        theme,
    } = useTheme();


    return (

        <div

            className={`
                theme-particles
                theme-particles-${theme}
            `}

            aria-hidden="true"

        >

            {Array.from({

                length:
                    28,

            }).map((_, index) => (

                <span

                    key={index}

                    style={{

                        left:
                            `${(index * 37) % 100}%`,

                        animationDelay:
                            `${(index % 9) * 0.6}s`,

                        animationDuration:
                            `${7 + (index % 6)}s`,

                    }}

                />

            ))}

        </div>

    );

}
