import { useEffect, useMemo, useRef, useState } from "react";
import {
    Map,
    Plus,
    Upload,
    Save,
    Trash2,
    Trees,
    Building2,
    Users,
    Skull,
    Ruler,
    Grid3X3,
    Volume2,
    Play,
    Pause,
    RotateCcw,
} from "lucide-react";

import PageBase from "../PageBase";
import {
    listarCenarios,
    salvarCenario,
    excluirCenario,
} from "../../services/mapasStorage";

import "./Mapas.css";

const SONS = [
    { id: "nenhum", nome: "Sem som ambiente" },
    { id: "chuva", nome: "Chuva" },
    { id: "floresta", nome: "Floresta" },
    { id: "vento", nome: "Vento" },
    { id: "caverna", nome: "Caverna" },
    { id: "cidade", nome: "Cidade" },
    { id: "terror", nome: "Terror" },
];

const TOKENS = [
    { tipo: "arvore", nome: "Árvore", emoji: "🌳", Icone: Trees },
    { tipo: "construcao", nome: "Construção", emoji: "🏠", Icone: Building2 },
    { tipo: "pessoa", nome: "Pessoa", emoji: "🧙", Icone: Users },
    { tipo: "monstro", nome: "Monstro", emoji: "👹", Icone: Skull },
];

