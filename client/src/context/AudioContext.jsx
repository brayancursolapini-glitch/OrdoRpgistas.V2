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
|
| Para adicionar novos áudios futuramente, basta colocar uma nova faixa
| dentro da playlist correspondente.
|
| Exemplo:
|
| {
|     id: "nova-musica",
|     name: "Minha nova música",
|     file: "audio/minha-musica.mp3",
| }
|
*/

const DEFAULT_PLAYLISTS = {

    dnd: {

        id: "dnd",

        name: "D&D",

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

        id: "ordem",

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
    | CONTROLES
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


    const [
        volume,
        setVolume,
    ] = useState(() =>

        getSavedValue(
            "ordo-rpgistas-audio-volume",
            0.45
        )

    );


    const [
        currentPlaylist,
        setCurrentPlaylist,
    ] = useState(() =>

        getSavedValue(
            "ordo-rpgistas-audio-playlist",
            "dnd"
        )

    );


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
    | TEMA ATUAL
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
    | SALVAR CONFIGURAÇÕES
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
    | VOLUME / MUTE
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
    | CARREGAR E TOCAR FAIXA
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const audio =
            audioRef.current;


        if (!audio) {

            return;

        }


        if (!currentTrack) {

            audio.pause();

            audio.currentTime = 0;

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


        const source =
            `${import.meta.env.BASE_URL}${track.file}`;


        /*
        |--------------------------------------------------------------------------
        | Evita recarregar a mesma faixa
        |--------------------------------------------------------------------------
        */

        if (
            audio.src !==
            new URL(
                source,
                window.location.href
            ).href
        ) {

            audio.src =
                source;

            audio.load();

        }


        audio.volume =
            muted
                ? 0
                : volume;


        audio.muted =
            muted;


        /*
        |--------------------------------------------------------------------------
        | Tenta iniciar automaticamente.
        |
        | Se o navegador bloquear autoplay,
        | o erro é simplesmente ignorado.
        |--------------------------------------------------------------------------
        */

        audio
            .play()
            .catch(() => {});

    }, [
        currentTrack,
        currentPlaylist,
    ]);


    /*
    |--------------------------------------------------------------------------
    | ATUALIZAR ÁUDIO QUANDO O TEMA MUDA
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const playlist =
            playlists[theme];


        if (!playlist) {

            return;

        }


        setCurrentPlaylist(
            playlist.id
        );


        if (
            playlist.tracks.length === 0
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
        | O primeiro áudio da playlist do tema
        | passa a ser o áudio ambiente padrão.
        |--------------------------------------------------------------------------
        */

        setCurrentTrack(
            playlist.tracks[0].id
        );

    }, [
        theme,
    ]);


    /*
    |--------------------------------------------------------------------------
    | DEFINIR TEMA
    |--------------------------------------------------------------------------
    */

    function setAudioTheme(
        themeId
    ) {

        if (
            !playlists[themeId]
        ) {

            return;

        }


        setTheme(
            themeId
        );

    }


    /*
    |--------------------------------------------------------------------------
    | MUTE
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
    | VOLUME
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
    | PLAYLIST
    |--------------------------------------------------------------------------
    */

    function selectPlaylist(
        playlistId
    ) {

        if (
            !playlists[playlistId]
        ) {

            return;

        }


        setCurrentPlaylist(
            playlistId
        );


        const playlistTracks =
            playlists[
                playlistId
            ].tracks;


        if (
            playlistTracks.length > 0
        ) {

            setCurrentTrack(
                playlistTracks[0].id
            );

        } else {

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

        }

    }


    /*
    |--------------------------------------------------------------------------
    | FAIXA
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
    | CONTINUAR
    |--------------------------------------------------------------------------
    */

    function playCurrent() {

        if (
            !audioRef.current ||
            !currentTrack
        ) {

            return;

        }


        audioRef.current
            .play()
            .catch(() => {});

    }


    /*
    |--------------------------------------------------------------------------
    | RETOMAR ÁUDIO DO TEMA
    |--------------------------------------------------------------------------
    */

    function playThemeAudio(
        themeId
    ) {

        const playlist =
            playlists[
                themeId
            ];


        if (
            !playlist ||
            playlist.tracks.length === 0
        ) {

            return;

        }


        setTheme(
            themeId
        );


        setCurrentPlaylist(
            playlist.id
        );


        setCurrentTrack(
            playlist.tracks[0].id
        );

    }


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

                playThemeAudio,

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
