import {
    useState,
} from "react";

import {

    BookOpen,

    Crown,

    DoorOpen,

    Menu,

    Search,

    Shield,

    Map,

    UserRound,

    Users,

    X,

} from "lucide-react";

import {
    useUser,
} from "../../context/UserContext";

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


    const {
        user,
        logout,
    } = useUser();


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


    const navigation = [

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
                "master",

            label:
                "Escudo do Mestre",

            icon:
                Shield,
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
                        ? <X size={20} />
                        : <Menu size={20} />

                }

            </button>


            <div
                className="side-menu-content"
            >

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
