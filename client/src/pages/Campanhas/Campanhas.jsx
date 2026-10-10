```jsx
import { useEffect, useState } from "react";
import {
    Crown,
    Plus,
    ScrollText,
    Users,
    CalendarDays,
    Trash2,
    X,
    ArrowLeft,
    Swords,
    BookOpen,
    Search,
    ChevronRight,
    Gamepad2,
} from "lucide-react";

import PageBase from "../PageBase";
import "./Campanhas.css";

const STORAGE_KEY = "ordo-rpgistas-campanhas";

const SISTEMAS = [
    "D&D 5ª Edição",
    "Ordem Paranormal",
    "Tormenta20",
    "Call of Cthulhu",
    "Sistema próprio",
    "Outro",
];

const STATUS = ["Planejamento", "Em andamento", "Concluída"];

function carregarCampanhas() {
    try {
        const dados = localStorage.getItem(STORAGE_KEY);

        if (!dados) return [];

        const campanhas = JSON.parse(dados);

        return Array.isArray(campanhas) ? campanhas : [];
    } catch (erro) {
        console.error("Erro ao carregar campanhas:", erro);
        return [];
    }
}

function formatarData(data) {
    if (!data) return "Data não definida";

    const dataValida = new Date(data);

    if (Number.isNaN(dataValida.getTime())) {
        return "Data não definida";
    }

    return dataValida.toLocaleDateString("pt-BR");
}

export default function Campanhas({ onNavigate }) {
    const [campanhas, setCampanhas] = useState(carregarCampanhas);
    const [busca, setBusca] = useState("");
    const [modalCriacao, setModalCriacao] = useState(false);
    const [campanhaAberta, setCampanhaAberta] = useState(null);
    const [erro, setErro] = useState("");

    const [formulario, setFormulario] = useState({
        nome: "",
        descricao: "",
        sistema: "D&D 5ª Edição",
        mestre: "",
        status: "Planejamento",
        jogadores: "",
    });

    useEffect(() => {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(campanhas)
            );
        } catch (erroStorage) {
            console.error("Erro ao salvar campanhas:", erroStorage);
            setErro(
                "Não foi possível salvar as campanhas neste navegador."
            );
        }
    }, [campanhas]);

    function atualizarCampo(campo, valor) {
        setFormulario((atual) => ({
            ...atual,
            [campo]: valor,
        }));
    }

    function criarCampanha(evento) {
        evento.preventDefault();
        setErro("");

        const nome = formulario.nome.trim();

        if (!nome) {
            setErro("Digite um nome para a campanha.");
            return;
        }

        const novaCampanha = {
            id: `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 9)}`,
            nome,
            descricao: formulario.descricao.trim(),
            sistema: formulario.sistema,
            mestre: formulario.mestre.trim() || "Mestre não definido",
            status: formulario.status,
            jogadores: formulario.jogadores
                .split(",")
                .map((jogador) => jogador.trim())
                .filter(Boolean),
            criadaEm: new Date().toISOString(),
        };

        setCampanhas((atuais) => [novaCampanha, ...atuais]);

        setFormulario({
            nome: "",
            descricao: "",
            sistema: "D&D 5ª Edição",
            mestre: "",
            status: "Planejamento",
            jogadores: "",
        });

        setModalCriacao(false);
    }

    function excluirCampanha(id) {
        const confirmar = window.confirm(
            "Tem certeza de que deseja excluir esta campanha? Essa ação não pode ser desfeita."
        );

        if (!confirmar) return;

        setCampanhas((atuais) =>
            atuais.filter((campanha) => campanha.id !== id)
        );

        if (campanhaAberta?.id === id) {
            setCampanhaAberta(null);
        }
    }

    const campanhasFiltradas = campanhas.filter((campanha) => {
        const termo = busca.toLowerCase().trim();

        if (!termo) return true;

        return [
            campanha.nome,
            campanha.sistema,
            campanha.mestre,
            campanha.descricao,
            campanha.status,
        ].some((valor) =>
            String(valor || "").toLowerCase().includes(termo)
        );
    });

    return (
        <PageBase
            title="Campanhas"
            subtitle="Crie e participe de aventuras com seu grupo."
            icon={Crown}
            onNavigate={onNavigate}
        >
            <div className="campanhas-pagina">
                {campanhaAberta ? (
                    <section className="campanha-detalhes">
                        <button
                            type="button"
                            className="campanha-botao campanha-botao-secundario"
                            onClick={() => setCampanhaAberta(null)}
                        >
                            <ArrowLeft size={17} />
                            Voltar às campanhas
                        </button>

                        <div className="campanha-detalhe-capa">
                            <div className="campanha-detalhe-simbolo">
                                <Crown size={34} />
                            </div>

                            <span className="campanha-etiqueta">
                                {campanhaAberta.sistema}
                            </span>

                            <h2>{campanhaAberta.nome}</h2>

                            <span
                                className={`campanha-status status-${campanhaAberta.status
                                    .toLowerCase()
                                    .replaceAll(" ", "-")}`}
                            >
                                {campanhaAberta.status}
                            </span>
                        </div>

                        <div className="campanha-detalhe-conteudo">
                            <section className="campanha-bloco">
                                <h3>
                                    <ScrollText size={19} />
                                    Sobre a aventura
                                </h3>

                                <p>
                                    {campanhaAberta.descricao ||
                                        "Nenhuma descrição foi adicionada a esta campanha."}
                                </p>
                            </section>

                            <div className="campanha-detalhe-grid">
                                <section className="campanha-bloco">
                                    <h3>
                                        <Crown size={19} />
                                        Mestre
                                    </h3>

                                    <p>{campanhaAberta.mestre}</p>
                                </section>

                                <section className="campanha-bloco">
                                    <h3>
                                        <CalendarDays size={19} />
                                        Criada em
                                    </h3>

                                    <p>
                                        {formatarData(
                                            campanhaAberta.criadaEm
                                        )}
                                    </p>
                                </section>
                            </div>

                            <section className="campanha-bloco">
                                <h3>
                                    <Users size={19} />
                                    Grupo de jogadores
                                </h3>

                                {campanhaAberta.jogadores?.length > 0 ? (
                                    <div className="campanha-jogadores">
                                        {campanhaAberta.jogadores.map(
                                            (jogador, indice) => (
                                                <div
                                                    className="campanha-jogador"
                                                    key={`${jogador}-${indice}`}
                                                >
                                                    <Users size={17} />
                                                    <span>{jogador}</span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p>
                                        Nenhum jogador foi cadastrado ainda.
                                    </p>
                                )}
                            </section>

                            <div className="campanha-aviso">
                                <BookOpen size={20} />
                                <div>
                                    <strong>
                                        Próximo passo: organizar a aventura
                                    </strong>
                                    <p>
                                        A área de sessões, missões e
                                        personagens vinculados poderá ser
                                        adicionada em uma próxima etapa.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="campanha-botao campanha-botao-perigo"
                                onClick={() =>
                                    excluirCampanha(campanhaAberta.id)
                                }
                            >
                                <Trash2 size={17} />
                                Excluir campanha
                            </button>
                        </div>
                    </section>
                ) : (
                    <>
                        <header className="campanhas-cabecalho">
                            <div className="campanhas-introducao">
                                <span className="campanha-etiqueta">
                                    <Swords size={13} />
                                    CENTRAL DE AVENTURAS
                                </span>

                                <h2>Suas campanhas</h2>

                                <p>
                                    Reúna seu grupo, prepare suas histórias
                                    e embarque em novas aventuras.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="campanha-botao campanha-botao-principal"
                                onClick={() => {
                                    setErro("");
                                    setModalCriacao(true);
                                }}
                            >
                                <Plus size={19} />
                                Nova campanha
                            </button>
                        </header>

                        <div className="campanhas-estatisticas">
                            <div className="campanha-estatistica">
                                <div className="campanha-estatistica-icone">
                                    <Crown size={21} />
                                </div>

                                <div>
                                    <span>Total de campanhas</span>
                                    <strong>{campanhas.length}</strong>
                                </div>
                            </div>

                            <div className="campanha-estatistica">
                                <div className="campanha-estatistica-icone">
                                    <Swords size={21} />
                                </div>

                                <div>
                                    <span>Em andamento</span>
                                    <strong>
                                        {
                                            campanhas.filter(
                                                (campanha) =>
                                                    campanha.status ===
                                                    "Em andamento"
                                            ).length
                                        }
                                    </strong>
                                </div>
                            </div>

                            <div className="campanha-estatistica">
                                <div className="campanha-estatistica-icone">
                                    <Users size={21} />
                                </div>

                                <div>
                                    <span>Jogadores cadastrados</span>
                                    <strong>
                                        {new Set(
                                            campanhas.flatMap((campanha) =>
                                                Array.isArray(
                                                    campanha.jogadores
                                                )
                                                    ? campanha.jogadores
                                                    : []
                                            )
                                        ).size}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className="campanhas-ferramentas">
                            <label
                                className="campanhas-busca"
                                htmlFor="buscar-campanha"
                            >
                                <Search size={18} />

                                <input
                                    id="buscar-campanha"
                                    type="search"
                                    value={busca}
                                    onChange={(evento) =>
                                        setBusca(evento.target.value)
                                    }
                                    placeholder="Buscar campanha, sistema ou mestre..."
                                />
                            </label>
                        </div>

                        {campanhasFiltradas.length > 0 ? (
                            <div className="campanhas-lista">
                                {campanhasFiltradas.map((campanha) => (
                                    <article
                                        className="campanha-card"
                                        key={campanha.id}
                                    >
                                        <div className="campanha-card-capa">
                                            <div className="campanha-card-simbolo">
                                                <Crown size={30} />
                                            </div>

                                            <span className="campanha-card-sistema">
                                                {campanha.sistema}
                                            </span>
                                        </div>

                                        <div className="campanha-card-conteudo">
                                            <div className="campanha-card-topo">
                                                <span
                                                    className={`campanha-status status-${campanha.status
                                                        .toLowerCase()
                                                        .replaceAll(" ", "-")}`}
                                                >
                                                    {campanha.status}
                                                </span>

                                                <button
                                                    type="button"
                                                    className="campanha-icone-botao"
                                                    title="Excluir campanha"
                                                    aria-label={`Excluir ${campanha.nome}`}
                                                    onClick={() =>
                                                        excluirCampanha(
                                                            campanha.id
                                                        )
                                                    }
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>

                                            <h3>{campanha.nome}</h3>

                                            <p className="campanha-card-descricao">
                                                {campanha.descricao ||
                                                    "Esta campanha ainda não possui uma descrição."}
                                            </p>

                                            <div className="campanha-card-info">
                                                <span>
                                                    <Crown size={15} />
                                                    {campanha.mestre}
                                                </span>

                                                <span>
                                                    <Users size={15} />
                                                    {campanha.jogadores?.length ||
                                                        0}{" "}
                                                    jogador(es)
                                                </span>
                                            </div>

                                            <div className="campanha-card-rodape">
                                                <small>
                                                    Criada em{" "}
                                                    {formatarData(
                                                        campanha.criadaEm
                                                    )}
                                                </small>

                                                <button
                                                    type="button"
                                                    className="campanha-abrir"
                                                    onClick={() =>
                                                        setCampanhaAberta(
                                                            campanha
                                                        )
                                                    }
                                                >
                                                    Abrir campanha
                                                    <ChevronRight size={17} />
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="campanhas-vazio">
                                <div className="campanhas-vazio-icone">
                                    {busca ? (
                                        <Search size={32} />
                                    ) : (
                                        <Gamepad2 size={36} />
                                    )}
                                </div>

                                <h3>
                                    {busca
                                        ? "Nenhuma campanha encontrada"
                                        : "Sua próxima aventura começa aqui"}
                                </h3>

                                <p>
                                    {busca
                                        ? "Tente buscar por outro nome, sistema ou mestre."
                                        : "Crie sua primeira campanha e comece a montar seu grupo de aventureiros."}
                                </p>

                                {!busca && (
                                    <button
                                        type="button"
                                        className="campanha-botao campanha-botao-principal"
                                        onClick={() =>
                                            setModalCriacao(true)
                                        }
                                    >
                                        <Plus size={18} />
                                        Criar primeira campanha
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}

                {modalCriacao && (
                    <div
                        className="campanha-modal-fundo"
                        onMouseDown={(evento) => {
                            if (evento.target === evento.currentTarget) {
                                setModalCriacao(false);
                                setErro("");
                            }
                        }}
                    >
                        <section
                            className="campanha-modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="nova-campanha-titulo"
                        >
                            <header className="campanha-modal-cabecalho">
                                <div>
                                    <span className="campanha-etiqueta">
                                        <Swords size={13} />
                                        PREPARE SUA AVENTURA
                                    </span>

                                    <h2 id="nova-campanha-titulo">
                                        Nova campanha
                                    </h2>

                                    <p>
                                        Defina os detalhes iniciais da sua
                                        aventura.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="campanha-icone-botao"
                                    aria-label="Fechar formulário"
                                    onClick={() => {
                                        setModalCriacao(false);
                                        setErro("");
                                    }}
                                >
                                    <X size={20} />
                                </button>
                            </header>

                            <form
                                className="campanha-formulario"
                                onSubmit={criarCampanha}
                            >
                                <div className="campanha-campo">
                                    <label htmlFor="campanha-nome">
                                        Nome da campanha *
                                    </label>

                                    <input
                                        id="campanha-nome"
                                        type="text"
                                        maxLength={80}
                                        required
                                        autoFocus
                                        value={formulario.nome}
                                        onChange={(evento) =>
                                            atualizarCampo(
                                                "nome",
                                                evento.target.value
                                            )
                                        }
                                        placeholder="Ex.: As Sombras de Eldoria"
                                    />
                                </div>

                                <div className="campanha-campo">
                                    <label htmlFor="campanha-descricao">
                                        Descrição da aventura
                                    </label>

                                    <textarea
                                        id="campanha-descricao"
                                        rows={4}
                                        maxLength={1500}
                                        value={formulario.descricao}
                                        onChange={(evento) =>
                                            atualizarCampo(
                                                "descricao",
                                                evento.target.value
                                            )
                                        }
                                        placeholder="Conte um pouco sobre o mundo, a missão e os desafios..."
                                    />
                                </div>

                                <div className="campanha-formulario-grid">
                                    <div className="campanha-campo">
                                        <label htmlFor="campanha-sistema">
                                            Sistema de RPG
                                        </label>

                                        <select
                                            id="campanha-sistema"
                                            value={formulario.sistema}
                                            onChange={(evento) =>
                                                atualizarCampo(
                                                    "sistema",
                                                    evento.target.value
                                                )
                                            }
                                        >
                                            {SISTEMAS.map((sistema) => (
                                                <option
                                                    key={sistema}
                                                    value={sistema}
                                                >
                                                    {sistema}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="campanha-campo">
                                        <label htmlFor="campanha-status">
                                            Status
                                        </label>

                                        <select
                                            id="campanha-status"
                                            value={formulario.status}
                                            onChange={(evento) =>
                                                atualizarCampo(
                                                    "status",
                                                    evento.target.value
                                                )
                                            }
                                        >
                                            {STATUS.map((status) => (
                                                <option
                                                    key={status}
                                                    value={status}
                                                >
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="campanha-campo">
                                    <label htmlFor="campanha-mestre">
                                        Nome do mestre
                                    </label>

                                    <input
                                        id="campanha-mestre"
                                        type="text"
                                        maxLength={80}
                                        value={formulario.mestre}
                                        onChange={(evento) =>
                                            atualizarCampo(
                                                "mestre",
                                                evento.target.value
                                            )
                                        }
                                        placeholder="Quem vai narrar a aventura?"
                                    />
                                </div>

                                <div className="campanha-campo">
                                    <label htmlFor="campanha-jogadores">
                                        Jogadores
                                    </label>

                                    <input
                                        id="campanha-jogadores"
                                        type="text"
                                        value={formulario.jogadores}
                                        onChange={(evento) =>
                                            atualizarCampo(
                                                "jogadores",
                                                evento.target.value
                                            )
                                        }
                                        placeholder="Ana, Pedro, Lucas..."
                                    />

                                    <small>
                                        Separe os nomes por vírgulas. Você
                                        poderá organizar o grupo depois.
                                    </small>
                                </div>

                                {erro && (
                                    <div
                                        className="campanha-formulario-erro"
                                        role="alert"
                                    >
                                        {erro}
                                    </div>
                                )}

                                <footer className="campanha-formulario-acoes">
                                    <button
                                        type="button"
                                        className="campanha-botao campanha-botao-secundario"
                                        onClick={() => {
                                            setModalCriacao(false);
                                            setErro("");
                                        }}
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        className="campanha-botao campanha-botao-principal"
                                    >
                                        <Plus size={18} />
                                        Criar campanha
                                    </button>
                                </footer>
                            </form>
                        </section>
                    </div>
                )}
            </div>
        </PageBase>
    );
}
```
