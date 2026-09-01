import {
    useState,
} from "react";

import {
    BookOpen,
    Crown,
    DoorOpen,
    Map,
    Menu,
    Search,
    Shield,
    UserRound,
    Users,
    X,
} from "lucide-react";

import {
    useUser,
} from "../../context/UserContext";

import "./SideMenu.css";


export default function SideMenu({
    onLogout,
}) {

    const [
        open,
        setOpen,
    ] = useState(false);


    const {
        user,
        logout,
    } = useUser();


    function handleLogout() {

        logout();

        onLogout?.();

    }


    return (

        <aside
            className={`side-menu ${
                open
                    ? "side-menu-open"
                    : ""
            }`}
        >

            <button
                type="button"
                className="side-menu-toggle"
                onClick={() => {
                    setOpen(
                        current => !current
                    );
                }}
                aria-label="Abrir menu"
            >

                {open
                    ? <X size={21} />
                    : <Menu size={21} />
                }

            </button>


            <div className="side-menu-content">

                <div className="side-menu-profile">

                    <div className="side-menu-avatar">
                        <UserRound size={22} />
                    </div>

                    <div className="side-menu-user">

                        <strong>
                            {user?.username ||
                                user?.name ||
                                "RPGista"}
                        </strong>

                        <span>
                            Aventureiro
                        </span>

                    </div>

                </div>


                <nav className="side-menu-navigation">

                    <button type="button">
                        <Users size={19} />
                        <span>Personagens</span>
                    </button>

                    <button type="button">
                        <Crown size={19} />
                        <span>Campanhas</span>
                    </button>

                    <button type="button">
                        <Map size={19} />
                        <span>Mapas</span>
                    </button>

                    <button type="button">
                        <BookOpen size={19} />
                        <span>Livros</span>
                    </button>

                    <button type="button">
                        <Shield size={19} />
                        <span>Escudo do Mestre</span>
                    </button>

                    <button type="button">
                        <Search size={19} />
                        <span>Procurar jogadores</span>
                    </button>

                </nav>


                <div className="side-menu-bottom">

                    <button
                        type="button"
                        className="side-menu-logout"
                        onClick={handleLogout}
                    >

                        <DoorOpen size={19} />
                        <span>Sair</span>

                    </button>

                </div>

            </div>

        </aside>

    );

}
