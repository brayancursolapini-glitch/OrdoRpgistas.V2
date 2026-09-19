import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";


const AudioContext =
    createContext(null);


/*
|--------------------------------------------------------------------------
| PLAYLISTS
|--------------------------------------------------------------------------
|
| Para adicionar novos áudios no futuro:
|
| {
|     id: "id-do-audio",
|     name: "Nome do áudio",
|     file: "audio/meu-audio.mp3",
| }
|
*/

const DEFAULT_PLAYLISTS = {

    dnd: {

        id:
            "dnd",

        name:
            "D&D",

        description:
            "Músicas e ambientes para aventuras de fantasia.",

        tracks: [

            {
                id:
                    "dnd-ambient-01",

                name:
                    "D&D — Ambiente",

                file:
                    "audio/dnd-ambient.mp3",

            },

        ],

    },


    ordem: {

        id:
            "ordem",

        name:
            "Ordem Paranormal",

        description:
            "Sons para investigações e situações paranormais.",

        tracks: [

            {
                id:
                    "ordem-ambient-01",

                name:
                    "Ordem — Ambiente",

                file:
                    "audio/ordem-ambient.mp3",

            },

        ],

    },


    fantasia: {

        id:
            "fantasia",

        name:
            "Fantasia & Aventura",

        description:
            "Ambientes para mundos fantásticos.",

        tracks: [],

    },


    natureza: {

        id:
            "natureza",

        name:
            "Natureza",

        description:
            "Chuva, floresta, vento e outros ambientes.",

        tracks: [],

    },


    taverna: {

        id:
            "taverna",

        name:
            "Taverna",

        description:
            "Ambientes aconchegantes para sua mesa.",

        tracks: [],

    },


    combate: {

        id:
            "combate",

        name:
            "Combate",

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

function getSavedValue(
    key,
    fallback
) {

    try {

        const value =
            localStorage.getItem(
                key
            );


        if (
            value === null
        ) {

            return fallback;

        }


        return JSON.parse(
            value
        );

    } catch {

        return fallback;

    }

}


/*
|--------------------------------------------------------------------------
| AUDIO PROVIDER
|--------------------------------------------------------------------------
*/

export function AudioProvider({
    children,
}) {

    const audioRef =
        useRef(null);


    /*
    |--------------------------------------------------------------------------
    | MUTE
    |--------------------------------------------------------------------------
    */

    const [
        muted,
        setMuted,
    ] = useState(() =>

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

    const [
        volume,
        setVolume,
    ] = useState(() =>

        getSavedValue(
            "ordo-rpgistas-audio-volume",
            0.45
        )

    );


    /*
    |--------------------------------------------------------------------------
    | PLAYLIST ATUAL
    |--------------------------------------------------------------------------
    */

    const [
        currentPlaylist,
        setCurrentPlaylist,
    ] = useState(() =>

        getSavedValue(
            "ordo-rpgistas-audio-playlist",
            "dnd"
        )

    );


    /*
    |--------------------------------------------------------------------------
    | FAIXA ATUAL
    |--------------------------------------------------------------------------
    */

    const [
        currentTrack,
        setCurrentTrack,
    ] = useState(() =>

        getSavedValue(
            "ordo-rpgistas-audio-track",
            null
        )

    );


    /*
    |--------------------------------------------------------------------------
    | TEMA DO ÁUDIO
    |--------------------------------------------------------------------------
    */

    const [
        theme,
        setTheme,
    ] = useState(() =>

        getSavedValue(
            "ordo-rpgistas-audio-theme",
            "dnd"
        )

    );


    const playlists =
        DEFAULT_PLAYLISTS;


    const currentPlaylistData =
        playlists[
            currentPlaylist
        ] ||
        playlists.dnd;


    const tracks =
        currentPlaylistData.tracks;


    /*
    |--------------------------------------------------------------------------
    | SALVAR MUTE
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        localStorage.setItem(
            "ordo-rpgistas-audio-muted",
            JSON.stringify(
                muted
            )
        );

    }, [
        muted,
    ]);


    /*
    |--------------------------------------------------------------------------
    | SALVAR VOLUME
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        localStorage.setItem(
            "ordo-rpgistas-audio-volume",
            JSON.stringify(
                volume
            )
        );

    }, [
        volume,
    ]);


    /*
    |--------------------------------------------------------------------------
    | SALVAR PLAYLIST
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        localStorage.setItem(
            "ordo-rpgistas-audio-playlist",
            JSON.stringify(
                currentPlaylist
            )
        );

    }, [
        currentPlaylist,
    ]);


    /*
    |--------------------------------------------------------------------------
    | SALVAR FAIXA
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        localStorage.setItem(
            "ordo-rpgistas-audio-track",
            JSON.stringify(
                currentTrack
            )
        );

    }, [
        currentTrack,
    ]);


    /*
    |--------------------------------------------------------------------------
    | SALVAR TEMA
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        localStorage.setItem(
            "ordo-rpgistas-audio-theme",
            JSON.stringify(
                theme
            )
        );

    }, [
        theme,
    ]);


    /*
    |--------------------------------------------------------------------------
    | APLICAR VOLUME / MUTE
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
    | FUNÇÃO INTERNA PARA CARREGAR E TOCAR UMA FAIXA
    |--------------------------------------------------------------------------
    */

    function loadAndPlayTrack(
        track
    ) {

        const audio =
            audioRef.current;


        if (
            !audio ||
            !track
        ) {

            return;

        }


        const source =
            `${import.meta.env.BASE_URL}${track.file}`;


        /*
        |--------------------------------------------------------------------------
        | Define o arquivo
        |--------------------------------------------------------------------------
        */

        audio.src =
            source;


        /*
        |--------------------------------------------------------------------------
        | Configura volume
        |--------------------------------------------------------------------------
        */

        audio.volume =
            muted
                ? 0
                : volume;


        audio.muted =
            muted;


        /*
        |--------------------------------------------------------------------------
        | Carrega o arquivo
        |--------------------------------------------------------------------------
        */

        audio.load();


        /*
        |--------------------------------------------------------------------------
        | PLAY
        |--------------------------------------------------------------------------
        |
        | Esta função pode ser chamada diretamente dentro de um clique
        | do usuário, permitindo que o navegador autorize o áudio.
        |
        */

        const playPromise =
            audio.play();


        if (
            playPromise &&
            typeof playPromise.catch ===
                "function"
        ) {

            playPromise.catch(
                error => {

                    console.warn(
                        "Não foi possível iniciar o áudio:",
                        error
                    );

                }
            );

        }

    }


    /*
    |--------------------------------------------------------------------------
    | ALTERAR MUTE
    |--------------------------------------------------------------------------
    */

    function toggleMute() {

        setMuted(
            current =>
                !current
        );

    }


    /*
    |--------------------------------------------------------------------------
    | ALTERAR VOLUME
    |--------------------------------------------------------------------------
    */

    function changeVolume(
        value
    ) {

        const newVolume =
            Number(
                value
            );


        if (
            Number.isNaN(
                newVolume
            )
        ) {

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

            setMuted(
                false
            );

        }

    }


    /*
    |--------------------------------------------------------------------------
    | ALTERAR PLAYLIST
    |--------------------------------------------------------------------------
    */

    function selectPlaylist(
        playlistId
    ) {

        const playlist =
            playlists[
                playlistId
            ];


        if (!playlist) {

            return;

        }


        setCurrentPlaylist(
            playlistId
        );


        if (
            playlist.tracks.length ===
            0
        ) {

            setCurrentTrack(
                null
            );


            if (
                audioRef.current
            ) {

                audioRef.current.pause();

                audioRef.current.currentTime =
                    0;

                audioRef.current.removeAttribute(
                    "src"
                );

                audioRef.current.load();

            }

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
    | ALTERAR FAIXA
    |--------------------------------------------------------------------------
    */

    function selectTrack(
        trackId
    ) {

        const track =
            tracks.find(
                item =>
                    item.id ===
                    trackId
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

        setCurrentTrack(
            null
        );


        if (
            audioRef.current
        ) {

            audioRef.current.pause();

            audioRef.current.currentTime =
                0;

        }

    }


    /*
    |--------------------------------------------------------------------------
    | PLAY
    |--------------------------------------------------------------------------
    */

    function playCurrent() {

        const audio =
            audioRef.current;


        if (
            !audio ||
            !currentTrack
        ) {

            return;

        }


        audio
            .play()
            .catch(
                () => {}
            );

    }


    /*
    |--------------------------------------------------------------------------
    | TROCAR TEMA + DAR PLAY
    |--------------------------------------------------------------------------
    |
    | ESTA É A PARTE PRINCIPAL DA CORREÇÃO.
    |
    */

    function setAudioTheme(
        themeId
    ) {

        const playlist =
            playlists[
                themeId
            ];


        if (!playlist) {

            return;

        }


        setTheme(
            themeId
        );


        setCurrentPlaylist(
            playlist.id
        );


        /*
        |--------------------------------------------------------------------------
        | Tema sem áudio
        |--------------------------------------------------------------------------
        */

        if (
            playlist.tracks.length ===
            0
        ) {

            setCurrentTrack(
                null
            );


            if (
                audioRef.current
            ) {

                audioRef.current.pause();

                audioRef.current.currentTime =
                    0;

                audioRef.current.removeAttribute(
                    "src"
                );

                audioRef.current.load();

            }

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Primeiro áudio da playlist = áudio padrão do tema
        |--------------------------------------------------------------------------
        */

        const defaultTrack =
            playlist.tracks[0];


        setCurrentTrack(
            defaultTrack.id
        );


        /*
        |--------------------------------------------------------------------------
        | IMPORTANTE:
        |
        | O play acontece imediatamente nesta função,
        | que foi chamada pelo clique do usuário.
        |--------------------------------------------------------------------------
        */

        loadAndPlayTrack(
            defaultTrack
        );

    }


    /*
    |--------------------------------------------------------------------------
    | PLAYLIST ATUAL
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (
            !currentTrack
        ) {

            return;

        }


        const track =
            tracks.find(
                item =>
                    item.id ===
                    currentTrack
            );


        if (!track) {

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Apenas garante que o estado do áudio acompanha o React.
        |
        | O play principal já acontece em loadAndPlayTrack().
        |--------------------------------------------------------------------------
        */

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
        currentTrack,
        currentPlaylist,
        muted,
        volume,
        tracks,
    ]);


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

                ref={
                    audioRef
                }

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
