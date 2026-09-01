import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Volume2,
    VolumeX,
} from "lucide-react";

import {
    useTheme,
} from "../../context/ThemeContext";

import "./AmbientAudio.css";


export default function AmbientAudio() {

    const {
        theme,
    } = useTheme();

    const audioRef =
        useRef(null);

    const [
        muted,
        setMuted,
    ] = useState(true);


    const source =
        theme === "dnd"
            ? `${import.meta.env.BASE_URL}assets/dnd-ambient.mp3`
            : `${import.meta.env.BASE_URL}assets/ordem-ambient.mp3`;


    useEffect(() => {

        const audio =
            audioRef.current;

        if (!audio) {
            return;
        }

        audio.volume = 0.35;
        audio.load();

        if (!muted) {

            audio.play()
                .catch(() => {
                    setMuted(true);
                });

        }

    }, [
        source,
        muted,
    ]);


    function toggleAudio() {

        const audio =
            audioRef.current;

        if (!audio) {
            return;
        }

        if (muted) {

            audio.play()
                .then(() => {
                    setMuted(false);
                })
                .catch(() => {
                    // O navegador exige interação do usuário.
                });

        } else {

            audio.pause();

            setMuted(true);

        }

    }


    return (

        <div className="ambient-audio">

            <audio
                ref={audioRef}
                loop
                src={source}
            />

            <button
                type="button"
                onClick={toggleAudio}
                aria-label="Ativar ou desativar música ambiente"
            >

                {muted
                    ? <VolumeX size={18} />
                    : <Volume2 size={18} />
                }

            </button>

        </div>

    );

}
