
import { useCallback, useEffect, useState } from "react";
import {
    Users,
    Plus,
    Search,
    Crown,
    MessageCircle,
    CalendarDays,
    UserPlus,
    LogOut,
    Trash2,
    Send,
    Copy,
    RefreshCw,
    ShieldCheck,
    Swords,
    X,
    Clock,
    LoaderCircle,
    Hash,
} from "lucide-react";

import PageBase from "../PageBase";
import { useUser } from "../../context/UserContext";
import { supabase, supabaseConfigured } from "../../lib/supabase";
import "./Grupos.css";

const SISTEMAS = [
    "D&D 5ª Edição",
    "Ordem Paranormal",
    "Tormenta20",
    "Call of Cthulhu",
    "Sistema próprio",
    "Outro",
];

function nomeDoUsuario(user) {
    return (
        user?.name?.trim() ||
        user?.username?.trim() ||
        user?.email?.split("@")[0] ||
        "RPGista"
    );
}

function gerarCodigoConvite() {
    return (
        Math.random().toString(36).slice(2, 6) +
        Math.random().toString(36).slice(2, 6)
    ).toUpperCase();
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

export default function Grupos({ onNavigate }) {
    const { user } = useUser();
    const displayName = nomeDoUsuario(user);

    const [uid, setUid] = useState(null);
    const [inicializando, setInicializando] = useState(true);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const [aviso, setAviso] = useState("");

    const [grupos, setGrupos] = useState([]);
    const [busca, setBusca] = useState("");
    const [aba, setAba] = useState("descobrir");
    const [grupoSelecionado, setGrupoSelecionado] = useState(null);

    const [membros, setMembros] = useState([]);
    const [mensagens, setMensagens] = useState([]);
    const [sessoes, setSessoes] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [enviandoMensagem, setEnviandoMensagem] = useState(false);

    const [mostrarCriacao, setMostrarCriacao] = useState(false);
    const [nomeGrupo, setNomeGrupo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [sistema, setSistema] = useState("D&D 5ª Edição");
    const [criandoGrupo, setCriandoGrupo] = useState(false);

    const [codigoConvite, setCodigoConvite] = useState("");

    const [tituloSessao, setTituloSessao] = useState("");
    const [descricaoSessao, setDescricaoSessao] = useState("");
    const [dataSessao, setDataSessao] = useState("");
    const [mostraFormularioSessao, setMostraFormularioSessao] =
        useState(false);

    const [abaDetalhes, setAbaDetalhes] = useState("chat");

    // Inicializa uma identidade do Supabase neste navegador.
    useEffect(() => {
        let ativo = true;

        async function inicializar() {
            if (!supabaseConfigured || !supabase) {
                setErro(
                    "Supabase não configurado. Confira o arquivo .env.local e reinicie o Vite."
                );
                setInicializando(false);
                return;
            }

            try {
                const { data, error: erroSessao } =
                    await supabase.auth.getSession();

                if (erroSessao) throw erroSessao;

                let sessao = data.session;

                if (!sessao) {
                    const { data: anonData, error: anonError } =
                        await supabase.auth.signInAnonymously();

                    if (anonError) throw anonError;

                    sessao = anonData.session;
                }

                if (!sessao?.user?.id) {
                    throw new Error(
                        "Não foi possível iniciar sua sessão no Supabase."
                    );
                }

                if (ativo) {
                    setUid(sessao.user.id);
                    setErro("");
                }
            } catch (error) {
                if (ativo) {
                    setErro(
                        error.message ||
                        "Não foi possível conectar ao Supabase. Verifique a configuração de autenticação anônima."
                    );
                }
            } finally {
                if (ativo) setInicializando(false);
            }
        }

        inicializar();

        return () => {
            ativo = false;
        };
    }, []);

    const carregarGrupos = useCallback(async () => {
        if (!supabase || !uid) return;

        setCarregando(true);

        try {
            const [
                { data: gruposData, error: gruposError },
                { data: membrosProprios, error: membrosError },
            ] = await Promise.all([
                supabase
                    .from("rpg_groups")
                    .select("*")
                    .order("created_at", { ascending: false }),
                supabase
                    .from("group_members")
                    .select("group_id, status, role")
                    .eq("user_id", uid),
            ]);

            if (gruposError) throw gruposError;
            if (membrosError) throw membrosError;

            const participacoes = new Map(
                (membrosProprios || []).map((item) => [
                    item.group_id,
                    item,
                ])
            );

            setGrupos(
                (gruposData || []).map((grupo) => ({
                    ...grupo,
                    minhaParticipacao:
                        participacoes.get(grupo.id) || null,
                }))
            );
        } catch (error) {
            setErro(
                error.message ||
                "Não foi possível carregar os grupos."
            );
        } finally {
            setCarregando(false);
        }
    }, [uid]);

    useEffect(() => {
        if (uid) carregarGrupos();
    }, [uid, carregarGrupos]);

    const carregarDetalhes = useCallback(async (grupoId) => {
        if (!supabase || !grupoId) return;

        try {
            const [
                { data: membrosData, error: membrosError },
                { data: mensagensData, error: mensagensError },
                { data: sessoesData, error: sessoesError },
            ] = await Promise.all([
                supabase
                    .from("group_members")
                    .select("*")
                    .eq("group_id", grupoId)
                    .order("created_at", { ascending: true }),
                supabase
                    .from("group_messages")
                    .select("*")
                    .eq("group_id", grupoId)
                    .order("created_at", { ascending: true })
                    .limit(200),
                supabase
                    .from("group_sessions")
                    .select("*")
                    .eq("group_id", grupoId)
                    .order("starts_at", { ascending: true }),
            ]);

            if (membrosError) throw membrosError;
            if (mensagensError) throw mensagensError;
            if (sessoesError) throw sessoesError;

            setMembros(membrosData || []);
            setMensagens(mensagensData || []);
            setSessoes(sessoesData || []);
        } catch (error) {
            setErro(
                error.message ||
                "Não foi possível carregar os detalhes do grupo."
            );
        }
    }, []);

    useEffect(() => {
        if (!grupoSelecionado?.id || !uid) return;

        carregarDetalhes(grupoSelecionado.id);

        const canal = supabase
            .channel(`grupo-${grupoSelecionado.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "group_messages",
                    filter: `group_id=eq.${grupoSelecionado.id}`,
                },
                () => carregarDetalhes(grupoSelecionado.id)
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "group_members",
                    filter: `group_id=eq.${grupoSelecionado.id}`,
                },
                () => {
                    carregarDetalhes(grupoSelecionado.id);
                    carregarGrupos();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(canal);
        };
    }, [
        grupoSelecionado?.id,
        uid,
        carregarDetalhes,
        carregarGrupos,
    ]);

    function limparFeedback() {
        setErro("");
        setAviso("");
    }

    async function criarGrupo(evento) {
        evento.preventDefault();
        limparFeedback();

        if (!uid || !supabase) return;

        const nome = nomeGrupo.trim();

        if (nome.length < 3) {
            setErro("O nome do grupo precisa ter pelo menos 3 caracteres.");
            return;
        }

        setCriandoGrupo(true);

        try {
            const { data: novoGrupo, error: grupoError } = await supabase
                .from("rpg_groups")
                .insert({
                    name: nome,
                    description: descricao.trim(),
                    system_name: sistema,
                    owner_id: uid,
                    owner_name: displayName,
                    invite_code: gerarCodigoConvite(),
                    is_public: true,
                })
                .select()
                .single();

            if (grupoError) throw grupoError;

            const { error: membroError } = await supabase
                .from("group_members")
                .insert({
                    group_id: novoGrupo.id,
                    user_id: uid,
                    display_name: displayName,
                    role: "owner",
                    status: "active",
                });

            if (membroError) {
                // O grupo já foi criado. Excluí-lo aqui evita um grupo
                // sem a associação de seu responsável.
                await supabase
                    .from("rpg_groups")
                    .delete()
                    .eq("id", novoGrupo.id);

                throw membroError;
            }

            setNomeGrupo("");
            setDescricao("");
            setSistema("D&D 5ª Edição");
            setMostrarCriacao(false);
            setAba("meus");
            setAviso("Grupo criado com sucesso!");

            await carregarGrupos();

            setGrupoSelecionado({
                ...novoGrupo,
                minhaParticipacao: {
                    status: "active",
                    role: "owner",
                },
            });
            setAbaDetalhes("chat");
        } catch (error) {
            setErro(
                error.message ||
                "Não foi possível criar o grupo."
            );
        } finally {
            setCriandoGrupo(false);
        }
    }

    async function solicitarEntrada(grupo) {
        limparFeedback();

        if (!supabase || !uid) return;

        if (grupo.owner_id === uid) {
            setAviso("Você já é o responsável por este grupo.");
            return;
        }

        if (grupo.minhaParticipacao) {
            setAviso(
                grupo.minhaParticipacao.status === "active"
                    ? "Você já participa deste grupo."
                    : "Sua solicitação já está pendente."
            );
            return;
        }

        try {
            const { error } = await supabase
                .from("group_members")
                .insert({
                    group_id: grupo.id,
                    user_id: uid,
                    display_name: displayName,
                    role: "member",
                    status: "pending",
                });

            if (error) throw error;

            setAviso("Solicitação enviada ao responsável do grupo.");
            await carregarGrupos();
        } catch (error) {
            setErro(
                error.code === "23505"
                    ? "Você já solicitou ou já participa deste grupo."
                    : error.message ||
                      "Não foi possível solicitar entrada."
            );
        }
    }

    async function entrarPorCodigo(evento) {
        evento.preventDefault();
        limparFeedback();

        const codigo = codigoConvite.trim().toUpperCase();

        if (!codigo || !supabase) {
            setErro("Digite o código de convite.");
            return;
        }

        try {
            const { data: grupo, error } = await supabase
                .from("rpg_groups")
                .select("*")
                .eq("invite_code", codigo)
                .eq("is_public", true)
                .maybeSingle();

            if (error) throw error;

            if (!grupo) {
                setErro("Não encontramos um grupo com esse código.");
                return;
            }

            setCodigoConvite("");
            await solicitarEntrada({
                ...grupo,
                minhaParticipacao: null,
            });
        } catch (error) {
            setErro(
                error.message ||
                "Não foi possível validar o convite."
            );
        }
    }

    async function aprovarMembro(membro) {
        limparFeedback();

        if (!supabase || !grupoSelecionado) return;

        try {
            const { error } = await supabase
                .from("group_members")
                .update({ status: "active" })
                .eq("id", membro.id)
                .eq("group_id", grupoSelecionado.id);

            if (error) throw error;

            setAviso(`${membro.display_name} agora participa do grupo.`);
            await carregarDetalhes(grupoSelecionado.id);
            await carregarGrupos();
        } catch (error) {
            setErro(
                error.message ||
                "Não foi possível aprovar a solicitação."
            );
        }
    }

    async function recusarMembro(membro) {
        if (!supabase || !grupoSelecionado) return;

        const confirmar = window.confirm(
            `Deseja recusar a solicitação de ${membro.display_name}?`
        );

        if (!confirmar) return;

        limparFeedback();

        try {
            const { error } = await supabase
                .from("group_members")
                .delete()
                .eq("id", membro.id)
                .eq("group_id", grupoSelecionado.id);

            if (error) throw error;

            await carregarDetalhes(grupoSelecionado.id);
            await carregarGrupos();
        } catch (error) {
            setErro(
                error.message ||
                "Não foi possível remover a solicitação."
            );
        }
    }

    async function enviarMensagem(evento) {
        evento.preventDefault();

        const conteudo = mensagem.trim();

        if (
            !conteudo ||
            !uid ||
            !supabase ||
            !grupoSelecionado ||
            enviandoMensagem
        ) {
            return;
        }

        setEnviandoMensagem(true);
        limparFeedback();

        try {
            const { error } = await supabase
                .from("group_messages")
                .insert({
                    group_id: grupoSelecionado.id,
                    user_id: uid,
                    display_name: displayName,
                    content: conteudo,
                });

            if (error) throw error;

            setMensagem("");
            await carregarDetalhes(grupoSelecionado.id);
        } catch (error) {
            setErro(
                error.message ||
                "Não foi possível enviar a mensagem."
            );
        } finally {
            setEnviandoMensagem(false);
        }
    }

    async function criarSessao(evento) {
        evento.preventDefault();
        limparFeedback();

        if (!supabase || !uid || !grupoSelecionado) return;

        if (!tituloSessao.trim() || !dataSessao) {
            setErro("Informe o título e a data da sessão.");
            return;
        }

        const inicio = new Date(dataSessao);

        if (Number.isNaN(inicio.getTime()) || inicio <= new Date()) {
            setErro("Escolha uma data e um horário futuros.");
            return;
        }

        try {
            const { error } = await supabase
                .from("group_sessions")
                .insert({
                    group_id: grupoSelecionado.id,
                    created_by: uid,
                    title: tituloSessao.trim(),
                    description: descricaoSessao.trim(),
                    starts_at: inicio.toISOString(),
                });

            if (error) throw error;

            setTituloSessao("");
            setDescricaoSessao("");
            setDataSessao("");
            setMostraFormularioSessao(false);

            await carregarDetalhes(grupoSelecionado.id);
            setAviso("Sessão agendada com sucesso!");
        } catch (error) {
            setErro(
                error.message ||
                "Não foi possível agendar a sessão."
            );
        }
    }

    async function excluirSessao(sessao) {
        if (!supabase || !grupoSelecionado) return;

        const confirmar = window.confirm(
            `Excluir a sessão "${sessao.title}"?`
        );

        if (!confirmar) return;

        try {
            const { error } = await supabase
                .from("group_sessions")
                .delete()
                .eq("id", sessao.id);

            if (error) throw error;

            await carregarDetalhes(grupoSelecionado.id);
        } catch (error) {
            setErro(
                error.message ||
                "Não foi possível excluir a sessão."
            );
        }
    }

    async function sairDoGrupo() {
        if (!supabase || !uid || !grupoSelecionado) return;

        if (grupoSelecionado.owner_id === uid) {
            setErro(
                "O responsável não pode sair do próprio grupo. Exclua o grupo se realmente desejar encerrá-lo."
            );
            return;
        }

        if (
            !window.confirm(
                `Deseja sair do grupo "${grupoSelecionado.name}"?`
            )
        ) {
            return;
        }

        try {
            const { error } = await supabase
                .from("group_members")
                .delete()
                .eq("group_id", grupoSelecionado.id)
                .eq("user_id", uid);

            if (error) throw error;

            setGrupoSelecionado(null);
            setMembros([]);
            setMensagens([]);
            setSessoes([]);
            setAviso("Você saiu do grupo.");
            await carregarGrupos();
        } catch (error) {
            setErro(
                error.message ||
                "Não foi possível sair do grupo."
            );
        }
    }

    async function excluirGrupo() {
        if (!supabase || !grupoSelecionado) return;

        if (
            !window.confirm(
                `Excluir permanentemente o grupo "${grupoSelecionado.name}" e seus dados?`
            )
        ) {
            return;
        }

        try {
            const { error } = await supabase
                .from("rpg_groups")
                .delete()
                .eq("id", grupoSelecionado.id);

            if (error) throw error;

            setGrupoSelecionado(null);
            setMembros([]);
            setMensagens([]);
            setSessoes([]);
            setAviso("Grupo excluído.");
            await carregarGrupos();
        } catch (error) {
            setErro(
                error.message ||
                "Não foi possível excluir o grupo."
            );
        }
    }

    async function copiarConvite() {
        if (!grupoSelecionado) return;

        try {
            await navigator.clipboard.writeText(
                grupoSelecionado.invite_code
            );
            setAviso("Código de convite copiado!");
        } catch {
            setAviso(
                `Código de convite: ${grupoSelecionado.invite_code}`
            );
        }
    }

    const meusGrupos = grupos.filter(
        (grupo) =>
            grupo.owner_id === uid ||
            grupo.minhaParticipacao?.status === "active"
    );

    const gruposFiltrados = (
        aba === "meus" ? meusGrupos : grupos
    ).filter((grupo) => {
        const termo = busca.trim().toLowerCase();

        if (!termo) return true;

        return [
            grupo.name,
            grupo.description,
            grupo.system_name,
            grupo.owner_name,
        ].some((valor) =>
            String(valor || "").toLowerCase().includes(termo)
        );
    });

    const souResponsavel =
        Boolean(grupoSelecionado && grupoSelecionado.owner_id === uid);

    const minhasSolicitacoes = membros.filter(
        (membro) => membro.status === "pending"
    );

    if (inicializando) {
        return (
            <PageBase
                title="Grupos"
                subtitle="Encontre jogadores e organize aventuras."
                icon={Users}
                onNavigate={onNavigate}
            >
                <div className="grupos-estado">
                    <LoaderCircle className="grupos-girando" size={28} />
                    <p>Conectando aos grupos...</p>
                </div>
            </PageBase>
        );
    }

    if (!supabaseConfigured || !uid) {
        return (
            <PageBase
                title="Grupos"
                subtitle="Encontre jogadores e organize aventuras."
                icon={Users}
                onNavigate={onNavigate}
            >
                <div className="grupos-estado grupos-estado-erro">
                    <Users size={38} />
                    <h2>Não foi possível conectar</h2>
                    <p>{erro || "Verifique as configurações do Supabase."}</p>
                    <button
                        className="grupos-botao grupos-botao-principal"
                        onClick={() => window.location.reload()}
                        type="button"
                    >
                        <RefreshCw size={17} />
                        Tentar novamente
                    </button>
                </div>
            </PageBase>
        );
    }

    return (
        <PageBase
            title="Grupos"
            subtitle="Encontre jogadores, reúna sua equipe e organize aventuras."
            icon={Users}
            onNavigate={onNavigate}
        >
            <div className="grupos-pagina">
                {erro && (
                    <div className="grupos-alerta grupos-alerta-erro" role="alert">
                        <span>{erro}</span>
                        <button
                            type="button"
                            onClick={() => setErro("")}
                            aria-label="Fechar aviso"
                        >
                            <X size={17} />
                        </button>
                    </div>
                )}

                {aviso && (
                    <div className="grupos-alerta grupos-alerta-sucesso" role="status">
                        <span>{aviso}</span>
                        <button
                            type="button"
                            onClick={() => setAviso("")}
                            aria-label="Fechar aviso"
                        >
                            <X size={17} />
                        </button>
                    </div>
                )}

                {grupoSelecionado ? (
                    <section className="grupos-detalhes">
                        <button
                            type="button"
                            className="grupos-botao grupos-botao-secundario"
                            onClick={() => {
                                setGrupoSelecionado(null);
                                setMembros([]);
                                setMensagens([]);
                                setSessoes([]);
                                limparFeedback();
                            }}
                        >
                            ← Voltar aos grupos
                        </button>

                        <header className="grupos-detalhe-cabecalho">
                            <div className="grupos-emblema">
                                <Swords size={32} />
                            </div>

                            <div className="grupos-detalhe-titulo">
                                <span className="grupos-etiqueta">
                                    {grupoSelecionado.system_name}
                                </span>
                                <h2>{grupoSelecionado.name}</h2>
                                <p>
                                    {grupoSelecionado.description ||
                                        "Este grupo ainda não possui uma descrição."}
                                </p>
                                <small>
                                    <Crown size={14} />
                                    Responsável: {grupoSelecionado.owner_name}
                                </small>
                            </div>
                        </header>

                        <div className="grupos-convite">
                            <div>
                                <Hash size={19} />
                                <div>
                                    <strong>Código de convite</strong>
                                    <span>
                                        Compartilhe com jogadores que desejam solicitar entrada.
                                    </span>
                                </div>
                            </div>

                            <code>{grupoSelecionado.invite_code}</code>

                            <button
                                type="button"
                                className="grupos-botao grupos-botao-secundario"
                                onClick={copiarConvite}
                            >
                                <Copy size={16} />
                                Copiar
                            </button>
                        </div>

                        <nav className="grupos-abas-detalhe">
                            <button
                                type="button"
                                className={abaDetalhes === "chat" ? "ativa" : ""}
                                onClick={() => setAbaDetalhes("chat")}
                            >
                                <MessageCircle size={17} />
                                Chat
                            </button>
                            <button
                                type="button"
                                className={abaDetalhes === "membros" ? "ativa" : ""}
                                onClick={() => setAbaDetalhes("membros")}
                            >
                                <Users size={17} />
                                Membros ({membros.filter((m) => m.status === "active").length})
                            </button>
                            <button
                                type="button"
                                className={abaDetalhes === "sessoes" ? "ativa" : ""}
                                onClick={() => setAbaDetalhes("sessoes")}
                            >
                                <CalendarDays size={17} />
                                Sessões
                            </button>
                        </nav>

                        {abaDetalhes === "chat" && (
                            <section className="grupos-painel grupos-chat">
                                <div className="grupos-painel-titulo">
                                    <div>
                                        <h3>
                                            <MessageCircle size={19} />
                                            Conversa do grupo
                                        </h3>
                                        <p>Mensagens compartilhadas entre os membros.</p>
                                    </div>
                                </div>

                                <div className="grupos-mensagens" aria-live="polite">
                                    {mensagens.length ? (
                                        mensagens.map((item) => (
                                            <article
                                                className={`grupos-mensagem ${
                                                    item.user_id === uid ? "minha" : ""
                                                }`}
                                                key={item.id}
                                            >
                                                <div className="grupos-mensagem-topo">
                                                    <strong>
                                                        {item.display_name}
                                                        {item.user_id === grupoSelecionado.owner_id && (
                                                            <Crown size={13} />
                                                        )}
                                                    </strong>
                                                    <time>
                                                        {new Date(item.created_at).toLocaleString(
                                                            "pt-BR",
                                                            {
                                                                day: "2-digit",
                                                                month: "2-digit",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                    </time>
                                                </div>
                                                <p>{item.content}</p>
                                            </article>
                                        ))
                                    ) : (
                                        <div className="grupos-vazio compacto">
                                            <MessageCircle size={29} />
                                            <p>O chat está vazio. Envie a primeira mensagem!</p>
                                        </div>
                                    )}
                                </div>

                                <form
                                    className="grupos-chat-formulario"
                                    onSubmit={enviarMensagem}
                                >
                                    <input
                                        type="text"
                                        value={mensagem}
                                        onChange={(evento) => setMensagem(evento.target.value)}
                                        placeholder="Escreva uma mensagem..."
                                        maxLength={2000}
                                        aria-label="Mensagem"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={!mensagem.trim() || enviandoMensagem}
                                        aria-label="Enviar mensagem"
                                        className="grupos-botao grupos-botao-principal"
                                    >
                                        <Send size={17} />
                                    </button>
                                </form>
                            </section>
                        )}

                        {abaDetalhes === "membros" && (
                            <section className="grupos-painel">
                                <div className="grupos-painel-titulo">
                                    <div>
                                        <h3>
                                            <Users size={19} />
                                            Equipe de aventureiros
                                        </h3>
                                        <p>Jogadores que fazem parte deste grupo.</p>
                                    </div>
                                </div>

                                <div className="grupos-lista-membros">
                                    {membros
                                        .filter((membro) => membro.status === "active")
                                        .map((membro) => (
                                            <article className="grupos-membro" key={membro.id}>
                                                <div className="grupos-avatar">
                                                    {membro.display_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="grupos-membro-info">
                                                    <strong>{membro.display_name}</strong>
                                                    <span>
                                                        {membro.role === "owner"
                                                            ? "Responsável pelo grupo"
                                                            : "Membro"}
                                                    </span>
                                                </div>
                                                {membro.role === "owner" && (
                                                    <Crown className="grupos-coroa" size={18} />
                                                )}
                                            </article>
                                        ))}
                                </div>

                                {souResponsavel && (
                                    <div className="grupos-solicitacoes">
                                        <h3>
                                            <UserPlus size={18} />
                                            Solicitações de entrada
                                            <span>{minhasSolicitacoes.length}</span>
                                        </h3>

                                        {minhasSolicitacoes.length ? (
                                            minhasSolicitacoes.map((membro) => (
                                                <article
                                                    className="grupos-solicitacao"
                                                    key={membro.id}
                                                >
                                                    <div>
                                                        <strong>{membro.display_name}</strong>
                                                        <small>
                                                            Solicitou entrada em{" "}
                                                            {formatarData(membro.created_at)}
                                                        </small>
                                                    </div>
                                                    <div className="grupos-solicitacao-acoes">
                                                        <button
                                                            type="button"
                                                            className="grupos-botao grupos-botao-principal"
                                                            onClick={() => aprovarMembro(membro)}
                                                        >
                                                            Aprovar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="grupos-botao grupos-botao-secundario"
                                                            onClick={() => recusarMembro(membro)}
                                                        >
                                                            Recusar
                                                        </button>
                                                    </div>
                                                </article>
                                            ))
                                        ) : (
                                            <p className="grupos-texto-secundario">
                                                Nenhuma solicitação pendente.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </section>
                        )}

                        {abaDetalhes === "sessoes" && (
                            <section className="grupos-painel">
                                <div className="grupos-painel-titulo">
                                    <div>
                                        <h3>
                                            <CalendarDays size={19} />
                                            Sessões da campanha
                                        </h3>
                                        <p>Planeje os próximos encontros do grupo.</p>
                                    </div>

                                    <button
                                        type="button"
                                        className="grupos-botao grupos-botao-principal"
                                        onClick={() =>
                                            setMostraFormularioSessao((valor) => !valor)
                                        }
                                    >
                                        <Plus size={17} />
                                        Agendar sessão
                                    </button>
                                </div>

                                {mostraFormularioSessao && (
                                    <form
                                        className="grupos-formulario-sessao"
                                        onSubmit={criarSessao}
                                    >
                                        <label>
                                            Título da sessão
                                            <input
                                                value={tituloSessao}
                                                onChange={(e) => setTituloSessao(e.target.value)}
                                                maxLength={100}
                                                placeholder="Ex.: O templo perdido"
                                                required
                                            />
                                        </label>
                                        <label>
                                            Data e horário
                                            <input
                                                type="datetime-local"
                                                value={dataSessao}
                                                onChange={(e) => setDataSessao(e.target.value)}
                                                required
                                            />
                                        </label>
                                        <label>
                                            Descrição (opcional)
                                            <textarea
                                                rows={3}
                                                value={descricaoSessao}
                                                onChange={(e) =>
                                                    setDescricaoSessao(e.target.value)
                                                }
                                                placeholder="Prepare os detalhes do encontro..."
                                            />
                                        </label>
                                        <div className="grupos-acoes-formulario">
                                            <button
                                                type="button"
                                                className="grupos-botao grupos-botao-secundario"
                                                onClick={() => setMostraFormularioSessao(false)}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="grupos-botao grupos-botao-principal"
                                            >
                                                Salvar sessão
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {sessoes.length ? (
                                    <div className="grupos-lista-sessoes">
                                        {sessoes.map((sessao) => (
                                            <article className="grupos-sessao" key={sessao.id}>
                                                <div className="grupos-sessao-icone">
                                                    <CalendarDays size={21} />
                                                </div>
                                                <div className="grupos-sessao-info">
                                                    <h4>{sessao.title}</h4>
                                                    <span>
                                                        <Clock size={14} />
                                                        {formatarDataHora(sessao.starts_at)}
                                                    </span>
                                                    {sessao.description && (
                                                        <p>{sessao.description}</p>
                                                    )}
                                                </div>
                                                {(sessao.created_by === uid || souResponsavel) && (
                                                    <button
                                                        type="button"
                                                        className="grupos-icone-botao"
                                                        aria-label={`Excluir sessão ${sessao.title}`}
                                                        onClick={() => excluirSessao(sessao)}
                                                    >
                                                        <Trash2 size={17} />
                                                    </button>
                                                )}
                                            </article>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grupos-vazio compacto">
                                        <CalendarDays size={29} />
                                        <p>Nenhuma sessão agendada ainda.</p>
                                    </div>
                                )}
                            </section>
                        )}

                        <footer className="grupos-acoes-perigo">
                            {souResponsavel ? (
                                <button
                                    type="button"
                                    className="grupos-botao grupos-botao-perigo"
                                    onClick={excluirGrupo}
                                >
                                    <Trash2 size={17} />
                                    Excluir grupo
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="grupos-botao grupos-botao-secundario"
                                    onClick={sairDoGrupo}
                                >
                                    <LogOut size={17} />
                                    Sair do grupo
                                </button>
                            )}
                        </footer>
                    </section>
                ) : (
                    <>
                        <header className="grupos-cabecalho">
                            <div>
                                <span className="grupos-etiqueta">
                                    <Swords size={14} />
                                    CENTRAL DE AVENTURAS
                                </span>
                                <h2>Encontre sua próxima party</h2>
                                <p>
                                    Crie uma equipe, conheça outros jogadores e
                                    prepare sua próxima aventura.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="grupos-botao grupos-botao-principal"
                                onClick={() => {
                                    limparFeedback();
                                    setMostrarCriacao(true);
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
                                    <span>Grupos encontrados</span>
                                    <strong>{grupos.length}</strong>
                                </div>
                            </article>
                            <article>
                                <ShieldCheck size={22} />
                                <div>
                                    <span>Meus grupos</span>
                                    <strong>{meusGrupos.length}</strong>
                                </div>
                            </article>
                            <article>
                                <CalendarDays size={22} />
                                <div>
                                    <span>Minha identidade</span>
                                    <strong className="grupos-estatistica-nome">
                                        {displayName}
                                    </strong>
                                </div>
                            </article>
                        </div>

                        <form
                            className="grupos-convite-busca"
                            onSubmit={entrarPorCodigo}
                        >
                            <label>
                                <Hash size={18} />
                                <input
                                    value={codigoConvite}
                                    onChange={(evento) =>
                                        setCodigoConvite(evento.target.value)
                                    }
                                    placeholder="Digite um código de convite"
                                    maxLength={32}
                                />
                            </label>
                            <button
                                type="submit"
                                className="grupos-botao grupos-botao-secundario"
                            >
                                Usar convite
                            </button>
                        </form>

                        <div className="grupos-ferramentas">
                            <div className="grupos-abas">
                                <button
                                    type="button"
                                    className={aba === "descobrir" ? "ativa" : ""}
                                    onClick={() => setAba("descobrir")}
                                >
                                    <Search size={17} />
                                    Descobrir grupos
                                </button>
                                <button
                                    type="button"
                                    className={aba === "meus" ? "ativa" : ""}
                                    onClick={() => setAba("meus")}
                                >
                                    <Users size={17} />
                                    Meus grupos
                                </button>
                            </div>

                            <label className="grupos-busca">
                                <Search size={18} />
                                <input
                                    value={busca}
                                    onChange={(evento) => setBusca(evento.target.value)}
                                    placeholder="Buscar por nome, sistema ou responsável..."
                                />
                            </label>
                        </div>

                        {carregando ? (
                            <div className="grupos-estado">
                                <LoaderCircle className="grupos-girando" size={27} />
                                <p>Carregando grupos...</p>
                            </div>
                        ) : gruposFiltrados.length ? (
                            <div className="grupos-grade">
                                {gruposFiltrados.map((grupo) => {
                                    const participacao = grupo.minhaParticipacao;
                                    const souDono = grupo.owner_id === uid;

                                    return (
                                        <article className="grupos-card" key={grupo.id}>
                                            <div className="grupos-card-capa">
                                                <div className="grupos-emblema">
                                                    <Swords size={28} />
                                                </div>
                                                <span>{grupo.system_name}</span>
                                            </div>

                                            <div className="grupos-card-conteudo">
                                                <div className="grupos-card-responsavel">
                                                    <Crown size={14} />
                                                    {grupo.owner_name}
                                                </div>
                                                <h3>{grupo.name}</h3>
                                                <p>
                                                    {grupo.description ||
                                                        "Um grupo de RPG pronto para novas aventuras."}
                                                </p>

                                                <div className="grupos-card-data">
                                                    <CalendarDays size={14} />
                                                    Criado em {formatarData(grupo.created_at)}
                                                </div>

                                                <div className="grupos-card-rodape">
                                                    {souDono ? (
                                                        <button
                                                            type="button"
                                                            className="grupos-botao grupos-botao-principal"
                                                            onClick={() => {
                                                                setGrupoSelecionado(grupo);
                                                                setAbaDetalhes("chat");
                                                                limparFeedback();
                                                            }}
                                                        >
                                                            <Crown size={16} />
                                                            Administrar
                                                        </button>
                                                    ) : participacao?.status === "active" ? (
                                                        <button
                                                            type="button"
                                                            className="grupos-botao grupos-botao-principal"
                                                            onClick={() => {
                                                                setGrupoSelecionado(grupo);
                                                                setAbaDetalhes("chat");
                                                                limparFeedback();
                                                            }}
                                                        >
                                                            <MessageCircle size={16} />
                                                            Abrir grupo
                                                        </button>
                                                    ) : participacao?.status === "pending" ? (
                                                        <button
                                                            type="button"
                                                            className="grupos-botao grupos-botao-secundario"
                                                            disabled
                                                        >
                                                            Solicitação pendente
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
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="grupos-vazio">
                                <div className="grupos-vazio-icone">
                                    {busca ? <Search size={32} /> : <Users size={35} />}
                                </div>
                                <h3>
                                    {busca
                                        ? "Nenhum grupo encontrado"
                                        : aba === "meus"
                                          ? "Você ainda não participa de grupos"
                                          : "Seja o primeiro a reunir a party"}
                                </h3>
                                <p>
                                    {busca
                                        ? "Tente buscar por outro nome ou sistema."
                                        : aba === "meus"
                                          ? "Crie um grupo ou encontre uma equipe na aba Descobrir grupos."
                                          : "Crie um grupo e convide outros jogadores para sua aventura."}
                                </p>
                                {!busca && aba === "meus" && (
                                    <button
                                        type="button"
                                        className="grupos-botao grupos-botao-principal"
                                        onClick={() => setMostrarCriacao(true)}
                                    >
                                        <Plus size={17} />
                                        Criar grupo
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="grupos-atualizar">
                            <button
                                type="button"
                                className="grupos-botao grupos-botao-secundario"
                                onClick={carregarGrupos}
                                disabled={carregando}
                            >
                                <RefreshCw size={16} />
                                Atualizar grupos
                            </button>
                        </div>
                    </>
                )}

                {mostrarCriacao && (
                    <div
                        className="grupos-modal-fundo"
                        onMouseDown={(evento) => {
                            if (evento.target === evento.currentTarget) {
                                setMostrarCriacao(false);
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
                                        <Users size={13} />
                                        MONTE SUA EQUIPE
                                    </span>
                                    <h2 id="grupos-modal-titulo">Criar novo grupo</h2>
                                    <p>
                                        Defina os detalhes iniciais da sua equipe de RPG.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="grupos-icone-botao"
                                    aria-label="Fechar formulário"
                                    onClick={() => setMostrarCriacao(false)}
                                >
                                    <X size={20} />
                                </button>
                            </header>

                            <form
                                className="grupos-formulario"
                                onSubmit={criarGrupo}
                            >
                                <label>
                                    Nome do grupo *
                                    <input
                                        value={nomeGrupo}
                                        onChange={(evento) =>
                                            setNomeGrupo(evento.target.value)
                                        }
                                        maxLength={80}
                                        minLength={3}
                                        placeholder="Ex.: Companhia do Corvo"
                                        required
                                        autoFocus
                                    />
                                </label>

                                <label>
                                    Sistema de RPG
                                    <select
                                        value={sistema}
                                        onChange={(evento) => setSistema(evento.target.value)}
                                    >
                                        {SISTEMAS.map((item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label>
                                    Descrição
                                    <textarea
                                        value={descricao}
                                        onChange={(evento) =>
                                            setDescricao(evento.target.value)
                                        }
                                        rows={4}
                                        maxLength={1000}
                                        placeholder="Conte qual é o estilo da campanha e que jogadores você procura..."
                                    />
                                </label>

                                <div className="grupos-formulario-nota">
                                    <ShieldCheck size={17} />
                                    Você será o responsável pelo grupo e poderá aprovar
                                    solicitações de entrada.
                                </div>

                                <footer className="grupos-acoes-formulario">
                                    <button
                                        type="button"
                                        className="grupos-botao grupos-botao-secundario"
                                        onClick={() => setMostrarCriacao(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="grupos-botao grupos-botao-principal"
                                        disabled={criandoGrupo}
                                    >
                                        {criandoGrupo ? (
                                            <LoaderCircle
                                                size={17}
                                                className="grupos-girando"
                                            />
                                        ) : (
                                            <Plus size={17} />
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
