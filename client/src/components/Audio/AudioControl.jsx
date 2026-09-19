import {
    Volume2,
    VolumeX,
    Music,
    ChevronDown,
} from "lucide-react";

import { useState } from "react";

import { useAudio } from "../../context/AudioContext";

import "./AudioControl.css";

export default function AudioControl() {
    const {
        muted,
        volume,
        currentPlaylist,
        currentPlaylistData,
        currentTrack,
        playlists,
        toggleMute,
        changeVolume,
        selectPlaylist,
        selectTrack,
        stopAudio,
    } = useAudio();

    const [open, setOpen] = useState(false);

    const playlistList = Object.values(playlists);

    return (
        <div className="audio-control">
            <button
                type="button"
                className={`audio-control-button ${
                    muted ? "is-muted" : ""
                }`}
                onClick={() => setOpen((value) => !value)}
                aria-label="Abrir controles de áudio"
            >
                {muted ? (
                    <VolumeX size={18} />
                ) : (
                    <Volume2 size={18} />
                )}

                <span>Áudio</span>

                <ChevronDown
                    size={15}
                    className={`audio-control-arrow ${
                        open ? "open" : ""
                    }`}
                />
            </button>

            {open && (
                <div className="audio-panel">
                    <div className="audio-panel-header">
                        <div>
                            <span className="audio-panel-eyebrow">
                                AMBIENTE
                            </span>

                            <h3>
                                Música & Sons
                            </h3>
                        </div>

                        <Music size={20} />
                    </div>

                    <div className="audio-current">
                        <span>
                            TOCANDO AGORA
                        </span>

                        <strong>
                            {currentTrack
                                ? (
                                    currentPlaylistData
                                        .tracks
                                        .find(
                                            (track) =>
                                                track.id ===
                                                currentTrack
                                        )?.name ||
                                    "Faixa selecionada"
                                )
                                : "Nenhum som selecionado"}
                        </strong>
                    </div>

                    <div className="audio-volume">
                        <div className="audio-volume-header">
                            <span>Volume</span>

                            <span>
                                {Math.round(
                                    volume * 100
                                )}
                                %
                            </span>
                        </div>

                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(event) =>
                                changeVolume(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <button
                        type="button"
                        className={`audio-mute-button ${
                            muted
                                ? "muted"
                                : ""
                        }`}
                        onClick={toggleMute}
                    >
                        {muted ? (
                            <VolumeX size={17} />
                        ) : (
                            <Volume2 size={17} />
                        )}

                        {muted
                            ? "Ativar som"
                            : "Silenciar site"}
                    </button>

                    <div className="audio-section">
                        <span className="audio-section-title">
                            PLAYLISTS
                        </span>

                        <div className="audio-playlists">
                            {playlistList.map(
                                (playlist) => (
                                    <button
                                        type="button"
                                        key={
                                            playlist.id
                                        }
                                        className={`audio-playlist ${
                                            currentPlaylist ===
                                            playlist.id
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            selectPlaylist(
                                                playlist.id
                                            )
                                        }
                                    >
                                        <span>
                                            {playlist.name}
                                        </span>

                                        <small>
                                            {
                                                playlist
                                                    .tracks
                                                    .length
                                            }{" "}
                                            sons
                                        </small>
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    {currentPlaylistData.tracks.length >
                        0 && (
                        <div className="audio-section">
                            <span className="audio-section-title">
                                FAIXAS
                            </span>

                            <div className="audio-tracks">
                                {currentPlaylistData.tracks.map(
                                    (track) => (
                                        <button
                                            type="button"
                                            key={
                                                track.id
                                            }
                                            className={`audio-track ${
                                                currentTrack ===
                                                track.id
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                selectTrack(
                                                    track.id
                                                )
                                            }
                                        >
                                            <Music
                                                size={15}
                                            />

                                            <span>
                                                {
                                                    track.name
                                                }
                                            </span>
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {currentTrack && (
                        <button
                            type="button"
                            className="audio-stop-button"
                            onClick={stopAudio}
                        >
                            Parar reprodução
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
