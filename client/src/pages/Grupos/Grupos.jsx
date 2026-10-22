
import { useCallback, useEffect, useRef, useState } from "react";
import {
    Users,
    Plus,
    Search,
    Crown,
    ShieldCheck,
    CalendarDays,
    MessageCircle,
    Send,
    Copy,
    ArrowLeft,
    X,
    RefreshCw,
    Swords,
    Clock,
    UserPlus,
    Check,
    Ban,
    Trash2,
    BookOpen,
    Hash,
    AlertCircle,
    LoaderCircle,
    Globe,
} from "lucide-react";

import PageBase from "../PageBase";
import { supabase } from "../../lib/supabase";
import { useUser } from "../../context/UserContext";
import "./Grupos.css";

const SISTEMAS = [
    "D&D 5ª Edição",
    "Ordem Paranormal",
    "Tormenta20",
    "Call of Cthulhu",
    "Sistema próprio",
    "Outro",
];

const ABAS = [
    { id: "meus", label: "Meus grupos", icon: Users },
    { id: "explorar", label: "Explorar", icon: Search },
];

function nomeDoUsuario(user) {
    return (
        user?.user_metadata?.username ||
        user?.user_metadata?.name ||
        user?.user_metadata?.full_name ||
        user?.email?.split("@")[0] ||
        "RPGista"
    );
}

