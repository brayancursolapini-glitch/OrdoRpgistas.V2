import { ArrowLeft } from "lucide-react";

import SideMenu from "../components/Menu/SideMenu";
import ThemeParticles from "../components/ThemeParticles/ThemeParticles";
import ThemeSwitcher from "../components/ThemeSwitcher/ThemeSwitcher";

import { useTheme } from "../context/ThemeContext";

import "./PageBase.css";

export default function PageBase({
    title,
    subtitle,
    icon: Icon,
    children,
    onNavigate,
}) {
    const { theme } = useTheme();

    const isDnd = theme === "dnd";

    const backgroundImage = isDnd
        ? `${import.meta.env.BASE_URL}images/Home-dnd.jpg`
        : `${import.meta.env.BASE_URL}images/Home-ordem.jpg`;

    function handleBack() {
        if (typeof onNavigate === "function") {
            onNavigate("home");
        }
    }

    return (
        <main
            className={`page-base page-base-${theme}`}
            style={{
                backgroundImage: `url("${backgroundImage}")`,
            }}
        >
            {/* =========================================
                PARTÍCULAS
            ========================================= */}

            <ThemeParticles />


            {/* =========================================
                OVERLAY
            ========================================= */}

            <div className="page-base-overlay" />


            {/* =========================================
                MENU LATERAL
            ========================================= */}

            <SideMenu
                onNavigate={onNavigate}
            />


            {/* =========================================
                TOPO
            ========================================= */}

            <header className="page-base-header">

                <div className="page-base-logo">

                    <span>
                        ORDO
                    </span>

                    <strong>
                        RPGISTAS
                    </strong>

                </div>


                <ThemeSwitcher />

            </header>


            {/* =========================================
                CONTEÚDO
            ========================================= */}

            <section className="page-base-content">

                {/* VOLTAR */}

                <button
                    type="button"
                    className="page-base-back"
                    onClick={handleBack}
                >
                    <ArrowLeft size={18} />

                    <span>
                        Voltar para Home
                    </span>
                </button>


                {/* TÍTULO */}

                <div className="page-base-title">

                    {Icon && (
                        <div className="page-base-icon">
                            <Icon size={28} />
                        </div>
                    )}


                    <div className="page-base-title-text">

                        <span>
                            ORDO RPGISTAS
                        </span>

                        <h1>
                            {title}
                        </h1>

                        {subtitle && (
                            <p>
                                {subtitle}
                            </p>
                        )}

                    </div>

                </div>


                {/* CONTEÚDO DA PÁGINA */}

                <div className="page-base-body">
                    {children}
                </div>

            </section>

        </main>
    );
}