function criarId() {
    return globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function criarCenario(nome = "Novo cenário") {
    return {
        id: criarId(),
        nome,
        imagem: null,
        audioPersonalizado: null,
        tokens: [],
        gradeAtiva: true,
        tamanhoGrade: 50,
        distanciaPorQuadrado: 1.5,
        unidade: "m",
        somAmbiente: "nenhum",
        volume: 50,
        criadoEm: new Date().toISOString(),
    };
}

export default function Mapas({ onNavigate }) {
    const [cenarios, setCenarios] = useState([]);
    const [cenarioAtualId, setCenarioAtualId] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [mensagem, setMensagem] = useState("");
    const [reproduzindo, setReproduzindo] = useState(false);
    const [tokenSelecionado, setTokenSelecionado] = useState(null);

    const imagemInputRef = useRef(null);
    const audioInputRef = useRef(null);
    const audioRef = useRef(null);
    const arrastandoRef = useRef(null);
    const areaMapaRef = useRef(null);

    const cenarioAtual =
        cenarios.find((cenario) => cenario.id === cenarioAtualId) ?? null;

    // Cria URLs estáveis para a imagem e o áudio do cenário atual.
    const imagemUrl = useMemo(() => {
        const imagem = cenarioAtual?.imagem;

        if (imagem instanceof Blob) {
            return URL.createObjectURL(imagem);
        }

        return typeof imagem === "string" ? imagem : null;
    }, [cenarioAtual?.imagem]);

    const audioUrl = useMemo(() => {
        const audio = cenarioAtual?.audioPersonalizado;

        if (audio instanceof Blob) {
            return URL.createObjectURL(audio);
        }

        return typeof audio === "string" ? audio : null;
    }, [cenarioAtual?.audioPersonalizado]);

    // Libera as URLs antigas quando deixam de ser utilizadas.
    useEffect(() => {
        return () => {
            if (imagemUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(imagemUrl);
            }

            if (audioUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [imagemUrl, audioUrl]);

    useEffect(() => {
        let ativo = true;

        async function carregar() {
            try {
                const salvos = await listarCenarios();

                if (!ativo) return;

                const ordenados = salvos.sort(
                    (a, b) =>
                        new Date(b.atualizadoEm || b.criadoEm || 0) -
                        new Date(a.atualizadoEm || a.criadoEm || 0)
                );

                if (ordenados.length > 0) {
                    setCenarios(ordenados);
                    setCenarioAtualId(ordenados[0].id);
                } else {
                    const primeiro = criarCenario("Meu primeiro cenário");
                    await salvarCenario(primeiro);

                    if (!ativo) return;

                    setCenarios([primeiro]);
                    setCenarioAtualId(primeiro.id);
                }
            } catch (error) {
                console.error(error);

                if (ativo) {
                    setMensagem(
                        "Não foi possível acessar o armazenamento. Verifique se o navegador permite dados locais."
                    );
                }
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        carregar();

        return () => {
            ativo = false;
        };
    }, []);

    useEffect(() => {
        setReproduzindo(false);

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [cenarioAtualId]);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio || !cenarioAtual) return;

        audio.volume = Math.max(
            0,
            Math.min(1, (cenarioAtual.volume ?? 50) / 100)
        );
    }, [cenarioAtual?.volume, cenarioAtualId, audioUrl]);

    function atualizarCenario(alteracoes) {
        setCenarios((atuais) =>
            atuais.map((cenario) =>
                cenario.id === cenarioAtualId
                    ? { ...cenario, ...alteracoes }
                    : cenario
            )
        );
    }

    async function salvarAtual() {
        if (!cenarioAtual) return;

        try {
            await salvarCenario(cenarioAtual);
            setMensagem("Cenário salvo com sucesso!");
        } catch (error) {
            console.error(error);
            setMensagem(
                "Não foi possível salvar. O armazenamento pode estar cheio."
            );
        }
    }

    async function novoCenario() {
        const novo = criarCenario(`Cenário ${cenarios.length + 1}`);

        try {
            await salvarCenario(novo);
            setCenarios((atuais) => [novo, ...atuais]);
            setCenarioAtualId(novo.id);
            setTokenSelecionado(null);
            setMensagem("Novo cenário criado.");
        } catch (error) {
            console.error(error);
            setMensagem("Não foi possível criar o cenário.");
        }
    }

    async function removerCenario() {
        if (!cenarioAtual) return;

        const confirmou = window.confirm(
            `Deseja excluir o cenário "${cenarioAtual.nome}"? Essa ação não pode ser desfeita.`
        );

        if (!confirmou) return;

        try {
            await excluirCenario(cenarioAtual.id);

            const restantes = cenarios.filter(
                (cenario) => cenario.id !== cenarioAtual.id
            );

            if (restantes.length === 0) {
                const novo = criarCenario("Meu primeiro cenário");
                await salvarCenario(novo);
                setCenarios([novo]);
                setCenarioAtualId(novo.id);
            } else {
                setCenarios(restantes);
                setCenarioAtualId(restantes[0].id);
            }

            setTokenSelecionado(null);
            setMensagem("Cenário excluído.");
        } catch (error) {
            console.error(error);
            setMensagem("Não foi possível excluir o cenário.");
        }
    }

    function importarImagem(event) {
        const arquivo = event.target.files?.[0];
        event.target.value = "";

        if (!arquivo || !cenarioAtual) return;

        if (!arquivo.type.startsWith("image/")) {
            setMensagem("Selecione um arquivo de imagem.");
            return;
        }

        atualizarCenario({
            imagem: arquivo,
            nome:
                cenarioAtual.nome === "Novo cenário"
                    ? arquivo.name.replace(/\.[^/.]+$/, "")
                    : cenarioAtual.nome,
        });

        setMensagem("Imagem adicionada. Clique em Salvar cenário.");
    }

    function importarAudio(event) {
        const arquivo = event.target.files?.[0];
        event.target.value = "";

        if (!arquivo || !cenarioAtual) return;

        if (!arquivo.type.startsWith("audio/")) {
            setMensagem("Selecione um arquivo de áudio.");
            return;
        }

        atualizarCenario({
            audioPersonalizado: arquivo,
            somAmbiente: "personalizado",
        });

        setReproduzindo(false);

        if (audioRef.current) {
            audioRef.current.pause();
        }

        setMensagem("Áudio adicionado. Clique em Salvar cenário.");
    }

    function adicionarToken(tokenBase) {
        if (!cenarioAtual) return;

        const area = areaMapaRef.current;
        const largura = area?.clientWidth || 800;
        const altura = area?.clientHeight || 500;

        const token = {
            id: criarId(),
            tipo: tokenBase.tipo,
            nome: tokenBase.nome,
            emoji: tokenBase.emoji,
            x: Math.max(30, largura / 2),
            y: Math.max(30, altura / 2),
            tamanho: 42,
            rotacao: 0,
        };

        atualizarCenario({
            tokens: [...(cenarioAtual.tokens || []), token],
        });

        setTokenSelecionado(token.id);
        setMensagem("Token adicionado. Salve o cenário para guardar a alteração.");
    }

    function atualizarToken(id, alteracoes) {
        if (!cenarioAtual) return;

        atualizarCenario({
            tokens: cenarioAtual.tokens.map((token) =>
                token.id === id ? { ...token, ...alteracoes } : token
            ),
        });
    }

    function excluirToken() {
        if (!cenarioAtual || !tokenSelecionado) return;

        atualizarCenario({
            tokens: cenarioAtual.tokens.filter(
                (token) => token.id !== tokenSelecionado
            ),
        });

        setTokenSelecionado(null);
    }

    function iniciarArraste(event, token) {
        event.preventDefault();

        arrastandoRef.current = {
            id: token.id,
            inicioX: event.clientX,
            inicioY: event.clientY,
            tokenX: token.x,
            tokenY: token.y,
        };

        setTokenSelecionado(token.id);

        try {
            event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
            // Continua permitindo o movimento sem captura do ponteiro.
        }
    }

    function moverToken(event) {
        const arraste = arrastandoRef.current;
        if (!arraste) return;

        const area = areaMapaRef.current;
        if (!area) return;

        const x = Math.max(
            15,
            Math.min(
                area.clientWidth - 15,
                arraste.tokenX + event.clientX - arraste.inicioX
            )
        );

        const y = Math.max(
            15,
            Math.min(
                area.clientHeight - 15,
                arraste.tokenY + event.clientY - arraste.inicioY
            )
        );

        atualizarToken(arraste.id, { x, y });
    }

    function finalizarArraste() {
        arrastandoRef.current = null;
    }

    async function alternarAudio() {
        const audio = audioRef.current;

        if (
            !audio ||
            !cenarioAtual ||
            cenarioAtual.somAmbiente !== "personalizado"
        ) {
            return;
        }

        if (reproduzindo) {
            audio.pause();
            setReproduzindo(false);
            return;
        }

        try {
            await audio.play();
            setReproduzindo(true);
        } catch (error) {
            console.error(error);
            setMensagem(
                "Não foi possível reproduzir o áudio. Confira se o arquivo foi carregado."
            );
        }
    }

    function limparTokens() {
        if (!cenarioAtual?.tokens?.length) return;

        if (window.confirm("Remover todos os tokens deste cenário?")) {
            atualizarCenario({ tokens: [] });
            setTokenSelecionado(null);
        }
    }

    if (carregando) {
        return (
            <PageBase
                title="Mapas"
                subtitle="Prepare os cenários das suas aventuras."
                icon={Map}
                onNavigate={onNavigate}
            >
                <div className="mapas-carregando">Carregando cenários...</div>
            </PageBase>
        );
    }

    return (
        <PageBase
            title="Mapas"
            subtitle="Crie cenários, posicione tokens e configure sons ambientes."
            icon={Map}
            onNavigate={onNavigate}
        >
            <div className="mapas-app">
                <aside className="mapas-sidebar">
                    <div className="mapas-sidebar-titulo">
                        <div>
                            <span className="mapas-etiqueta">BIBLIOTECA</span>
                            <h2>Seus cenários</h2>
                        </div>

                        <button
                            className="mapas-icone-botao"
                            onClick={novoCenario}
                            title="Criar cenário"
                            aria-label="Criar cenário"
                        >
                            <Plus size={19} />
                        </button>
                    </div>

                    <button
                        className="mapas-botao-principal"
                        onClick={novoCenario}
                    >
                        <Plus size={18} />
                        Novo cenário
                    </button>

                    <div className="mapas-lista-cenarios">
                        {cenarios.map((cenario) => (
                            <button
                                key={cenario.id}
                                className={`mapas-cenario-item ${
                                    cenario.id === cenarioAtualId ? "ativo" : ""
                                }`}
                                onClick={() => {
                                    setCenarioAtualId(cenario.id);
                                    setTokenSelecionado(null);
                                    setMensagem("");
                                }}
                            >
                                <span className="mapas-miniatura">
                                    <Map size={21} />
                                </span>

                                <span className="mapas-cenario-info">
                                    <strong>{cenario.nome}</strong>
                                    <small>
                                        {(cenario.tokens || []).length} tokens
                                    </small>
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="mapas-aviso">
                        <strong>Salvamento local</strong>
                        <p>
                            Seus cenários ficam salvos neste navegador.
                            Mantenha cópias externas dos arquivos importantes
                            para evitar perdas.
                        </p>
                    </div>
                </aside>

                <section className="mapas-editor">
                    {cenarioAtual && (
                        <>
                            <header className="mapas-editor-topo">
                                <div className="mapas-nome-cenario">
                                    <label htmlFor="mapas-nome">
                                        Nome do cenário
                                    </label>
                                    <input
                                        id="mapas-nome"
                                        value={cenarioAtual.nome}
                                        onChange={(event) =>
                                            atualizarCenario({
                                                nome: event.target.value,
                                            })
                                        }
                                        placeholder="Nome do cenário"
                                        maxLength={100}
                                    />
                                </div>

                                <div className="mapas-acoes-topo">
                                    <button
                                        className="mapas-botao-secundario"
                                        onClick={removerCenario}
                                        title="Excluir cenário"
                                    >
                                        <Trash2 size={16} />
                                        Excluir
                                    </button>

                                    <button
                                        className="mapas-botao-principal"
                                        onClick={salvarAtual}
                                    >
                                        <Save size={17} />
                                        Salvar cenário
                                    </button>
                                </div>
                            </header>

                            <div className="mapas-ferramentas">
                                <div className="mapas-ferramenta-grupo">
                                    <span className="mapas-ferramenta-titulo">
                                        MAPA
                                    </span>
                                    <button
                                        className="mapas-botao-secundario"
                                        onClick={() =>
                                            imagemInputRef.current?.click()
                                        }
                                    >
                                        <Upload size={16} />
                                        Enviar imagem
                                    </button>
                                    <input
                                        ref={imagemInputRef}
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={importarImagem}
                                    />
                                </div>

                                <div className="mapas-separador" />

                                <div className="mapas-ferramenta-grupo">
                                    <span className="mapas-ferramenta-titulo">
                                        TOKENS
                                    </span>

                                    {TOKENS.map(
                                        ({ tipo, nome, emoji, Icone }) => (
                                            <button
                                                key={tipo}
                                                className="mapas-token-ferramenta"
                                                onClick={() =>
                                                    adicionarToken({
                                                        tipo,
                                                        nome,
                                                        emoji,
                                                    })
                                                }
                                                title={`Adicionar ${nome}`}
                                            >
                                                <Icone size={16} />
                                                {nome}
                                            </button>
                                        )
                                    )}
                                </div>

                                <div className="mapas-separador" />

                                <div className="mapas-ferramenta-grupo">
                                    <span className="mapas-ferramenta-titulo">
                                        GRADE
                                    </span>
                                    <label className="mapas-toggle">
                                        <input
                                            type="checkbox"
                                            checked={cenarioAtual.gradeAtiva}
                                            onChange={(event) =>
                                                atualizarCenario({
                                                    gradeAtiva:
                                                        event.target.checked,
                                                })
                                            }
                                        />
                                        <Grid3X3 size={16} />
                                        Mostrar grade
                                    </label>
                                </div>
                            </div>

                            <div className="mapas-area-trabalho">
                                <div
                                    ref={areaMapaRef}
                                    className={`mapas-canvas ${
                                        cenarioAtual.gradeAtiva
                                            ? "com-grade"
                                            : ""
                                    }`}
                                    style={{
                                        "--tamanho-grade": `${cenarioAtual.tamanhoGrade}px`,
                                        backgroundImage: imagemUrl
                                            ? `url("${imagemUrl}")`
                                            : "none",
                                    }}
                                    onPointerMove={moverToken}
                                    onPointerUp={finalizarArraste}
                                    onPointerCancel={finalizarArraste}
                                >
                                    {!imagemUrl && (
                                        <div className="mapas-vazio">
                                            <div className="mapas-vazio-icone">
                                                <Map size={34} />
                                            </div>
                                            <h2>Seu cenário começa aqui</h2>
                                            <p>
                                                Envie uma imagem de mapa ou
                                                adicione tokens para começar.
                                            </p>
                                            <button
                                                className="mapas-botao-principal"
                                                onClick={() =>
                                                    imagemInputRef.current?.click()
                                                }
                                            >
                                                <Upload size={17} />
                                                Escolher mapa
                                            </button>
                                        </div>
                                    )}

                                    {(cenarioAtual.tokens || []).map((token) => (
                                        <button
                                            key={token.id}
                                            className={`mapas-token ${
                                                tokenSelecionado === token.id
                                                    ? "selecionado"
                                                    : ""
                                            }`}
                                            style={{
                                                left: token.x,
                                                top: token.y,
                                                width: token.tamanho,
                                                height: token.tamanho,
                                                transform: `translate(-50%, -50%) rotate(${token.rotacao}deg)`,
                                            }}
                                            onPointerDown={(event) =>
                                                iniciarArraste(event, token)
                                            }
                                            onClick={() =>
                                                setTokenSelecionado(token.id)
                                            }
                                            title={`${token.nome} — arraste para mover`}
                                            aria-label={token.nome}
                                        >
                                            <span>{token.emoji}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mapas-painel-inferior">
                                <section className="mapas-painel-card">
                                    <div className="mapas-painel-titulo">
                                        <Ruler size={18} />
                                        <h3>Grade e distância</h3>
                                    </div>

                                    <label>
                                        Tamanho da grade
                                        <span>
                                            {cenarioAtual.tamanhoGrade}px
                                        </span>
                                    </label>
                                    <input
                                        type="range"
                                        min="20"
                                        max="100"
                                        step="5"
                                        value={cenarioAtual.tamanhoGrade}
                                        onChange={(event) =>
                                            atualizarCenario({
                                                tamanhoGrade: Number(
                                                    event.target.value
                                                ),
                                            })
                                        }
                                    />

                                    <label>Distância por quadrado</label>
                                    <div className="mapas-distancia-linha">
                                        <input
                                            type="number"
                                            min="0.1"
                                            max="10000"
                                            step="0.5"
                                            value={
                                                cenarioAtual.distanciaPorQuadrado
                                            }
                                            onChange={(event) =>
                                                atualizarCenario({
                                                    distanciaPorQuadrado:
                                                        Math.max(
                                                            0.1,
                                                            Number(
                                                                event.target.value
                                                            ) || 0.1
                                                        ),
                                                })
                                            }
                                        />

                                        <select
                                            value={cenarioAtual.unidade}
                                            onChange={(event) =>
                                                atualizarCenario({
                                                    unidade: event.target.value,
                                                })
                                            }
                                        >
                                            <option value="m">Metros</option>
                                            <option value="ft">Pés</option>
                                        </select>
                                    </div>

                                    <p className="mapas-nota">
                                        A escala define a distância representada
                                        por cada quadrado. A régua interativa
                                        será adicionada em uma próxima etapa.
                                    </p>
                                </section>

                                <section className="mapas-painel-card">
                                    <div className="mapas-painel-titulo">
                                        <Volume2 size={18} />
                                        <h3>Som ambiente</h3>
                                    </div>

                                    <label htmlFor="mapas-som">
                                        Ambiente deste cenário
                                    </label>
                                    <select
                                        id="mapas-som"
                                        value={cenarioAtual.somAmbiente}
                                        onChange={(event) => {
                                            atualizarCenario({
                                                somAmbiente: event.target.value,
                                            });
                                            setReproduzindo(false);

                                            if (audioRef.current) {
                                                audioRef.current.pause();
                                            }
                                        }}
                                    >
                                        {SONS.map((som) => (
                                            <option
                                                key={som.id}
                                                value={som.id}
                                            >
                                                {som.nome}
                                            </option>
                                        ))}
                                        <option value="personalizado">
                                            Áudio enviado
                                        </option>
                                    </select>

                                    <div className="mapas-audio-controles">
                                        <button
                                            className="mapas-botao-secundario"
                                            onClick={() =>
                                                audioInputRef.current?.click()
                                            }
                                        >
                                            <Upload size={16} />
                                            Enviar áudio
                                        </button>

                                        <input
                                            ref={audioInputRef}
                                            type="file"
                                            accept="audio/*"
                                            hidden
                                            onChange={importarAudio}
                                        />

                                        <button
                                            className="mapas-botao-play"
                                            onClick={alternarAudio}
                                            disabled={
                                                !audioUrl ||
                                                cenarioAtual.somAmbiente !==
                                                    "personalizado"
                                            }
                                            title={
                                                reproduzindo
                                                    ? "Pausar áudio"
                                                    : "Reproduzir áudio enviado"
                                            }
                                        >
                                            {reproduzindo ? (
                                                <Pause size={17} />
                                            ) : (
                                                <Play size={17} />
                                            )}
                                        </button>
                                    </div>

                                    <label>
                                        Volume
                                        <span>{cenarioAtual.volume}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={cenarioAtual.volume}
                                        onChange={(event) =>
                                            atualizarCenario({
                                                volume: Number(
                                                    event.target.value
                                                ),
                                            })
                                        }
                                    />

                                    <audio
                                        ref={audioRef}
                                        src={
                                            cenarioAtual.somAmbiente ===
                                            "personalizado"
                                                ? audioUrl || undefined
                                                : undefined
                                        }
                                        loop
                                        onEnded={() =>
                                            setReproduzindo(false)
                                        }
                                        onPause={() =>
                                            setReproduzindo(false)
                                        }
                                        onPlay={() =>
                                            setReproduzindo(true)
                                        }
                                    />

                                    <p className="mapas-nota">
                                        Nesta versão, a reprodução funciona
                                        para áudios enviados. Os ambientes
                                        prontos ainda precisam de arquivos
                                        de áudio próprios.
                                    </p>
                                </section>

                                <section className="mapas-painel-card">
                                    <div className="mapas-painel-titulo">
                                        <Users size={18} />
                                        <h3>Token selecionado</h3>
                                    </div>

                                    {cenarioAtual.tokens.find(
                                        (token) =>
                                            token.id === tokenSelecionado
                                    ) ? (
                                        (() => {
                                            const token =
                                                cenarioAtual.tokens.find(
                                                    (item) =>
                                                        item.id ===
                                                        tokenSelecionado
                                                );

                                            return (
                                                <>
                                                    <strong className="mapas-token-nome">
                                                        {token.emoji}{" "}
                                                        {token.nome}
                                                    </strong>

                                                    <label>
                                                        Tamanho
                                                        <span>
                                                            {token.tamanho}px
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="range"
                                                        min="24"
                                                        max="100"
                                                        step="2"
                                                        value={token.tamanho}
                                                        onChange={(event) =>
                                                            atualizarToken(
                                                                token.id,
                                                                {
                                                                    tamanho:
                                                                        Number(
                                                                            event
                                                                                .target
                                                                                .value
                                                                        ),
                                                                }
                                                            )
                                                        }
                                                    />

                                                    <label>
                                                        Rotação
                                                        <span>
                                                            {token.rotacao}°
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="360"
                                                        step="15"
                                                        value={token.rotacao}
                                                        onChange={(event) =>
                                                            atualizarToken(
                                                                token.id,
                                                                {
                                                                    rotacao:
                                                                        Number(
                                                                            event
                                                                                .target
                                                                                .value
                                                                        ),
                                                                }
                                                            )
                                                        }
                                                    />

                                                    <div className="mapas-token-acoes">
                                                        <button
                                                            className="mapas-botao-secundario"
                                                            onClick={() =>
                                                                atualizarToken(
                                                                    token.id,
                                                                    {
                                                                        rotacao:
                                                                            (token.rotacao +
                                                                                90) %
                                                                            360,
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            <RotateCcw
                                                                size={15}
                                                            />
                                                            Girar 90°
                                                        </button>

                                                        <button
                                                            className="mapas-botao-perigo"
                                                            onClick={
                                                                excluirToken
                                                            }
                                                        >
                                                            <Trash2 size={15} />
                                                            Remover
                                                        </button>
                                                    </div>
                                                </>
                                            );
                                        })()
                                    ) : (
                                        <p className="mapas-nota">
                                            Selecione um token no mapa para
                                            alterar tamanho, rotação ou
                                            removê-lo.
                                        </p>
                                    )}

                                    {cenarioAtual.tokens.length > 0 && (
                                        <button
                                            className="mapas-limpar-tokens"
                                            onClick={limparTokens}
                                        >
                                            <Trash2 size={14} />
                                            Limpar todos os tokens
                                        </button>
                                    )}
                                </section>
                            </div>

                            {mensagem && (
                                <div className="mapas-mensagem" role="status">
                                    {mensagem}
                                    <button
                                        onClick={() => setMensagem("")}
                                        aria-label="Fechar mensagem"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </PageBase>
    );
}