function formatarData(data) {
    if (!data) return "Data não definida";

    const valor = new Date(data);

    if (Number.isNaN(valor.getTime())) {
        return "Data não definida";
    }

    return valor.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatarDataHora(data) {
    if (!data) return "Data não definida";

    const valor = new Date(data);

    if (Number.isNaN(valor.getTime())) {
        return "Data não definida";
    }

    return valor.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function inicial(nome) {
    return String(nome || "R")
        .trim()
        .charAt(0)
        .toUpperCase() || "R";
}

function mensagemErro(erro) {
    if (!erro) return "Ocorreu um erro inesperado.";

    if (
        erro.message?.includes("Failed to fetch") ||
        erro.message?.includes("NetworkError")
    ) {
        return "Não foi possível conectar ao Supabase. Confira sua conexão e as variáveis do arquivo .env.local.";
    }

    if (erro.code === "23505") {
        return "Você já enviou uma solicitação ou já faz parte deste grupo.";
    }

    if (erro.code === "42501") {
        return "Você não tem permissão para realizar esta ação.";
    }

    return erro.message || "Ocorreu um erro inesperado.";
}

export default function Grupos({ onNavigate }) {
    const { user: usuarioLocal } = useUser();

    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [grupos, setGrupos] = useState([]);
    const [aba, setAba] = useState("meus");
    const [busca, setBusca] = useState("");
    const [grupoAberto, setGrupoAberto] = useState(null);
    const [abaDetalhe, setAbaDetalhe] = useState("chat");

    const [membros, setMembros] = useState([]);
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [mensagens, setMensagens] = useState([]);
    const [sessoes, setSessoes] = useState([]);

    const [modalCriacao, setModalCriacao] = useState(false);
    const [nomeGrupo, setNomeGrupo] = useState("");
    const [descricaoGrupo, setDescricaoGrupo] = useState("");
    const [sistemaGrupo, setSistemaGrupo] = useState(SISTEMAS[0]);

    const [novaMensagem, setNovaMensagem] = useState("");
    const [enviandoMensagem, setEnviandoMensagem] = useState(false);

    const [mostrarFormularioSessao, setMostrarFormularioSessao] =
        useState(false);
    const [tituloSessao, setTituloSessao] = useState("");
    const [descricaoSessao, setDescricaoSessao] = useState("");
    const [dataSessao, setDataSessao] = useState("");

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    const mensagensRef = useRef(null);
    const canalRef = useRef(null);

    const nomeAtual = nomeDoUsuario(usuario);

    const mostrarErro = useCallback((erroRecebido) => {
        console.error("Erro na página Grupos:", erroRecebido);
        setErro(mensagemErro(erroRecebido));
        setSucesso("");
    }, []);

    const limparAvisos = () => {
        setErro("");
        setSucesso("");
    };

    const carregarGrupos = useCallback(
        async (idUsuario, silencioso = false) => {
            if (!idUsuario) return;

            if (silencioso) {
                setAtualizando(true);
            } else {
                setCarregando(true);
            }

            try {
                const { data: lista, error: erroGrupos } =
                    await supabase
                        .from("rpg_groups")
                        .select("*")
                        .order("criado_em", { ascending: false });

                if (erroGrupos) throw erroGrupos;

                const { data: minhasAssociacoes, error: erroMembros } =
                    await supabase
                        .from("group_members")
                        .select("grupo_id, papel, status")
                        .eq("usuario_id", idUsuario);

                if (erroMembros) throw erroMembros;

                const associacoes = minhasAssociacoes || [];
                const gruposComSituacao = (lista || []).map((grupo) => {
                    const associacao = associacoes.find(
                        (item) => item.grupo_id === grupo.id
                    );

                    return {
                        ...grupo,
                        minha_situacao: associacao?.status || null,
                        meu_papel: associacao?.papel || null,
                    };
                });

                setGrupos(gruposComSituacao);

                setGrupoAberto((atual) => {
                    if (!atual) return null;

                    return (
                        gruposComSituacao.find(
                            (grupo) => grupo.id === atual.id
                        ) || null
                    );
                });
            } catch (erroRecebido) {
                mostrarErro(erroRecebido);
            } finally {
                setCarregando(false);
                setAtualizando(false);
            }
        },
        [mostrarErro]
    );

    useEffect(() => {
        let ativo = true;

        async function iniciarAutenticacao() {
            try {
                const { data, error: erroSessao } =
                    await supabase.auth.getSession();

                if (erroSessao) throw erroSessao;

                let usuarioSupabase = data.session?.user || null;

                if (!usuarioSupabase) {
                    const { data: anonimo, error: erroAnonimo } =
                        await supabase.auth.signInAnonymously({
                            options: {
                                data: {
                                    name:
                                        usuarioLocal?.name ||
                                        usuarioLocal?.username ||
                                        "RPGista",
                                    username:
                                        usuarioLocal?.username ||
                                        usuarioLocal?.name ||
                                        "RPGista",
                                },
                            },
                        });

                    if (erroAnonimo) throw erroAnonimo;
                    usuarioSupabase = anonimo.user;
                }

                if (!ativo) return;

                setUsuario(usuarioSupabase);
                await carregarGrupos(usuarioSupabase.id);
            } catch (erroRecebido) {
                if (ativo) {
                    mostrarErro(erroRecebido);
                    setCarregando(false);
                }
            }
        }

        iniciarAutenticacao();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_evento, sessao) => {
            if (sessao?.user && ativo) {
                setUsuario(sessao.user);
            }
        });

        return () => {
            ativo = false;
            subscription.unsubscribe();
        };
    }, [carregarGrupos, mostrarErro, usuarioLocal]);

    const carregarDetalhes = useCallback(
        async (grupo) => {
            if (!grupo?.id || !usuario?.id) return;

            try {
                const [
                    respostaMembros,
                    respostaMensagens,
                    respostaSessoes,
                ] = await Promise.all([
                    supabase
                        .from("group_members")
                        .select("*")
                        .eq("grupo_id", grupo.id)
                        .eq("status", "ativo")
                        .order("criado_em", { ascending: true }),

                    supabase
                        .from("group_messages")
                        .select("*")
                        .eq("grupo_id", grupo.id)
                        .order("criado_em", { ascending: true })
                        .limit(200),

                    supabase
                        .from("group_sessions")
                        .select("*")
                        .eq("grupo_id", grupo.id)
                        .order("data_sessao", { ascending: true }),
                ]);

                if (respostaMembros.error) {
                    throw respostaMembros.error;
                }

                if (respostaMensagens.error) {
                    throw respostaMensagens.error;
                }

                if (respostaSessoes.error) {
                    throw respostaSessoes.error;
                }

                setMembros(respostaMembros.data || []);
                setMensagens(respostaMensagens.data || []);
                setSessoes(respostaSessoes.data || []);

                if (grupo.responsavel_id === usuario.id) {
                    const { data, error: erroSolicitacoes } =
                        await supabase
                            .from("group_members")
                            .select("*")
                            .eq("grupo_id", grupo.id)
                            .eq("status", "pendente")
                            .order("criado_em", { ascending: true });

                    if (erroSolicitacoes) throw erroSolicitacoes;

                    setSolicitacoes(data || []);
                } else {
                    setSolicitacoes([]);
                }
            } catch (erroRecebido) {
                mostrarErro(erroRecebido);
            }
        },
        [usuario?.id, mostrarErro]
    );

    useEffect(() => {
        if (!grupoAberto || !usuario?.id) return;

        carregarDetalhes(grupoAberto);

        if (canalRef.current) {
            supabase.removeChannel(canalRef.current);
            canalRef.current = null;
        }

        const canal = supabase
            .channel(`grupo-${grupoAberto.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "group_messages",
                    filter: `grupo_id=eq.${grupoAberto.id}`,
                },
                () => carregarDetalhes(grupoAberto)
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "group_members",
                    filter: `grupo_id=eq.${grupoAberto.id}`,
                },
                () => {
                    carregarDetalhes(grupoAberto);
                    carregarGrupos(usuario.id, true);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "group_sessions",
                    filter: `grupo_id=eq.${grupoAberto.id}`,
                },
                () => carregarDetalhes(grupoAberto)
            )
            .subscribe();

        canalRef.current = canal;

        return () => {
            supabase.removeChannel(canal);
            if (canalRef.current === canal) {
                canalRef.current = null;
            }
        };
    }, [
        grupoAberto?.id,
        usuario?.id,
        carregarDetalhes,
        carregarGrupos,
    ]);

    useEffect(() => {
        if (mensagensRef.current) {
            mensagensRef.current.scrollTop =
                mensagensRef.current.scrollHeight;
        }
    }, [mensagens]);

    async function criarGrupo(evento) {
        evento.preventDefault();
        limparAvisos();

        const nome = nomeGrupo.trim();

        if (nome.length < 2) {
            setErro("O nome do grupo precisa ter pelo menos 2 caracteres.");
            return;
        }

        if (!usuario?.id) {
            setErro("Sua sessão ainda não está pronta. Tente novamente.");
            return;
        }

        setAtualizando(true);

        try {
            const { data: grupo, error: erroCriacao } = await supabase
                .from("rpg_groups")
                .insert({
                    nome,
                    descricao: descricaoGrupo.trim(),
                    sistema: sistemaGrupo,
                    responsavel_id: usuario.id,
                    publico: true,
                })
                .select()
                .single();

            if (erroCriacao) throw erroCriacao;

            const { error: erroAssociacao } = await supabase
                .from("group_members")
                .insert({
                    grupo_id: grupo.id,
                    usuario_id: usuario.id,
                    apelido: nomeAtual,
                    papel: "responsavel",
                    status: "ativo",
                });

            if (erroAssociacao) {
                await supabase
                    .from("rpg_groups")
                    .delete()
                    .eq("id", grupo.id);

                throw erroAssociacao;
            }

            setModalCriacao(false);
            setNomeGrupo("");
            setDescricaoGrupo("");
            setSistemaGrupo(SISTEMAS[0]);
            setAba("meus");
            setBusca("");
            setSucesso("Grupo criado com sucesso!");

            await carregarGrupos(usuario.id);
            setGrupoAberto(grupo);
            setAbaDetalhe("membros");
        } catch (erroRecebido) {
            mostrarErro(erroRecebido);
        } finally {
            setAtualizando(false);
        }
    }

    async function solicitarEntrada(grupo) {
        limparAvisos();

        if (!usuario?.id) return;

        try {
            const { error: erroSolicitacao } = await supabase
                .from("group_members")
                .insert({
                    grupo_id: grupo.id,
                    usuario_id: usuario.id,
                    apelido: nomeAtual,
                    papel: "membro",
                    status: "pendente",
                });

            if (erroSolicitacao) throw erroSolicitacao;

            setSucesso(`Solicitação enviada para "${grupo.nome}".`);
            await carregarGrupos(usuario.id, true);
        } catch (erroRecebido) {
            if (erroRecebido.code === "23505") {
                setErro("Você já solicitou entrada ou já participa desse grupo.");
            } else {
                mostrarErro(erroRecebido);
            }
        }
    }

    async function decidirSolicitacao(solicitacao, aprovar) {
        limparAvisos();

        try {
            const { error: erroDecisao } = await supabase
                .from("group_members")
                .update({
                    status: aprovar ? "ativo" : "recusado",
                })
                .eq("id", solicitacao.id)
                .eq("grupo_id", grupoAberto.id);

            if (erroDecisao) throw erroDecisao;

            setSucesso(
                aprovar
                    ? "Jogador aprovado no grupo."
                    : "Solicitação recusada."
            );

            await carregarDetalhes(grupoAberto);
            await carregarGrupos(usuario.id, true);
        } catch (erroRecebido) {
            mostrarErro(erroRecebido);
        }
    }

    async function enviarMensagem(evento) {
        evento.preventDefault();

        const texto = novaMensagem.trim();

        if (!texto || !grupoAberto || !usuario?.id) return;

        limparAvisos();
        setEnviandoMensagem(true);

        try {
            const { error: erroEnvio } = await supabase
                .from("group_messages")
                .insert({
                    grupo_id: grupoAberto.id,
                    usuario_id: usuario.id,
                    autor_nome: nomeAtual,
                    mensagem: texto,
                });

            if (erroEnvio) throw erroEnvio;

            setNovaMensagem("");
            await carregarDetalhes(grupoAberto);
        } catch (erroRecebido) {
            mostrarErro(erroRecebido);
        } finally {
            setEnviandoMensagem(false);
        }
    }

    async function criarSessao(evento) {
        evento.preventDefault();
        limparAvisos();

        if (!tituloSessao.trim() || !dataSessao) {
            setErro("Informe o título e a data da sessão.");
            return;
        }

        const data = new Date(dataSessao);

        if (Number.isNaN(data.getTime()) || data <= new Date()) {
            setErro("Escolha uma data futura válida para a sessão.");
            return;
        }

        try {
            const { error: erroSessao } = await supabase
                .from("group_sessions")
                .insert({
                    grupo_id: grupoAberto.id,
                    titulo: tituloSessao.trim(),
                    descricao: descricaoSessao.trim(),
                    data_sessao: data.toISOString(),
                    criado_por: usuario.id,
                });

            if (erroSessao) throw erroSessao;

            setTituloSessao("");
            setDescricaoSessao("");
            setDataSessao("");
            setMostrarFormularioSessao(false);
            setSucesso("Sessão agendada com sucesso.");
            await carregarDetalhes(grupoAberto);
        } catch (erroRecebido) {
            mostrarErro(erroRecebido);
        }
    }

    async function excluirSessao(sessao) {
        if (!window.confirm(`Excluir a sessão "${sessao.titulo}"?`)) {
            return;
        }

        limparAvisos();

        try {
            const { error: erroExclusao } = await supabase
                .from("group_sessions")
                .delete()
                .eq("id", sessao.id)
                .eq("grupo_id", grupoAberto.id);

            if (erroExclusao) throw erroExclusao;

            setSucesso("Sessão excluída.");
            await carregarDetalhes(grupoAberto);
        } catch (erroRecebido) {
            mostrarErro(erroRecebido);
        }
    }

    async function copiarConvite() {
        if (!grupoAberto?.codigo_convite) return;

        try {
            await navigator.clipboard.writeText(
                grupoAberto.codigo_convite
            );
            setSucesso("Código do convite copiado.");
            setErro("");
        } catch {
            setErro(
                `Não foi possível copiar automaticamente. Código: ${grupoAberto.codigo_convite}`
            );
        }
    }

    async function entrarPorCodigo(evento) {
        evento.preventDefault();
        limparAvisos();

        const codigo = busca.trim().toUpperCase();

        if (!codigo) {
            setErro("Digite o código do convite no campo de busca.");
            return;
        }

        try {
            const { data: grupo, error: erroBusca } = await supabase
                .from("rpg_groups")
                .select("*")
                .eq("codigo_convite", codigo)
                .maybeSingle();

            if (erroBusca) throw erroBusca;

            if (!grupo) {
                setErro("Nenhum grupo foi encontrado com esse código.");
                return;
            }

            await solicitarEntrada(grupo);
        } catch (erroRecebido) {
            mostrarErro(erroRecebido);
        }
    }

    async function excluirGrupo() {
        if (!grupoAberto) return;

        const confirmar = window.confirm(
            `Tem certeza de que deseja excluir "${grupoAberto.nome}"? As mensagens e sessões também serão excluídas.`
        );

        if (!confirmar) return;

        limparAvisos();

        try {
            const { error: erroExclusao } = await supabase
                .from("rpg_groups")
                .delete()
                .eq("id", grupoAberto.id)
                .eq("responsavel_id", usuario.id);

            if (erroExclusao) throw erroExclusao;

            setGrupoAberto(null);
            setSucesso("Grupo excluído.");
            await carregarGrupos(usuario.id);
        } catch (erroRecebido) {
            mostrarErro(erroRecebido);
        }
    }

    const gruposVisiveis = grupos.filter((grupo) => {
        const termo = busca.trim().toLowerCase();

        const combinaBusca =
            !termo ||
            [
                grupo.nome,
                grupo.descricao,
                grupo.sistema,
                grupo.codigo_convite,
            ].some((valor) =>
                String(valor || "").toLowerCase().includes(termo)
            );

        if (!combinaBusca) return false;

        if (aba === "meus") {
            return (
                grupo.responsavel_id === usuario?.id ||
                grupo.minha_situacao === "ativo" ||
                grupo.minha_situacao === "pendente"
            );
        }

        return (
            grupo.publico &&
            grupo.responsavel_id !== usuario?.id &&
            grupo.minha_situacao !== "ativo"
        );
    });

    const totalMeusGrupos = grupos.filter(
        (grupo) =>
            grupo.responsavel_id === usuario?.id ||
            grupo.minha_situacao === "ativo"
    ).length;

    const totalSolicitacoes = grupos.filter(
        (grupo) => grupo.minha_situacao === "pendente"
    ).length;

    const souResponsavel =
        grupoAberto?.responsavel_id === usuario?.id;

    const souMembro =
        grupoAberto?.minha_situacao === "ativo" ||
        grupoAberto?.responsavel_id === usuario?.id;

    return (
        <PageBase
            title="Grupos"
            subtitle="Encontre jogadores, organize campanhas e compartilhe aventuras."
            icon={Users}
            onNavigate={onNavigate}
        >
            <div className="grupos-pagina">
                {erro && (
                    <div className="grupos-alerta grupos-alerta-erro" role="alert">
                        <span><AlertCircle size={17} /> {erro}</span>
                        <button type="button" onClick={() => setErro("")} aria-label="Fechar erro">
                            <X size={17} />
                        </button>
                    </div>
                )}

                {sucesso && (
                    <div className="grupos-alerta grupos-alerta-sucesso" role="status">
                        <span><Check size={17} /> {sucesso}</span>
                        <button type="button" onClick={() => setSucesso("")} aria-label="Fechar aviso">
                            <X size={17} />
                        </button>
                    </div>
                )}

                {grupoAberto ? (
                    <section className="grupos-detalhes">
                        <button
                            type="button"
                            className="grupos-botao grupos-botao-secundario"
                            onClick={() => {
                                setGrupoAberto(null);
                                setAbaDetalhe("chat");
                                limparAvisos();
                                carregarGrupos(usuario.id, true);
                            }}
                        >
                            <ArrowLeft size={17} />
                            Voltar aos grupos
                        </button>

                        <header className="grupos-detalhe-cabecalho">
                            <div className="grupos-emblema">
                                <Swords size={30} />
                            </div>

                            <div className="grupos-detalhe-titulo">
                                <span className="grupos-etiqueta">
                                    <Hash size={13} />
                                    {grupoAberto.sistema}
                                </span>
                                <h2>{grupoAberto.nome}</h2>
                                <p>
                                    {grupoAberto.descricao ||
                                        "Este grupo ainda não possui uma descrição."}
                                </p>
                                <small>
                                    <Crown size={14} />
                                    {souResponsavel
                                        ? "Você é o responsável"
                                        : "Grupo de jogadores"}
                                </small>
                            </div>
                        </header>

                        <div className="grupos-convite">
                            <div>
                                <UserPlus size={20} />
                                <div>
                                    <strong>Convide jogadores</strong>
                                    <span>
                                        Compartilhe este código para que outros jogadores solicitem entrada.
                                    </span>
                                </div>
                            </div>
                            <code>{grupoAberto.codigo_convite}</code>
                            <button
                                type="button"
                                className="grupos-botao grupos-botao-secundario"
                                onClick={copiarConvite}
                            >
                                <Copy size={16} />
                                Copiar
                            </button>
                        </div>

                        <nav className="grupos-abas-detalhe" aria-label="Seções do grupo">
                            {[
                                { id: "chat", label: "Chat", icon: MessageCircle },
                                { id: "membros", label: "Membros", icon: Users },
                                { id: "sessoes", label: "Sessões", icon: CalendarDays },
                            ].map((item) => {
                                const Icone = item.icon;

                                return (
                                    <button
                                        type="button"
                                        key={item.id}
                                        className={abaDetalhe === item.id ? "ativa" : ""}
                                        onClick={() => setAbaDetalhe(item.id)}
                                    >
                                        <Icone size={17} />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </nav>

                        {abaDetalhe === "chat" && (
                            <section className="grupos-painel">
                                <div className="grupos-painel-titulo">
                                    <div>
                                        <h3><MessageCircle size={19} /> Chat do grupo</h3>
                                        <p>Converse com os membros da sua aventura.</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="grupos-botao grupos-botao-secundario"
                                        onClick={() => carregarDetalhes(grupoAberto)}
                                    >
                                        <RefreshCw size={15} />
                                        Atualizar
                                    </button>
                                </div>

                                {!souMembro ? (
                                    <div className="grupos-vazio compacto">
                                        <ShieldCheck size={28} />
                                        <p>Você precisa ser aprovado como membro para acessar o chat.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grupos-mensagens" ref={mensagensRef}>
                                            {mensagens.length === 0 ? (
                                                <div className="grupos-vazio compacto">
                                                    <MessageCircle size={29} />
                                                    <p>Nenhuma mensagem ainda. Comece a conversa!</p>
                                                </div>
                                            ) : (
                                                mensagens.map((mensagem) => (
                                                    <article
                                                        key={mensagem.id}
                                                        className={`grupos-mensagem ${
                                                            mensagem.usuario_id === usuario?.id ? "minha" : ""
                                                        }`}
                                                    >
                                                        <div className="grupos-mensagem-topo">
                                                            <strong>
                                                                {mensagem.usuario_id === usuario?.id
                                                                    ? "Você"
                                                                    : mensagem.autor_nome}
                                                            </strong>
                                                            <time>{formatarDataHora(mensagem.criado_em)}</time>
                                                        </div>
                                                        <p>{mensagem.mensagem}</p>
                                                    </article>
                                                ))
                                            )}
                                        </div>

                                        <form className="grupos-chat-formulario" onSubmit={enviarMensagem}>
                                            <input
                                                value={novaMensagem}
                                                onChange={(evento) => setNovaMensagem(evento.target.value)}
                                                maxLength={2000}
                                                placeholder="Escreva uma mensagem..."
                                                aria-label="Mensagem"
                                                required
                                            />
                                            <button
                                                type="submit"
                                                className="grupos-botao grupos-botao-principal"
                                                disabled={enviandoMensagem || !novaMensagem.trim()}
                                                aria-label="Enviar mensagem"
                                            >
                                                {enviandoMensagem ? (
                                                    <LoaderCircle size={18} className="grupos-girando" />
                                                ) : (
                                                    <Send size={18} />
                                                )}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </section>
                        )}

                        {abaDetalhe === "membros" && (
                            <section className="grupos-painel">
                                <div className="grupos-painel-titulo">
                                    <div>
                                        <h3><Users size={19} /> Membros do grupo</h3>
                                        <p>{membros.length} participante(s) ativo(s).</p>
                                    </div>
                                </div>

                                <div className="grupos-lista-membros">
                                    {membros.map((membro) => (
                                        <article className="grupos-membro" key={membro.id}>
                                            <div className="grupos-avatar">
                                                {inicial(membro.apelido)}
                                            </div>
                                            <div className="grupos-membro-info">
                                                <strong>
                                                    {membro.usuario_id === usuario?.id
                                                        ? `${membro.apelido} (você)`
                                                        : membro.apelido}
                                                </strong>
                                                <span>
                                                    {membro.papel === "responsavel"
                                                        ? "Responsável pelo grupo"
                                                        : "Membro"}
                                                </span>
                                            </div>
                                            {membro.papel === "responsavel" && (
                                                <Crown className="grupos-coroa" size={19} />
                                            )}
                                        </article>
                                    ))}
                                </div>

                                {souResponsavel && (
                                    <div className="grupos-solicitacoes">
                                        <h3>
                                            <UserPlus size={18} />
                                            Solicitações de entrada
                                            <span>{solicitacoes.length}</span>
                                        </h3>

                                        {solicitacoes.length === 0 ? (
                                            <p className="grupos-texto-secundario">
                                                Não há solicitações pendentes.
                                            </p>
                                        ) : (
                                            solicitacoes.map((solicitacao) => (
                                                <article
                                                    className="grupos-solicitacao"
                                                    key={solicitacao.id}
                                                >
                                                    <div>
                                                        <strong>{solicitacao.apelido}</strong>
                                                        <small>
                                                            Solicitou em {formatarData(solicitacao.criado_em)}
                                                        </small>
                                                    </div>
                                                    <div className="grupos-solicitacao-acoes">
                                                        <button
                                                            type="button"
                                                            className="grupos-botao grupos-botao-principal"
                                                            onClick={() => decidirSolicitacao(solicitacao, true)}
                                                        >
                                                            <Check size={15} />
                                                            Aprovar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="grupos-botao grupos-botao-perigo"
                                                            onClick={() => decidirSolicitacao(solicitacao, false)}
                                                        >
                                                            <Ban size={15} />
                                                            Recusar
                                                        </button>
                                                    </div>
                                                </article>
                                            ))
                                        )}
                                    </div>
                                )}
                            </section>
                        )}

                        {abaDetalhe === "sessoes" && (
                            <section className="grupos-painel">
                                <div className="grupos-painel-titulo">
                                    <div>
                                        <h3><CalendarDays size={19} /> Sessões do grupo</h3>
                                        <p>Planeje os próximos encontros da campanha.</p>
                                    </div>

                                    {souResponsavel && (
                                        <button
                                            type="button"
                                            className="grupos-botao grupos-botao-principal"
                                            onClick={() => setMostrarFormularioSessao((atual) => !atual)}
                                        >
                                            {mostrarFormularioSessao ? <X size={17} /> : <Plus size={17} />}
                                            {mostrarFormularioSessao ? "Cancelar" : "Agendar sessão"}
                                        </button>
                                    )}
                                </div>

                                {mostrarFormularioSessao && souResponsavel && (
                                    <form className="grupos-formulario-sessao" onSubmit={criarSessao}>
                                        <label>
                                            Título da sessão *
                                            <input
                                                value={tituloSessao}
                                                onChange={(evento) => setTituloSessao(evento.target.value)}
                                                maxLength={100}
                                                placeholder="Ex.: O templo esquecido"
                                                required
                                            />
                                        </label>

                                        <label>
                                            Data e horário *
                                            <input
                                                type="datetime-local"
                                                value={dataSessao}
                                                onChange={(evento) => setDataSessao(evento.target.value)}
                                                min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                                                    .toISOString().slice(0, 16)}
                                                required
                                            />
                                        </label>

                                        <label>
                                            Descrição
                                            <textarea
                                                value={descricaoSessao}
                                                onChange={(evento) => setDescricaoSessao(evento.target.value)}
                                                rows={3}
                                                maxLength={1500}
                                                placeholder="Preparativos, local, missão..."
                                            />
                                        </label>

                                        <div>
                                            <button type="submit" className="grupos-botao grupos-botao-principal">
                                                <CalendarDays size={17} />
                                                Salvar sessão
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {sessoes.length === 0 ? (
                                    <div className="grupos-vazio compacto">
                                        <CalendarDays size={30} />
                                        <p>Nenhuma sessão agendada.</p>
                                    </div>
                                ) : (
                                    <div className="grupos-lista-sessoes">
                                        {sessoes.map((sessao) => (
                                            <article className="grupos-sessao" key={sessao.id}>
                                                <div className="grupos-sessao-icone">
                                                    <BookOpen size={21} />
                                                </div>
                                                <div className="grupos-sessao-info">
                                                    <h4>{sessao.titulo}</h4>
                                                    <span>
                                                        <Clock size={14} />
                                                        {formatarDataHora(sessao.data_sessao)}
                                                    </span>
                                                    {sessao.descricao && <p>{sessao.descricao}</p>}
                                                </div>
                                                {souResponsavel && (
                                                    <button
                                                        type="button"
                                                        className="grupos-icone-botao"
                                                        title="Excluir sessão"
                                                        aria-label={`Excluir sessão ${sessao.titulo}`}
                                                        onClick={() => excluirSessao(sessao)}
                                                    >
                                                        <Trash2 size={17} />
                                                    </button>
                                                )}
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {souResponsavel && (
                            <div className="grupos-acoes-perigo">
                                <button
                                    type="button"
                                    className="grupos-botao grupos-botao-perigo"
                                    onClick={excluirGrupo}
                                >
                                    <Trash2 size={17} />
                                    Excluir grupo
                                </button>
                            </div>
                        )}
                    </section>
                ) : (
                    <>
                        <header className="grupos-cabecalho">
                            <div>
                                <span className="grupos-etiqueta">
                                    <Globe size={14} />
                                    CENTRAL DE JOGADORES
                                </span>
                                <h2>Encontre seu próximo grupo</h2>
                                <p>
                                    Reúna aventureiros, compartilhe ideias e organize suas sessões de RPG.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="grupos-botao grupos-botao-principal"
                                onClick={() => {
                                    limparAvisos();
                                    setModalCriacao(true);
                                }}
                            >
                                <Plus size={18} />
                                Criar grupo
                            </button>
                        </header>

                        <div className="grupos-estatisticas">
                            <article>
                                <Users size={22} />
                                <div>
                                    <span>Meus grupos</span>
                                    <strong>{totalMeusGrupos}</strong>
                                </div>
                            </article>
                            <article>
                                <UserPlus size={22} />
                                <div>
                                    <span>Solicitações enviadas</span>
                                    <strong>{totalSolicitacoes}</strong>
                                </div>
                            </article>
                            <article>
                                <Crown size={22} />
                                <div>
                                    <span>Minha conta</span>
                                    <strong className="grupos-estatistica-nome">
                                        {nomeAtual}
                                    </strong>
                                </div>
                            </article>
                        </div>

                        <form className="grupos-convite-busca" onSubmit={entrarPorCodigo}>
                            <label>
                                <Hash size={18} />
                                <input
                                    value={busca}
                                    onChange={(evento) => setBusca(evento.target.value)}
                                    placeholder="Busque grupos ou digite um código de convite..."
                                    aria-label="Buscar grupos ou código de convite"
                                />
                            </label>
                            <button type="submit" className="grupos-botao grupos-botao-secundario">
                                <UserPlus size={17} />
                                Usar código
                            </button>
                        </form>

                        <div className="grupos-ferramentas">
                            <nav className="grupos-abas" aria-label="Categorias de grupos">
                                {ABAS.map((item) => {
                                    const Icone = item.icon;

                                    return (
                                        <button
                                            type="button"
                                            key={item.id}
                                            className={aba === item.id ? "ativa" : ""}
                                            onClick={() => setAba(item.id)}
                                        >
                                            <Icone size={16} />
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </nav>

                            <div className="grupos-busca">
                                <Search size={17} />
                                <input
                                    value={busca}
                                    onChange={(evento) => setBusca(evento.target.value)}
                                    placeholder="Filtrar grupos..."
                                    aria-label="Filtrar grupos"
                                />
                            </div>
                        </div>

                        {carregando ? (
                            <div className="grupos-estado">
                                <LoaderCircle size={32} className="grupos-girando" />
                                <p>Carregando grupos...</p>
                            </div>
                        ) : gruposVisiveis.length > 0 ? (
                            <div className="grupos-grade">
                                {gruposVisiveis.map((grupo) => (
                                    <article className="grupos-card" key={grupo.id}>
                                        <div className="grupos-card-capa">
                                            <div className="grupos-emblema">
                                                <Swords size={29} />
                                            </div>
                                            <span>{grupo.sistema}</span>
                                        </div>

                                        <div className="grupos-card-conteudo">
                                            <div className="grupos-card-responsavel">
                                                <Crown size={14} />
                                                {grupo.responsavel_id === usuario?.id
                                                    ? "Você é o responsável"
                                                    : "Grupo de RPG"}
                                            </div>

                                            <h3>{grupo.nome}</h3>
                                            <p>
                                                {grupo.descricao ||
                                                    "Este grupo ainda não possui uma descrição."}
                                            </p>

                                            <div className="grupos-card-data">
                                                <CalendarDays size={14} />
                                                Criado em {formatarData(grupo.criado_em)}
                                            </div>

                                            <div className="grupos-card-rodape">
                                                {grupo.responsavel_id === usuario?.id ||
                                                grupo.minha_situacao === "ativo" ? (
                                                    <button
                                                        type="button"
                                                        className="grupos-botao grupos-botao-principal"
                                                        onClick={() => {
                                                            limparAvisos();
                                                            setGrupoAberto(grupo);
                                                            setAbaDetalhe("chat");
                                                        }}
                                                    >
                                                        Abrir grupo
                                                        <ArrowLeft size={16} style={{ transform: "rotate(180deg)" }} />
                                                    </button>
                                                ) : grupo.minha_situacao === "pendente" ? (
                                                    <button
                                                        type="button"
                                                        className="grupos-botao"
                                                        disabled
                                                    >
                                                        <Clock size={16} />
                                                        Solicitação pendente
                                                    </button>
                                                ) : grupo.minha_situacao === "recusado" ? (
                                                    <button
                                                        type="button"
                                                        className="grupos-botao grupos-botao-secundario"
                                                        onClick={() => solicitarEntrada(grupo)}
                                                    >
                                                        Solicitar novamente
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="grupos-botao grupos-botao-principal"
                                                        onClick={() => solicitarEntrada(grupo)}
                                                    >
                                                        <UserPlus size={16} />
                                                        Solicitar entrada
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="grupos-vazio">
                                <div className="grupos-vazio-icone">
                                    {aba === "meus" ? <Users size={33} /> : <Search size={33} />}
                                </div>
                                <h3>
                                    {aba === "meus"
                                        ? "Você ainda não tem grupos"
                                        : "Nenhum grupo encontrado"}
                                </h3>
                                <p>
                                    {aba === "meus"
                                        ? "Crie seu primeiro grupo ou explore os grupos disponíveis para encontrar jogadores."
                                        : "Tente outro termo de busca ou crie um grupo novo."}
                                </p>
                                <button
                                    type="button"
                                    className="grupos-botao grupos-botao-principal"
                                    onClick={() => {
                                        setAba("explorar");
                                        setBusca("");
                                    }}
                                >
                                    <Search size={17} />
                                    Explorar grupos
                                </button>
                            </div>
                        )}

                        <div className="grupos-atualizar">
                            <button
                                type="button"
                                className="grupos-botao grupos-botao-secundario"
                                disabled={atualizando || !usuario?.id}
                                onClick={() => carregarGrupos(usuario.id, true)}
                            >
                                <RefreshCw
                                    size={16}
                                    className={atualizando ? "grupos-girando" : ""}
                                />
                                Atualizar lista
                            </button>
                        </div>
                    </>
                )}

                {modalCriacao && (
                    <div
                        className="grupos-modal-fundo"
                        onMouseDown={(evento) => {
                            if (evento.target === evento.currentTarget) {
                                setModalCriacao(false);
                            }
                        }}
                    >
                        <section
                            className="grupos-modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="grupos-modal-titulo"
                        >
                            <header className="grupos-modal-cabecalho">
                                <div>
                                    <span className="grupos-etiqueta">
                                        <Swords size={14} />
                                        CRIE SUA MESA
                                    </span>
                                    <h2 id="grupos-modal-titulo">Novo grupo</h2>
                                    <p>
                                        Configure o grupo e convide seus amigos para a aventura.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="grupos-icone-botao"
                                    aria-label="Fechar"
                                    onClick={() => setModalCriacao(false)}
                                >
                                    <X size={20} />
                                </button>
                            </header>

                            <form className="grupos-formulario" onSubmit={criarGrupo}>
                                <label>
                                    Nome do grupo *
                                    <input
                                        value={nomeGrupo}
                                        onChange={(evento) => setNomeGrupo(evento.target.value)}
                                        maxLength={80}
                                        minLength={2}
                                        placeholder="Ex.: A Ordem dos Corvos"
                                        autoFocus
                                        required
                                    />
                                </label>

                                <label>
                                    Sistema de RPG
                                    <select
                                        value={sistemaGrupo}
                                        onChange={(evento) => setSistemaGrupo(evento.target.value)}
                                    >
                                        {SISTEMAS.map((sistema) => (
                                            <option key={sistema} value={sistema}>
                                                {sistema}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label>
                                    Descrição
                                    <textarea
                                        value={descricaoGrupo}
                                        onChange={(evento) => setDescricaoGrupo(evento.target.value)}
                                        maxLength={1500}
                                        rows={4}
                                        placeholder="Conte sobre a proposta do grupo, o estilo de jogo e os jogadores que procura..."
                                    />
                                </label>

                                <div className="grupos-formulario-nota">
                                    <ShieldCheck size={18} />
                                    <span>
                                        Você será o responsável pelo grupo. Os jogadores poderão encontrá-lo e solicitar entrada. Somente membros aprovados poderão acessar o chat e as sessões.
                                    </span>
                                </div>

                                <footer className="grupos-acoes-formulario">
                                    <button
                                        type="button"
                                        className="grupos-botao grupos-botao-secundario"
                                        onClick={() => setModalCriacao(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="grupos-botao grupos-botao-principal"
                                        disabled={atualizando}
                                    >
                                        {atualizando ? (
                                            <LoaderCircle size={17} className="grupos-girando" />
                                        ) : (
                                            <Plus size={18} />
                                        )}
                                        Criar grupo
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
