import {
    useState,
} from "react";

import {
    BookOpen,
    Crown,
    DoorOpen,
    Menu,
    Search,
    Map,
    UserRound,
    Users,
    X,
    Settings,
    Heart,
    Volume2,
    VolumeX,
    Music,
    ChevronDown,
    Play,
    Square,
} from "lucide-react";

import {
    useUser,
} from "../../context/UserContext";

import {
    useAudio,
} from "../../context/AudioContext";

import "./SideMenu.css";


export default function SideMenu({

    onNavigate,

    onLogout,

}) {

    const [
        open,
        setOpen,
    ] = useState(
        false
    );


    const [
        audioOpen,
        setAudioOpen,
    ] = useState(
        false
    );


    const {
        user,
        logout,
    } = useUser();


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

        playCurrent,

    } = useAudio();


    function handleNavigation(
        destination
    ) {

        if (
            onNavigate
        ) {

            onNavigate(
                destination
            );

        }


        setAudioOpen(
            false
        );


        setOpen(
            false
        );

    }


    function handleLogout() {

        logout();


        if (
            onLogout
        ) {

            onLogout();

        }

    }


    function handlePlaylist(
        playlistId
    ) {

        selectPlaylist(
            playlistId
        );

    }


    const navigation = [

        {
            id:
                "profile",

            label:
                "Perfil",

            icon:
                UserRound,

        },

        {
            id:
                "characters",

            label:
                "Personagens",

            icon:
                UserRound,

        },

        {
            id:
                "campaigns",

            label:
                "Campanhas",

            icon:
                Crown,

        },

        {
            id:
                "maps",

            label:
                "Mapas",

            icon:
                Map,

        },

        {
            id:
                "books",

            label:
                "Livros",

            icon:
                BookOpen,

        },

        {
            id:
                "groups",

            label:
                "Grupos",

            icon:
                Users,

        },

        {
            id:
                "players",

            label:
                "Procurar jogadores",

            icon:
                Search,

        },

    ];


    const secondaryNavigation = [

        {
            id:
                "settings",

            label:
                "Configurações",

            icon:
                Settings,

        },

        {
            id:
                "donation",

            label:
                "Doação",

            icon:
                Heart,

        },

    ];


    const playlistList =
        Object.values(
            playlists
        );


    return (

        <aside

            className={`
                side-menu

                ${
                    open
                        ? "side-menu-open"
                        : ""
                }
            `}

        >

            <button

                type="button"

                className="side-menu-toggle"

                onClick={() => {

                    setOpen(
                        current =>
                            !current
                    );

                }}

                aria-label={
                    open
                        ? "Fechar menu"
                        : "Abrir menu"
                }

            >

                {

                    open
                        ? (
                            <X
                                size={20}
                            />
                        )
                        : (
                            <Menu
                                size={20}
                            />
                        )

                }

            </button>


            <div
                className="side-menu-content"
            >

                {/* PERFIL */}

                <div
                    className="side-menu-profile"
                >

                    <div
                        className="side-menu-avatar"
                    >

                        <UserRound
                            size={22}
                        />

                    </div>


                    <div
                        className="side-menu-user"
                    >

                        <strong>

                            {
                                user?.name ||
                                user?.username ||
                                "RPGista"
                            }

                        </strong>


                        <span>

                            Aventureiro

                        </span>

                    </div>

                </div>


                {/* NAVEGAÇÃO PRINCIPAL */}

                <nav
                    className="side-menu-navigation"
                >

                    {
                        navigation.map(
                            item => {

                                const Icon =
                                    item.icon;


                                return (

                                    <button

                                        key={
                                            item.id
                                        }

                                        type="button"

                                        onClick={() => {

                                            handleNavigation(
                                                item.id
                                            );

                                        }}

                                    >

                                        <Icon
                                            size={19}
                                        />

                                        <span>

                                            {
                                                item.label
                                            }

                                        </span>

                                    </button>

                                );

                            }
                        )
                    }

                </nav>


                {/* ÁUDIO */}

                <div
                    className="side-menu-audio"
                >

                    <button

                        type="button"

                        className={`side-menu-audio-toggle ${
                            audioOpen
                                ? "active"
                                : ""
                        }`}

                        onClick={() => {

                            setAudioOpen(
                                current =>
                                    !current
                            );

                        }}

                    >

                        {
                            muted
                                ? (
                                    <VolumeX
                                        size={19}
                                    />
                                )
                                : (
                                    <Volume2
                                        size={19}
                                    />
                                )
                        }


                        <span>

                            Áudio

                        </span>


                        <ChevronDown

                            size={16}

                            className={
                                audioOpen
                                    ? "audio-chevron-open"
                                    : ""
                            }

                        />

                    </button>


                    {
                        audioOpen && (

                            <div
                                className="side-menu-audio-panel"
                            >

                                {/* CONTROLE PRINCIPAL */}

                                <div
                                    className="side-menu-audio-header"
                                >

                                    <div>

                                        <span>
                                            AMBIENTE
                                        </span>

                                        <strong>
                                            Música & Sons
                                        </strong>

                                    </div>


                                    <Music
                                        size={18}
                                    />

                                </div>


                                {/* TOCANDO AGORA */}

                                <div
                                    className="side-menu-audio-current"
                                >

                                    <span>
                                        TOCANDO AGORA
                                    </span>


                                    <strong>

                                        {
                                            currentTrack
                                                ? (
                                                    currentPlaylistData
                                                        ?.tracks
                                                        ?.find(
                                                            track =>
                                                                track.id ===
                                                                currentTrack
                                                        )
                                                        ?.name ||
                                                    "Faixa selecionada"
                                                )
                                                : "Nenhum som"
                                        }

                                    </strong>

                                </div>


                                {/* MUTE */}

                                <button

                                    type="button"

                                    className={`side-menu-audio-mute ${
                                        muted
                                            ? "muted"
                                            : ""
                                    }`}

                                    onClick={
                                        toggleMute
                                    }

                                >

                                    {
                                        muted
                                            ? (
                                                <VolumeX
                                                    size={17}
                                                />
                                            )
                                            : (
                                                <Volume2
                                                    size={17}
                                                />
                                            )
                                    }


                                    <span>

                                        {
                                            muted
                                                ? "Ativar som"
                                                : "Silenciar site"
                                        }

                                    </span>

                                </button>


                                {/* VOLUME */}

                                <div
                                    className="side-menu-audio-volume"
                                >

                                    <div>

                                        <span>
                                            Volume
                                        </span>

                                        <span>
                                            {
                                                Math.round(
                                                    volume *
                                                    100
                                                )
                                            }%
                                        </span>

                                    </div>


                                    <input

                                        type="range"

                                        min="0"

                                        max="1"

                                        step="0.01"

                                        value={
                                            volume
                                        }

                                        onChange={
                                            event =>
                                                changeVolume(
                                                    event.target.value
                                                )
                                        }

                                    />

                                </div>


                                {/* PLAYLISTS */}

                                <div
                                    className="side-menu-audio-section"
                                >

                                    <span
                                        className="side-menu-audio-title"
                                    >
                                        PLAYLISTS
                                    </span>


                                    <div
                                        className="side-menu-playlists"
                                    >

                                        {
                                            playlistList.map(
                                                playlist => (

                                                    <button

                                                        type="button"

                                                        key={
                                                            playlist.id
                                                        }

                                                        className={`side-menu-playlist ${
                                                            currentPlaylist ===
                                                            playlist.id
                                                                ? "active"
                                                                : ""
                                                        }`}

                                                        onClick={() => {

                                                            handlePlaylist(
                                                                playlist.id
                                                            );

                                                        }}

                                                    >

                                                        <div>

                                                            <strong>
                                                                {
                                                                    playlist.name
                                                                }
                                                            </strong>

                                                            <small>
                                                                {
                                                                    playlist
                                                                        .tracks
                                                                        .length
                                                                }{" "}
                                                                sons
                                                            </small>

                                                        </div>


                                                        {
                                                            currentPlaylist ===
                                                            playlist.id && (

                                                                <Play
                                                                    size={14}
                                                                />

                                                            )
                                                        }

                                                    </button>

                                                )
                                            )
                                        }

                                    </div>

                                </div>


                                {/* FAIXAS */}

                                {
                                    currentPlaylistData
                                        ?.tracks
                                        ?.length > 0 && (

                                        <div
                                            className="side-menu-audio-section"
                                        >

                                            <span
                                                className="side-menu-audio-title"
                                            >
                                                FAIXAS
                                            </span>


                                            <div
                                                className="side-menu-tracks"
                                            >

                                                {
                                                    currentPlaylistData
                                                        .tracks
                                                        .map(
                                                            track => (

                                                                <button

                                                                    type="button"

                                                                    key={
                                                                        track.id
                                                                    }

                                                                    className={`side-menu-track ${
                                                                        currentTrack ===
                                                                        track.id
                                                                            ? "active"
                                                                            : ""
                                                                    }`}

                                                                    onClick={() => {

                                                                        selectTrack(
                                                                            track.id
                                                                        );

                                                                    }}

                                                                >

                                                                    <Music
                                                                        size={14}
                                                                    />

                                                                    <span>

                                                                        {
                                                                            track.name
                                                                        }

                                                                    </span>

                                                                </button>

                                                            )
                                                        )
                                                }

                                            </div>

                                        </div>

                                    )
                                }


                                {/* CONTROLE DE REPRODUÇÃO */}

                                <div
                                    className="side-menu-audio-player"
                                >

                                    <button

                                        type="button"

                                        onClick={
                                            playCurrent
                                        }

                                        disabled={
                                            !currentTrack
                                        }

                                        title="Continuar reprodução"

                                    >

                                        <Play
                                            size={15}
                                        />

                                    </button>


                                    <button

                                        type="button"

                                        onClick={
                                            stopAudio
                                        }

                                        disabled={
                                            !currentTrack
                                        }

                                        title="Parar reprodução"

                                    >

                                        <Square
                                            size={14}
                                        />

                                    </button>

                                </div>

                            </div>

                        )
                    }

                </div>


                {/* NAVEGAÇÃO SECUNDÁRIA */}

                <div
                    className="side-menu-secondary"
                >

                    {
                        secondaryNavigation.map(
                            item => {

                                const Icon =
                                    item.icon;


                                return (

                                    <button

                                        key={
                                            item.id
                                        }

                                        type="button"

                                        onClick={() => {

                                            handleNavigation(
                                                item.id
                                            );

                                        }}

                                    >

                                        <Icon
                                            size={18}
                                        />

                                        <span>

                                            {
                                                item.label
                                            }

                                        </span>

                                    </button>

                                );

                            }
                        )
                    }

                </div>


                {/* SAIR */}

                <div
                    className="side-menu-bottom"
                >

                    <button

                        type="button"

                        className="side-menu-logout"

                        onClick={
                            handleLogout
                        }

                    >

                        <DoorOpen
                            size={19}
                        />

                        <span>

                            Sair

                        </span>

                    </button>

                </div>

            </div>

        </aside>

    );

}
