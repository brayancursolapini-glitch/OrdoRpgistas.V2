import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";


const AudioContext = createContext(null);


const playlists = {

    dnd: {
        name: "D&D",
        tracks: [
            {
                id: "dnd-ambient",
                name: "Ambiente D&D",
                file: "audio/dnd-ambient.mp3",
            },
        ],
    },

    ordem: {
        name: "Ordem Paranormal",
        tracks: [
            {
                id: "ordem-ambient",
                name: "Ambiente Ordem Paranormal",
                file: "audio/ordem-ambient.mp3",
            },
        ],
    },

    fantasia: {
        name: "Fantasia",
        tracks: [],
    },

    natureza: {
        name: "Natureza",
        tracks: [],
    },

    taverna: {
        name: "Taverna",
        tracks: [],
    },

    combate: {
        name: "Combate",
        tracks: [],
    },

};


export function AudioProvider({ children }) {

    const audioRef = useRef(null);

    const themeRef = useRef(
        localStorage.getItem("ordo-rpgistas-theme") || "dnd"
    );


    const [muted, setMuted] = useState(() => {

        return (
            localStorage.getItem(
                "ordo-rpgistas-muted"
            ) === "true"
        );

    });


    const [volume, setVolume] = useState(() => {

        const saved =
            localStorage.getItem(
                "ordo-rpgistas-volume"
            );

        return saved !== null
            ? Number(saved)
            : 0.65;

    });


    const [theme, setTheme] = useState(() => {

        const saved =
            localStorage.getItem(
                "ordo-rpgistas-audio-theme"
            );

        if (
            saved === "dnd" ||
            saved === "ordem"
        ) {
            return saved;
        }

        return (
            localStorage.getItem(
                "ordo-rpgistas-theme"
            ) || "dnd"
        );

    });


    const [currentPlaylist, setCurrentPlaylist] =
        useState(() => {

            return (
                localStorage.getItem(
                    "ordo-rpgistas-playlist"
                ) || "dnd"
            );

        });


    const [currentTrack, setCurrentTrack] =
        useState(() => {

            return (
                localStorage.getItem(
                    "ordo-rpgistas-track"
                ) || "dnd-ambient"
            );

        });


    const currentPlaylistData =
        playlists[currentPlaylist] ||
        playlists.dnd;


    const tracks =
        currentPlaylistData.tracks;


    function getAudioSource(file) {

        return `${import.meta.env.BASE_URL}${file}`;

    }


    function findTrack(trackId) {

        for (
            const playlist of Object.values(playlists)
        ) {

            const found =
                playlist.tracks.find(
                    track =>
                        track.id === trackId
                );

            if (found) {
                return found;
            }

        }

        return null;

    }


    function loadAndPlayTrack(track) {

        const audio =
            audioRef.current;

        if (!audio || !track) {
            return;
        }


        const source =
            getAudioSource(track.file);


        console.log(
            "[ORDO AUDIO] Tentando tocar:",
            source
        );


        audio.pause();

        audio.currentTime = 0;

        audio.src = source;

        audio.volume = volume;

        audio.muted = muted;

        audio.load();


        const playPromise =
            audio.play();


        if (playPromise) {

            playPromise
                .then(() => {

                    console.log(
                        "[ORDO AUDIO] Áudio reproduzindo:",
                        source
                    );

                })
                .catch(error => {

                    console.error(
                        "[ORDO AUDIO] Não foi possível reproduzir:",
                        error
                    );

                });

        }

    }


    function playCurrent() {

        const track =
            findTrack(currentTrack);

        if (!track) {

            console.warn(
                "[ORDO AUDIO] Nenhuma faixa encontrada."
            );

            return;

        }

        loadAndPlayTrack(track);

    }


    function stopAudio() {

        const audio =
            audioRef.current;

        if (!audio) {
            return;
        }

        audio.pause();

        audio.currentTime = 0;

    }


    function selectPlaylist(playlistId) {

        const playlist =
            playlists[playlistId];

        if (!playlist) {
            return;
        }


        setCurrentPlaylist(
            playlistId
        );


        localStorage.setItem(
            "ordo-rpgistas-playlist",
            playlistId
        );


        if (
            playlist.tracks.length > 0
        ) {

            const firstTrack =
                playlist.tracks[0];


            setCurrentTrack(
                firstTrack.id
            );


            localStorage.setItem(
                "ordo-rpgistas-track",
                firstTrack.id
            );


            loadAndPlayTrack(
                firstTrack
            );

        } else {

            stopAudio();

        }

    }


    function selectTrack(trackId) {

        const track =
            findTrack(trackId);

        if (!track) {
            return;
        }


        setCurrentTrack(
            trackId
        );


        localStorage.setItem(
            "ordo-rpgistas-track",
            trackId
        );


        loadAndPlayTrack(
            track
        );

    }


    function toggleMute() {

        setMuted(current => {

            const next =
                !current;


            localStorage.setItem(
                "ordo-rpgistas-muted",
                String(next)
            );


            if (audioRef.current) {

                audioRef.current.muted =
                    next;

            }


            return next;

        });

    }


    function changeVolume(value) {

        const nextVolume =
            Math.max(
                0,
                Math.min(
                    1,
                    Number(value)
                )
            );


        setVolume(
            nextVolume
        );


        localStorage.setItem(
            "ordo-rpgistas-volume",
            String(nextVolume)
        );


        if (audioRef.current) {

            audioRef.current.volume =
                nextVolume;

        }

    }


    function setAudioTheme(nextTheme) {

        if (
            nextTheme !== "dnd" &&
            nextTheme !== "ordem"
        ) {
            return;
        }


        themeRef.current =
            nextTheme;


        setTheme(
            nextTheme
        );


        localStorage.setItem(
            "ordo-rpgistas-audio-theme",
            nextTheme
        );


        const playlist =
            playlists[nextTheme];


        if (
            !playlist ||
            playlist.tracks.length === 0
        ) {
            return;
        }


        const track =
            playlist.tracks[0];


        setCurrentPlaylist(
            nextTheme
        );


        setCurrentTrack(
            track.id
        );


        localStorage.setItem(
            "ordo-rpgistas-playlist",
            nextTheme
        );


        localStorage.setItem(
            "ordo-rpgistas-track",
            track.id
        );


        loadAndPlayTrack(
            track
        );

    }


    /*
    |--------------------------------------------------------------------------
    | ELEMENTO DE ÁUDIO
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const audio =
            new Audio();

        audio.loop = true;

        audio.preload = "auto";

        audio.volume =
            volume;

        audio.muted =
            muted;


        audio.addEventListener(
            "error",
            () => {

                console.error(
                    "[ORDO AUDIO] ERRO AO CARREGAR O ARQUIVO.",
                    audio.error
                );

                console.error(
                    "[ORDO AUDIO] URL:",
                    audio.src
                );

            }
        );


        audioRef.current =
            audio;


        return () => {

            audio.pause();

            audio.src = "";

            audioRef.current =
                null;

        };

    }, []);


    /*
    |--------------------------------------------------------------------------
    | VOLUME
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!audioRef.current) {
            return;
        }

        audioRef.current.volume =
            volume;

    }, [volume]);


    /*
    |--------------------------------------------------------------------------
    | MUTE
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!audioRef.current) {
            return;
        }

        audioRef.current.muted =
            muted;

    }, [muted]);


    /*
    |--------------------------------------------------------------------------
    | PRIMEIRA INTERAÇÃO
    |--------------------------------------------------------------------------
    |
    | O navegador normalmente bloqueia autoplay.
    | Assim que o usuário clicar/pressionar uma tecla,
    | tentamos iniciar o tema atual.
    |
    */

    useEffect(() => {

        let started = false;


        async function startAfterInteraction() {

            if (started) {
                return;
            }


            if (muted) {
                return;
            }


            const audio =
                audioRef.current;

            if (!audio) {
                return;
            }


            const playlist =
                playlists[
                    themeRef.current
                ];


            if (
                !playlist ||
                playlist.tracks.length === 0
            ) {
                return;
            }


            const track =
                playlist.tracks[0];


            started = true;


            try {

                if (
                    audio.src !==
                    getAudioSource(
                        track.file
                    )
                ) {

                    audio.src =
                        getAudioSource(
                            track.file
                        );

                    audio.load();

                }


                audio.volume =
                    volume;

                audio.muted =
                    false;


                await audio.play();


                console.log(
                    "[ORDO AUDIO] Iniciado após interação do usuário."
                );


                window.removeEventListener(
                    "pointerdown",
                    startAfterInteraction
                );

                window.removeEventListener(
                    "keydown",
                    startAfterInteraction
                );

            } catch (error) {

                started = false;


                console.error(
                    "[ORDO AUDIO] Falha no primeiro play:",
                    error
                );

            }

        }


        window.addEventListener(
            "pointerdown",
            startAfterInteraction,
            {
                passive: true,
                once: false,
            }
        );


        window.addEventListener(
            "keydown",
            startAfterInteraction,
            {
                passive: true,
                once: false,
            }
        );


        return () => {

            window.removeEventListener(
                "pointerdown",
                startAfterInteraction
            );

            window.removeEventListener(
                "keydown",
                startAfterInteraction
            );

        };

    }, [muted, volume]);


    /*
    |--------------------------------------------------------------------------
    | SINCRONIZA TEMA
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        themeRef.current =
            theme;

    }, [theme]);


    /*
    |--------------------------------------------------------------------------
    | PROVIDER
    |--------------------------------------------------------------------------
    */

    return (
        <AudioContext.Provider
            value={{

                muted,

                volume,

                theme,

                currentPlaylist,

                currentPlaylistData,

                currentTrack,

                playlists,

                tracks,

                toggleMute,

                changeVolume,

                selectPlaylist,

                selectTrack,

                stopAudio,

                playCurrent,

                setAudioTheme,

            }}
        >

            {children}

        </AudioContext.Provider>
    );

}


export function useAudio() {

    const context =
        useContext(
            AudioContext
        );


    if (!context) {

        throw new Error(
            "useAudio deve ser usado dentro de AudioProvider."
        );

    }


    return context;

}
