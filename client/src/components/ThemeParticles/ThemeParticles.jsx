import {
    useMemo,
} from "react";

import {
    useTheme,
} from "../../context/ThemeContext";

import "./ThemeParticles.css";


export default function ThemeParticles({

    amount = 35,

    variant,

}) {

    const {
        theme,
    } = useTheme();


    const currentVariant =
        variant ||
        theme;


    const particles =
        useMemo(() => {

            return Array
                .from(
                    {
                        length:
                            amount,
                    },
                    (
                        _,
                        index
                    ) => ({

                        id:
                            index,

                        left:
                            `${Math.random() * 100}%`,

                        top:
                            `${Math.random() * 100}%`,

                        delay:
                            `${Math.random() * -10}s`,

                        duration:
                            `${8 + Math.random() * 12}s`,

                        size:
                            `${2 + Math.random() * 5}px`,

                    })
                );

        }, [
            amount,
        ]);


    return (

        <div

            className={`
                theme-particles
                theme-particles-${currentVariant}
            `}

            aria-hidden="true"

        >

            {

                particles.map(
                    particle => (

                        <span

                            key={
                                particle.id
                            }

                            style={{
                                left:
                                    particle.left,

                                top:
                                    particle.top,

                                animationDelay:
                                    particle.delay,

                                animationDuration:
                                    particle.duration,

                                width:
                                    particle.size,

                                height:
                                    particle.size,
                            }}

                        />

                    )
                )

            }

        </div>

    );

}
