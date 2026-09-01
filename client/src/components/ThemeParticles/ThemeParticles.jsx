import {
    useMemo,
} from "react";

import {
    useTheme,
} from "../../context/ThemeContext";

import "./ThemeParticles.css";


export default function ThemeParticles({
    amount = 34,
}) {

    const {
        theme,
    } = useTheme();


    const particles =
        useMemo(() => {

            return Array.from(
                {
                    length: amount,
                },
                (_, index) => ({
                    id: index,
                    left: `${(index * 37) % 100}%`,
                    top: `${(index * 61) % 100}%`,
                    delay: `${(index % 11) * .45}s`,
                    duration: `${6 + (index % 6)}s`,
                    size: `${2 + (index % 4)}px`,
                })
            );

        }, [
            amount,
        ]);


    return (

        <div
            className={`theme-particles theme-particles-${theme}`}
            aria-hidden="true"
        >

            {particles.map(
                particle => (

                    <span
                        key={particle.id}
                        style={{
                            left: particle.left,
                            top: particle.top,
                            width: particle.size,
                            height: particle.size,
                            animationDelay: particle.delay,
                            animationDuration: particle.duration,
                        }}
                    />

                )
            )}

        </div>

    );

}
