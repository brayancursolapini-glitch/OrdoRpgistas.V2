import {
    UserRound,
    Shield,
    Sword,
    Crown,
    Users,
    Sparkles,
    Edit3,
} from "lucide-react";

import PageBase from "../PageBase";

import "./Perfil.css";

export default function Perfil({
    onNavigate,
}) {
    return (
        <PageBase
            title="Meu Perfil"
            subtitle="Seu espaço dentro do universo Ordo RPGistas."
            icon={UserRound}
            onNavigate={onNavigate}
        >
            <div className="perfil-page">

                <section className="perfil-hero-card">

                    <div className="perfil-avatar">
                        <UserRound size={54} />
                    </div>

                    <div className="perfil-main-info">
                        <span className="perfil-label">
                            AVENTUREIRO
                        </span>

                        <h2>
                            Seu Nome
                        </h2>

                        <p>
                            @seuusuario
                        </p>

                        <span className="perfil-status">
                            <span className="perfil-status-dot" />
                            Online
                        </span>
                    </div>

                    <button
                        type="button"
                        className="perfil-edit-button"
                    >
                        <Edit3 size={17} />
                        <span>Editar perfil</span>
                    </button>

                </section>


                <section className="perfil-grid">

                    <article className="perfil-card perfil-about">

                        <div className="perfil-card-header">
                            <div className="perfil-card-icon">
                                <Sparkles size={20} />
                            </div>

                            <div>
                                <span>
                                    SOBRE MIM
                                </span>

                                <h3>
                                    Minha aventura
                                </h3>
                            </div>
                        </div>

                        <p>
                            Conte um pouco sobre você, suas aventuras,
                            seus sistemas favoritos e o tipo de campanha
                            que gosta de jogar.
                        </p>

                    </article>


                    <article className="perfil-card">

                        <div className="perfil-card-header">
                            <div className="perfil-card-icon">
                                <Shield size={20} />
                            </div>

                            <div>
                                <span>
                                    SISTEMAS
                                </span>

                                <h3>
                                    Meus RPGs
                                </h3>
                            </div>
                        </div>

                        <div className="perfil-system-list">

                            <div className="perfil-system-item">
                                <Sword size={18} />

                                <div>
                                    <strong>
                                        Dungeons & Dragons
                                    </strong>

                                    <span>
                                        Sistema favorito
                                    </span>
                                </div>
                            </div>

                            <div className="perfil-system-item">
                                <Shield size={18} />

                                <div>
                                    <strong>
                                        Ordem Paranormal
                                    </strong>

                                    <span>
                                        Sistema favorito
                                    </span>
                                </div>
                            </div>

                        </div>

                    </article>


                    <article className="perfil-card perfil-stats">

                        <div className="perfil-card-header">
                            <div className="perfil-card-icon">
                                <Crown size={20} />
                            </div>

                            <div>
                                <span>
                                    ESTATÍSTICAS
                                </span>

                                <h3>
                                    Minha jornada
                                </h3>
                            </div>
                        </div>

                        <div className="perfil-stat-grid">

                            <div className="perfil-stat">
                                <strong>
                                    0
                                </strong>

                                <span>
                                    Personagens
                                </span>
                            </div>

                            <div className="perfil-stat">
                                <strong>
                                    0
                                </strong>

                                <span>
                                    Campanhas
                                </span>
                            </div>

                            <div className="perfil-stat">
                                <strong>
                                    0
                                </strong>

                                <span>
                                    Grupos
                                </span>
                            </div>

                            <div className="perfil-stat">
                                <strong>
                                    0
                                </strong>

                                <span>
                                    Sessões
                                </span>
                            </div>

                        </div>

                    </article>


                    <article className="perfil-card perfil-groups">

                        <div className="perfil-card-header">
                            <div className="perfil-card-icon">
                                <Users size={20} />
                            </div>

                            <div>
                                <span>
                                    COMUNIDADE
                                </span>

                                <h3>
                                    Meus grupos
                                </h3>
                            </div>
                        </div>

                        <div className="perfil-empty">

                            <Users size={32} />

                            <strong>
                                Você ainda não participa de nenhum grupo.
                            </strong>

                            <span>
                                Encontre jogadores e crie novas aventuras.
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    onNavigate?.("players")
                                }
                            >
                                Procurar jogadores
                            </button>

                        </div>

                    </article>

                </section>

            </div>
        </PageBase>
    );
}
