import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

const AudioContext = createContext(null);

const DEFAULT_PLAYLISTS = {
    dnd: {
        id: "dnd",
        name: "D&D",
        description: "Músicas e ambientes para aventuras de fantasia.",
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
        description: "Sons para investigações e situações paranormais.",
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
        description: "Ambientes para mundos fantásticos.",
        tracks: [],
    },

    natureza: {
        id: "natureza",
        name: "Natureza",
        description: "Chuva, floresta, vento e outros ambientes.",
        tracks: [],
    },

    taverna: {
        id: "taverna",
        name: "Taverna",
        description: "Ambientes aconchegantes para sua mesa.",
        tracks: [],
    },

    combate: {
        id: "combate",
        name: "Combate",
        description: "Trilhas para batalhas e momentos intensos.",
        tracks: [],
    },
};

function getSavedValue(key, fallback) {
    try {
        const value = localStorage.getItem(key);

        if (value === null) {
            return fallback;
        }

        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

export function AudioProvider({ children }) {
    const audioRef = useRef(null);

    const [muted, setMuted] = useState(() =>
        getSavedValue("ordo-rpgistas-audio-muted", false)
    );

    const [volume, setVolume] = useState(() =>
        getSavedValue("ordo-rpgistas-audio-volume", 0.45)
    );

    const [currentPlaylist, setCurrentPlaylist] = useState(() =>
        getSavedValue("ordo-rpgistas-audio-playlist", "dnd")
    );

    const [currentTrack, setCurrentTrack] = useState(() =>
        getSavedValue("ordo-rpgistas-audio-track", null)
    );

    const playlists = DEFAULT_PLAYLISTS;

    const currentPlaylistData =
        playlists[currentPlaylist] || playlists.dnd;

    const tracks = currentPlaylistData.tracks;

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
        if (!audioRef.current) {
            return;
        }

        audioRef.current.volume = muted ? 0 : volume;
        audioRef.current.muted = muted;
    }, [muted, volume]);

    useEffect(() => {
        if (!audioRef.current || !currentTrack) {
            return;
        }

        const track = tracks.find(
            (item) => item.id === currentTrack
        );

        if (!track) {
            return;
        }

        const audio = audioRef.current;

        audio.src = `${import.meta.env.BASE_URL}${track.file}`;
        audio.volume = muted ? 0 : volume;
        audio.muted = muted;

        audio
            .play()
            .catch(() => {
                /*
                 * Alguns navegadores bloqueiam reprodução
                 * automática até que o usuário interaja
                 * com a página.
                 */
            });

        return () => {
            audio.pause();
        };
    }, [
        currentTrack,
        currentPlaylist,
        tracks,
        muted,
        volume,
    ]);

    function toggleMute() {
        setMuted((current) => !current);
    }

    function changeVolume(value) {
        const newVolume = Number(value);

        if (Number.isNaN(newVolume)) {
            return;
        }

        setVolume(Math.min(1, Math.max(0, newVolume)));

        if (newVolume > 0 && muted) {
            setMuted(false);
        }
    }

    function selectPlaylist(playlistId) {
        if (!playlists[playlistId]) {
            return;
        }

        setCurrentPlaylist(playlistId);

        const playlistTracks =
            playlists[playlistId].tracks;

        if (playlistTracks.length > 0) {
            setCurrentTrack(playlistTracks[0].id);
        } else {
            setCurrentTrack(null);

            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeAttribute("src");
                audioRef.current.load();
            }
        }
    }

    function selectTrack(trackId) {
        const track = tracks.find(
            (item) => item.id === trackId
        );

        if (!track) {
            return;
        }

        setCurrentTrack(track.id);
    }

    function stopAudio() {
        setCurrentTrack(null);

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }

    function playCurrent() {
        if (!audioRef.current || !currentTrack) {
            return;
        }

        audioRef.current
            .play()
            .catch(() => {});
    }

    return (
        <AudioContext.Provider
            value={{
                muted,
                volume,
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

export function useAudio() {
    const context = useContext(AudioContext);

    if (!context) {
        throw new Error(
            "useAudio deve ser usado dentro de AudioProvider."
        );
    }

    return context;
}
