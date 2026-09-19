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

    return (
        <main
            className={`page-base page-base-${theme}`}
            style={{
                backgroundImage: `url(${backgroundImage})`,
            }}
        >
            <ThemeParticles />

            <div className="page-base-overlay" />

            <SideMenu onNavigate={onNavigate} />

            <header className="page-base-header">
                <div className="page-base-logo">
                    <span>ORDO</span>
                    <strong>RPGISTAS</strong>
                </div>

                <ThemeSwitcher />
            </header>

            <section className="page-base-content">
                <button
                    type="button"
                    className="page-base-back"
                    onClick={() => onNavigate?.("home")}
                >
                    <ArrowLeft size={18} />
                    <span>Voltar para Home</span>
                </button>

                <div className="page-base-title">
                    {Icon && (
                        <div className="page-base-icon">
                            <Icon size={28} />
                        </div>
                    )}

                    <div>
                        <span>ORDO RPGISTAS</span>

                        <h1>{title}</h1>

                        {subtitle && (
                            <p>{subtitle}</p>
                        )}
                    </div>
                </div>

                <div className="page-base-body">
                    {children}
                </div>
            </section>
        </main>
    );
}
