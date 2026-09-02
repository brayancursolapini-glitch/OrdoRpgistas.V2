import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Leaf,
} from "lucide-react";

import {
    useTheme,
} from "../../context/ThemeContext";

import "./ThemeParticles.css";


function createParticles(
    amount
) {

    return Array
        .from({
            length: amount,
        })
        .map((
            _,
            index
        ) => {

            const seed =
                (
                    Math.sin(
                        index * 999
                    ) *
                    10000
                ) % 1;


            const random =
                value => {

                    const number =
                        Math.sin(
                            index *
                            100 +
                            value *
                            77
                        ) *
                        10000;

                    return (
                        number -
                        Math.floor(
                            number
                        )
                    );

                };


            return {

                id:
                    `${index}-${seed}`,

                left:
                    random(1) * 100,

                top:
                    random(2) * 100,

                size:
                    14 +
                    random(3) *
                    16,

                duration:
                    8 +
                    random(4) *
                    10,

                delay:
                    -random(5) *
                    18,

                drift:
                    (
                        random(6) -
                        0.5
                    ) *
                    140,

                rotation:
                    random(7) *
                    360,

            };

        });

}


export default function ThemeParticles() {

    const {
        theme,
    } = useTheme();


    const [
        pointer,
        setPointer,
    ] = useState({
        x: -1000,
        y: -1000,
    });


    const particles =
        useMemo(
            () =>
                createParticles(
                    theme === "dnd"
                        ? 28
                        : 38
                ),
            [
                theme,
            ]
        );


    useEffect(() => {

        if (
            theme !== "dnd"
        ) {

            setPointer({
                x: -1000,
                y: -1000,
            });

            return;

        }


        let frame =
            null;


        function handlePointerMove(
            event
        ) {

            if (frame) {

                cancelAnimationFrame(
                    frame
                );

            }


            frame =
                requestAnimationFrame(
                    () => {

                        setPointer({
                            x:
                                event.clientX,
                            y:
                                event.clientY,
                        });

                    }
                );

        }


        window.addEventListener(
            "pointermove",
            handlePointerMove
        );


        return () => {

            window.removeEventListener(
                "pointermove",
                handlePointerMove
            );


            if (frame) {

                cancelAnimationFrame(
                    frame
                );

            }

        };

    }, [
        theme,
    ]);


    if (
        theme === "dnd"
    ) {

        return (

            <div
                className="theme-particles theme-particles-dnd"
                aria-hidden="true"
            >

                {particles.map(
                    particle => {

                        const viewportWidth =
                            typeof window !==
                            "undefined"
                                ? window.innerWidth
                                : 1920;


                        const viewportHeight =
                            typeof window !==
                            "undefined"
                                ? window.innerHeight
                                : 1080;


                        const particleX =
                            (
                                particle.left /
                                100
                            ) *
                            viewportWidth;


                        const particleY =
                            (
                                particle.top /
                                100
                            ) *
                            viewportHeight;


                        const distanceX =
                            pointer.x -
                            particleX;


                        const distanceY =
                            pointer.y -
                            particleY;


                        const distance =
                            Math.sqrt(
                                (
                                    distanceX *
                                    distanceX
                                ) +
                                (
                                    distanceY *
                                    distanceY
                                )
                            );


                        const radius =
                            180;


                        const strength =
                            Math.max(
                                0,
                                1 -
                                distance /
                                radius
                            );


                        const safeDistance =
                            distance || 1;


                        const windX =
                            (
                                -distanceX /
                                safeDistance
                            ) *
                            strength *
                            34;


                        const windY =
                            (
                                -distanceY /
                                safeDistance
                            ) *
                            strength *
                            18;


                        return (

                            <div
                                key={
                                    particle.id
                                }
                                className="leaf-particle-wrapper"
                                style={{
                                    left:
                                        `${particle.left}%`,

                                    top:
                                        `${particle.top}%`,

                                    animationDuration:
                                        `${particle.duration}s`,

                                    animationDelay:
                                        `${particle.delay}s`,

                                    "--drift":
                                        `${particle.drift}px`,
                                }}
                            >

                                <div
                                    className="leaf-particle-wind"
                                    style={{
                                        "--wind-x":
                                            `${windX}px`,

                                        "--wind-y":
                                            `${windY}px`,

                                        "--rotation":
                                            `${particle.rotation}deg`,
                                    }}
                                >

                                    <Leaf
                                        size={
                                            particle.size
                                        }
                                    />

                                </div>

                            </div>

                        );

                    }
                )}

            </div>

        );

    }


    return (

        <div
            className="theme-particles theme-particles-ordem"
            aria-hidden="true"
        >

            {particles.map(
                particle => (

                    <span
                        key={
                            particle.id
                        }
                        className="ordem-particle"
                        style={{
                            left:
                                `${particle.left}%`,

                            width:
                                `${Math.max(
                                    2,
                                    particle.size / 7
                                )}px`,

                            height:
                                `${Math.max(
                                    2,
                                    particle.size / 7
                                )}px`,

                            animationDuration:
                                `${particle.duration}s`,

                            animationDelay:
                                `${particle.delay}s`,

                            "--drift":
                                `${particle.drift}px`,
                        }}
                    />

                )
            )}

        </div>

    );

}
