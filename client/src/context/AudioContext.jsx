import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";


const AudioContext = createContext(null);


/*
|--------------------------------------------------------------------------
| PLAYLISTS
|--------------------------------------------------------------------------
*/

const DEFAULT_PLAYLISTS = {

    dnd: {
        id: "dnd",

        name: "D&D",

        description:
            "Músicas e ambientes para aventuras de fantasia.",

        tracks: [
            {
                id: "dnd-ambient-01",

                name: "D&D — Ambiente",

                file: "audio/dnd-ambient.mp3",
            },
        ],
    },


    ordem: {
        id: "ordem",

        name: "Ordem Paranormal",

        description:
            "Sons para investigações e situações paranormais.",

        tracks: [
            {
                id: "ordem-ambient-01",

                name: "Ordem — Ambiente",

                file: "audio/ordem-ambient.mp3",
            },
        ],
    },


    fantasia: {
        id: "fantasia",

        name: "Fantasia & Aventura",

        description:
            "Ambientes para mundos fantásticos.",

        tracks: [],
    },


    natureza: {
        id: "natureza",

        name: "Natureza",

        description:
            "Chuva, floresta, vento e outros ambientes.",

        tracks: [],
    },


    taverna: {
        id: "taverna",

        name: "Taverna",

        description:
            "Ambientes aconchegantes para sua mesa.",

        tracks: [],
    },


    combate: {
        id: "combate",

        name: "Combate",

        description:
            "Trilhas para batalhas e momentos intensos.",

        tracks: [],
    },

};


/*
|--------------------------------------------------------------------------
| LOCAL STORAGE
|--------------------------------------------------------------------------
*/

function getSavedValue(key, fallback) {

    try {

        const value =
            localStorage.getItem(key);

        if (value === null) {
            return fallback;
        }

        return JSON.parse(value);

    } catch {

        return fallback;

    }

}


/*
|--------------------------------------------------------------------------
| PROVIDER
|--------------------------------------------------------------------------
*/

export function AudioProvider({ children }) {

    const audioRef = useRef(null);

    const firstInteractionRef =
        useRef(false);


    /*
    |--------------------------------------------------------------------------
    | MUTE
    |--------------------------------------------------------------------------
    */

    const [muted, setMuted] = useState(() =>
        getSavedValue(
            "ordo-rpgistas-audio-muted",
            false
        )
    );


    /*
    |--------------------------------------------------------------------------
    | VOLUME
    |--------------------------------------------------------------------------
    */

    const [volume, setVolume] = useState(() =>
        getSavedValue(
            "ordo-rpgistas-audio-volume",
            0.45
        )
    );


    /*
    |--------------------------------------------------------------------------
    | PLAYLIST
    |--------------------------------------------------------------------------
    */

    const [currentPlaylist, setCurrentPlaylist] =
        useState(() =>
            getSavedValue(
                "ordo-rpgistas-audio-playlist",
                "dnd"
            )
        );


    /*
    |--------------------------------------------------------------------------
    | FAIXA
    |--------------------------------------------------------------------------
    */

    const [currentTrack, setCurrentTrack] =
        useState(() =>
            getSavedValue(
                "ordo-rpgistas-audio-track",
                null
            )
        );


    /*
    |--------------------------------------------------------------------------
    | TEMA
    |--------------------------------------------------------------------------
    */

    const [theme, setTheme] = useState(() =>
        getSavedValue(
            "ordo-rpgistas-audio-theme",
            "dnd"
        )
    );


    const playlists =
        DEFAULT_PLAYLISTS;


    const currentPlaylistData =
        playlists[currentPlaylist] ||
        playlists.dnd;


    const tracks =
        currentPlaylistData.tracks;


    /*
    |--------------------------------------------------------------------------
    | SALVAR CONFIGURAÇÕES
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        localStorage.setItem(
            "ordo-rpgistas-audio-muted",
            JSON.stringify(muted)
        );

    }, [muted]);


    useEffect(() => {

        localStorage.setItem(
            "ordo-rpgistas-audio-volume",
            JSON.stringify(volume)
        );

    }, [volume]);


    useEffect(() => {

        localStorage.setItem(
            "ordo-rpgistas-audio-playlist",
            JSON.stringify(currentPlaylist)
        );

    }, [currentPlaylist]);


    useEffect(() => {

        localStorage.setItem(
            "ordo-rpgistas-audio-track",
            JSON.stringify(currentTrack)
        );

    }, [currentTrack]);


    useEffect(() => {

        localStorage.setItem(
            "ordo-rpgistas-audio-theme",
            JSON.stringify(theme)
        );

    }, [theme]);


    /*
    |--------------------------------------------------------------------------
    | APLICAR VOLUME
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const audio =
            audioRef.current;

        if (!audio) {
            return;
        }

        audio.volume =
            muted
                ? 0
                : volume;

        audio.muted =
            muted;

    }, [
        muted,
        volume,
    ]);


    /*
    |--------------------------------------------------------------------------
    | PEGAR URL DO ÁUDIO
    |--------------------------------------------------------------------------
    */

    function getAudioSource(file) {

        return `${import.meta.env.BASE_URL}${file}`;

    }


    /*
    |--------------------------------------------------------------------------
    | CARREGAR E TOCAR
    |--------------------------------------------------------------------------
    */

    function loadAndPlayTrack(track) {

        const audio =
            audioRef.current;

        if (!audio || !track) {
            return;
        }


        const source =
            getAudioSource(track.file);


        /*
        | Pausa o áudio anterior
        */

        audio.pause();


        /*
        | Define novo arquivo
        */

        audio.src =
            source;


        /*
        | Configura volume
        */

        audio.volume =
            muted
                ? 0
                : volume;

        audio.muted =
            muted;


        /*
        | Reinicia
        */

        audio.currentTime = 0;


        /*
        | Carrega
        */

        audio.load();


        /*
        | Toca
        */

        const promise =
            audio.play();


        if (
            promise &&
            typeof promise.catch === "function"
        ) {

            promise.catch(error => {

                console.warn(
                    "Áudio bloqueado ou não encontrado:",
                    source,
                    error
                );

            });

        }

    }


    /*
    |--------------------------------------------------------------------------
    | MUTE
    |--------------------------------------------------------------------------
    */

    function toggleMute() {

        setMuted(current => !current);

    }


    /*
    |--------------------------------------------------------------------------
    | VOLUME
    |--------------------------------------------------------------------------
    */

    function changeVolume(value) {

        const newVolume =
            Number(value);

        if (Number.isNaN(newVolume)) {
            return;
        }


        const safeVolume =
            Math.min(
                1,
                Math.max(
                    0,
                    newVolume
                )
            );


        setVolume(
            safeVolume
        );


        if (
            safeVolume > 0 &&
            muted
        ) {

            setMuted(false);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | SELECIONAR PLAYLIST
    |--------------------------------------------------------------------------
    */

    function selectPlaylist(playlistId) {

        const playlist =
            playlists[playlistId];

        if (!playlist) {
            return;
        }


        setCurrentPlaylist(
            playlistId
        );


        if (
            playlist.tracks.length === 0
        ) {

            setCurrentTrack(null);

            stopAudio();

            return;
        }


        const firstTrack =
            playlist.tracks[0];


        setCurrentTrack(
            firstTrack.id
        );


        loadAndPlayTrack(
            firstTrack
        );

    }


    /*
    |--------------------------------------------------------------------------
    | SELECIONAR FAIXA
    |--------------------------------------------------------------------------
    */

    function selectTrack(trackId) {

        const track =
            tracks.find(
                item =>
                    item.id === trackId
            );


        if (!track) {
            return;
        }


        setCurrentTrack(
            track.id
        );


        loadAndPlayTrack(
            track
        );

    }


    /*
    |--------------------------------------------------------------------------
    | PARAR
    |--------------------------------------------------------------------------
    */

    function stopAudio() {

        const audio =
            audioRef.current;


        setCurrentTrack(null);


        if (!audio) {
            return;
        }


        audio.pause();

        audio.currentTime = 0;

    }


    /*
    |--------------------------------------------------------------------------
    | TOCAR ATUAL
    |--------------------------------------------------------------------------
    */

    function playCurrent() {

        const audio =
            audioRef.current;


        if (!audio) {
            return;
        }


        if (!currentTrack) {

            const playlist =
                playlists[currentPlaylist];


            const firstTrack =
                playlist?.tracks?.[0];


            if (firstTrack) {

                setCurrentTrack(
                    firstTrack.id
                );

                loadAndPlayTrack(
                    firstTrack
                );

            }

            return;
        }


        const promise =
            audio.play();


        if (
            promise &&
            typeof promise.catch === "function"
        ) {

            promise.catch(() => {});

        }

    }


    /*
    |--------------------------------------------------------------------------
    | TROCAR TEMA + ÁUDIO
    |--------------------------------------------------------------------------
    */

    function setAudioTheme(themeId) {

        const playlist =
            playlists[themeId];


        if (!playlist) {
            return;
        }


        setTheme(
            themeId
        );


        setCurrentPlaylist(
            playlist.id
        );


        if (
            playlist.tracks.length === 0
        ) {

            setCurrentTrack(null);

            stopAudio();

            return;
        }


        const defaultTrack =
            playlist.tracks[0];


        setCurrentTrack(
            defaultTrack.id
        );


        /*
        | IMPORTANTE:
        |
        | Esta função é chamada pelo clique
        | do ThemeSwitcher.
        |
        | Assim o navegador reconhece
        | a reprodução como uma ação do usuário.
        */

        loadAndPlayTrack(
            defaultTrack
        );

    }


    /*
    |--------------------------------------------------------------------------
    | INICIAR ÁUDIO NA PRIMEIRA INTERAÇÃO
    |--------------------------------------------------------------------------
    |
    | O navegador normalmente bloqueia autoplay com som.
    |
    | Então, na primeira interação do usuário,
    | tentamos iniciar o áudio do tema atual.
    |
    */

    useEffect(() => {

        function handleFirstInteraction() {

            if (
                firstInteractionRef.current
            ) {
                return;
            }


            firstInteractionRef.current =
                true;


            const playlist =
                playlists[theme];


            const firstTrack =
                playlist?.tracks?.[0];


            if (!firstTrack) {
                return;
            }


            setCurrentPlaylist(
                playlist.id
            );


            setCurrentTrack(
                firstTrack.id
            );


            loadAndPlayTrack(
                firstTrack
            );

        }


        window.addEventListener(
            "pointerdown",
            handleFirstInteraction,
            {
                once: true,
            }
        );


        window.addEventListener(
            "keydown",
            handleFirstInteraction,
            {
                once: true,
            }
        );


        return () => {

            window.removeEventListener(
                "pointerdown",
                handleFirstInteraction
            );


            window.removeEventListener(
                "keydown",
                handleFirstInteraction
            );

        };

    }, []);


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

            <audio
                ref={audioRef}
                loop
                preload="auto"
            />

            {children}

        </AudioContext.Provider>

    );

}


/*
|--------------------------------------------------------------------------
| HOOK
|--------------------------------------------------------------------------
*/

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
