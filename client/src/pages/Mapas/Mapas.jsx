
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Map, Plus, Upload, Save, Trash2, Trees, Building2, Users, Skull,
    Ruler, Grid3X3, Volume2, Play, Pause, RotateCcw, ZoomIn,
    ZoomOut, Maximize, MousePointer2, ImagePlus, X
} from "lucide-react";

import PageBase from "../PageBase";
import {
    listarCenarios,
    salvarCenario,
    excluirCenario,
} from "../../services/mapasStorage";

import "./Mapas.css";

const TOKENS_PADRAO = [
    { tipo: "arvore", nome: "Árvore", emoji: "🌳", Icone: Trees },
    { tipo: "construcao", nome: "Construção", emoji: "🏠", Icone: Building2 },
    { tipo: "pessoa", nome: "Pessoa", emoji: "🧙", Icone: Users },
    { tipo: "monstro", nome: "Monstro", emoji: "👹", Icone: Skull },
];

const SONS = [
    { id: "nenhum", nome: "Sem som ambiente" },
    { id: "chuva", nome: "Chuva" },
    { id: "floresta", nome: "Floresta" },
    { id: "vento", nome: "Vento" },
    { id: "caverna", nome: "Caverna" },
    { id: "cidade", nome: "Cidade" },
    { id: "terror", nome: "Terror" },
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

function distanciaEntre(a, b) {
    return Math.hypot(b.x - a.x, b.y - a.y);
}

export default function Mapas({ onNavigate }) {
    const [cenarios, setCenarios] = useState([]);
    const [cenarioAtualId, setCenarioAtualId] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [mensagem, setMensagem] = useState("");
    const [reproduzindo, setReproduzindo] = useState(false);
    const [tokenSelecionado, setTokenSelecionado] = useState(null);
    const [ferramenta, setFerramenta] = useState("selecionar");
    const [zoom, setZoom] = useState(1);
    const [deslocamento, setDeslocamento] = useState({ x: 0, y: 0 });
    const [medicao, setMedicao] = useState(null);
    const [tokenEmEdicao, setTokenEmEdicao] = useState(null);

    const imagemInputRef = useRef(null);
    const audioInputRef = useRef(null);
    const tokenInputRef = useRef(null);
    const audioRef = useRef(null);
    const areaMapaRef = useRef(null);
    const arrastandoRef = useRef(null);
    const medicaoRef = useRef(null);
    const urlsRef = useRef(new Set());

    const cenarioAtual =
        cenarios.find((c) => c.id === cenarioAtualId) ?? null;

    function criarUrl(blob) {
        if (!(blob instanceof Blob)) return null;
        const url = URL.createObjectURL(blob);
        urlsRef.current.add(url);
        return url;
    }

    const imagemUrl = useMemo(
        () => criarUrl(cenarioAtual?.imagem),
        [cenarioAtual?.imagem]
    );

    const audioUrl = useMemo(
        () => criarUrl(cenarioAtual?.audioPersonalizado),
        [cenarioAtual?.audioPersonalizado]
    );

    useEffect(() => {
        return () => {
            urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
            urlsRef.current.clear();
        };
    }, []);

    useEffect(() => {
        let ativo = true;

        async function carregar() {
            try {
                const salvos = await listarCenarios();
                if (!ativo) return;

                salvos.sort(
                    (a, b) =>
                        new Date(b.atualizadoEm || b.criadoEm || 0) -
                        new Date(a.atualizadoEm || a.criadoEm || 0)
                );

                if (salvos.length) {
                    setCenarios(salvos);
                    setCenarioAtualId(salvos[0].id);
                } else {
                    const primeiro = criarCenario("Meu primeiro cenário");
                    await salvarCenario(primeiro);
                    if (!ativo) return;
                    setCenarios([primeiro]);
                    setCenarioAtualId(primeiro.id);
                }
            } catch (error) {
                console.error(error);
                if (ativo) setMensagem("Não foi possível carregar os cenários salvos.");
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        carregar();
        return () => { ativo = false; };
    }, []);

    useEffect(() => {
        setZoom(1);
        setDeslocamento({ x: 0, y: 0 });
        setMedicao(null);
        medicaoRef.current = null;
        arrastandoRef.current = null;
        setReproduzindo(false);

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [cenarioAtualId]);

    useEffect(() => {
        if (audioRef.current && cenarioAtual) {
            audioRef.current.volume = Math.max(
                0, Math.min(1, (cenarioAtual.volume ?? 50) / 100)
            );
        }
    }, [cenarioAtual?.volume, cenarioAtualId, audioUrl]);

    function atualizarCenario(alteracoes) {
        setCenarios((atuais) =>
            atuais.map((c) =>
                c.id === cenarioAtualId ? { ...c, ...alteracoes } : c
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
            setMensagem("Não foi possível salvar. Verifique o espaço disponível no navegador.");
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
        if (!window.confirm(`Excluir "${cenarioAtual.nome}"? Essa ação não pode ser desfeita.`)) return;

        try {
            await excluirCenario(cenarioAtual.id);
            const restantes = cenarios.filter((c) => c.id !== cenarioAtual.id);

            if (restantes.length) {
                setCenarios(restantes);
                setCenarioAtualId(restantes[0].id);
            } else {
                const novo = criarCenario("Meu primeiro cenário");
                await salvarCenario(novo);
                setCenarios([novo]);
                setCenarioAtualId(novo.id);
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
            setMensagem("Escolha um arquivo de imagem.");
            return;
        }

        atualizarCenario({
            imagem: arquivo,
            nome: cenarioAtual.nome === "Novo cenário"
                ? arquivo.name.replace(/\.[^/.]+$/, "")
                : cenarioAtual.nome,
        });
        setZoom(1);
        setDeslocamento({ x: 0, y: 0 });
        setMensagem("Mapa importado. Clique em Salvar cenário.");
    }

    function importarAudio(event) {
        const arquivo = event.target.files?.[0];
        event.target.value = "";
        if (!arquivo || !cenarioAtual) return;

        if (!arquivo.type.startsWith("audio/")) {
            setMensagem("Escolha um arquivo de áudio.");
            return;
        }

        if (audioRef.current) audioRef.current.pause();

        atualizarCenario({
            audioPersonalizado: arquivo,
            somAmbiente: "personalizado",
        });
        setReproduzindo(false);
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
            emoji: tokenBase.emoji || "🧩",
            imagem: tokenBase.imagem || null,
            x: largura / 2,
            y: altura / 2,
            tamanho: 48,
            rotacao: 0,
        };

        atualizarCenario({
            tokens: [...(cenarioAtual.tokens || []), token],
        });
        setTokenSelecionado(token.id);
        setMensagem("Token adicionado. Salve o cenário para guardar a alteração.");
    }

    function importarToken(event) {
        const arquivo = event.target.files?.[0];
        event.target.value = "";
        if (!arquivo) return;

        if (!arquivo.type.startsWith("image/")) {
            setMensagem("Escolha uma imagem para o token.");
            return;
        }

        const nome = arquivo.name.replace(/\.[^/.]+$/, "") || "Token personalizado";

        adicionarToken({
            tipo: "personalizado",
            nome,
            emoji: "🧩",
            imagem: arquivo,
        });

        setMensagem("Token personalizado adicionado. Você pode editá-lo e salvar o cenário.");
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
            tokens: cenarioAtual.tokens.filter((t) => t.id !== tokenSelecionado),
        });
        setTokenSelecionado(null);
        setTokenEmEdicao(null);
    }

    function iniciarArrasteToken(event, token) {
        if (ferramenta === "regua") return;
        event.preventDefault();
        event.stopPropagation();

        const area = areaMapaRef.current;
        if (!area) return;

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
            // Alguns navegadores não suportam a captura do ponteiro.
        }
    }

    function moverToken(event) {
        const arraste = arrastandoRef.current;
        if (!arraste) return;

        const area = areaMapaRef.current;
        if (!area) return;

        const dx = (event.clientX - arraste.inicioX) / zoom;
        const dy = (event.clientY - arraste.inicioY) / zoom;

        atualizarToken(arraste.id, {
            x: Math.max(0, arraste.tokenX + dx),
            y: Math.max(0, arraste.tokenY + dy),
        });
    }

    function pontoNoMapa(event) {
        const area = areaMapaRef.current;
        if (!area) return { x: 0, y: 0 };

        const rect = area.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left - deslocamento.x) / zoom,
            y: (event.clientY - rect.top - deslocamento.y) / zoom,
        };
    }

    function iniciarMedicao(event) {
        if (ferramenta !== "regua" || event.button !== 0) return;

        event.preventDefault();
        const ponto = pontoNoMapa(event);
        const inicial = { inicio: ponto, fim: ponto };

        medicaoRef.current = inicial;
        setMedicao(inicial);

        try {
            event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
            // Continua funcionando com o movimento normal do ponteiro.
        }
    }

    function atualizarMedicao(event) {
        if (ferramenta === "regua" && medicaoRef.current) {
            const atualizada = {
                ...medicaoRef.current,
                fim: pontoNoMapa(event),
            };
            medicaoRef.current = atualizada;
            setMedicao(atualizada);
        }
    }

    function finalizarMedicao(event) {
        if (!medicaoRef.current) return;

        const finalizada = {
            ...medicaoRef.current,
            fim: pontoNoMapa(event),
        };

        medicaoRef.current = finalizada;
        setMedicao(finalizada);
    }

    function alterarZoom(valor) {
        setZoom(Math.max(0.25, Math.min(3, valor)));
    }

    function zoomComRoda(event) {
        if (!event.ctrlKey && !event.metaKey) return;
        event.preventDefault();
        alterarZoom(zoom + (event.deltaY < 0 ? 0.1 : -0.1));
    }

    function centralizarMapa() {
        setZoom(1);
        setDeslocamento({ x: 0, y: 0 });
    }

    async function alternarAudio() {
        const audio = audioRef.current;
        if (!audio || cenarioAtual?.somAmbiente !== "personalizado") return;

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
            setMensagem("Não foi possível reproduzir o áudio enviado.");
        }
    }

    function limparTokens() {
        if (!cenarioAtual?.tokens?.length) return;
        if (window.confirm("Remover todos os tokens deste cenário?")) {
            atualizarCenario({ tokens: [] });
            setTokenSelecionado(null);
            setTokenEmEdicao(null);
        }
    }

    const tokenAtual = cenarioAtual?.tokens?.find(
        (token) => token.id === tokenSelecionado
    );

    const tamanhoQuadrado = cenarioAtual?.tamanhoGrade || 50;
    const distanciaPorQuadrado = cenarioAtual?.distanciaPorQuadrado || 1.5;

    const distanciaMedida = medicao
        ? distanciaEntre(medicao.inicio, medicao.fim) /
            tamanhoQuadrado * distanciaPorQuadrado
        : 0;

    if (carregando) {
        return (
            <PageBase title="Mapas" subtitle="Prepare os cenários das suas aventuras." icon={Map} onNavigate={onNavigate}>
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
                        <button className="mapas-icone-botao" onClick={novoCenario} title="Criar cenário" aria-label="Criar cenário">
                            <Plus size={19} />
                        </button>
                    </div>

                    <button className="mapas-botao-principal" onClick={novoCenario}>
                        <Plus size={18} /> Novo cenário
                    </button>

                    <div className="mapas-lista-cenarios">
                        {cenarios.map((cenario) => (
                            <button
                                key={cenario.id}
                                className={`mapas-cenario-item ${cenario.id === cenarioAtualId ? "ativo" : ""}`}
                                onClick={() => {
                                    setCenarioAtualId(cenario.id);
                                    setTokenSelecionado(null);
                                    setTokenEmEdicao(null);
                                    setMensagem("");
                                }}
                            >
                                <span className="mapas-miniatura"><Map size={21} /></span>
                                <span className="mapas-cenario-info">
                                    <strong>{cenario.nome}</strong>
                                    <small>{(cenario.tokens || []).length} tokens</small>
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="mapas-aviso">
                        <strong>Salvamento local</strong>
                        <p>Os cenários ficam salvos neste navegador. Mantenha cópias externas dos arquivos importantes.</p>
                    </div>
                </aside>

                <section className="mapas-editor">
                    {cenarioAtual && (
                        <>
                            <header className="mapas-editor-topo">
                                <div className="mapas-nome-cenario">
                                    <label htmlFor="mapas-nome">Nome do cenário</label>
                                    <input
                                        id="mapas-nome"
                                        value={cenarioAtual.nome}
                                        onChange={(e) => atualizarCenario({ nome: e.target.value })}
                                        maxLength={100}
                                    />
                                </div>
                                <div className="mapas-acoes-topo">
                                    <button className="mapas-botao-secundario" onClick={removerCenario}>
                                        <Trash2 size={16} /> Excluir
                                    </button>
                                    <button className="mapas-botao-principal" onClick={salvarAtual}>
                                        <Save size={17} /> Salvar cenário
                                    </button>
                                </div>
                            </header>

                            <div className="mapas-ferramentas">
                                <div className="mapas-ferramenta-grupo">
                                    <span className="mapas-ferramenta-titulo">MAPA</span>
                                    <button className="mapas-botao-secundario" onClick={() => imagemInputRef.current?.click()}>
                                        <Upload size={16} /> Enviar imagem
                                    </button>
                                    <input ref={imagemInputRef} type="file" accept="image/*" hidden onChange={importarImagem} />
                                </div>

                                <div className="mapas-separador" />

                                <div className="mapas-ferramenta-grupo">
                                    <span className="mapas-ferramenta-titulo">TOKENS</span>
                                    {TOKENS_PADRAO.map(({ tipo, nome, emoji, Icone }) => (
                                        <button key={tipo} className="mapas-token-ferramenta" onClick={() => adicionarToken({ tipo, nome, emoji })}>
                                            <Icone size={16} /> {nome}
                                        </button>
                                    ))}
                                    <button className="mapas-token-ferramenta" onClick={() => tokenInputRef.current?.click()}>
                                        <ImagePlus size={16} /> Enviar token
                                    </button>
                                    <input ref={tokenInputRef} type="file" accept="image/*" hidden onChange={importarToken} />
                                </div>

                                <div className="mapas-separador" />

                                <div className="mapas-ferramenta-grupo">
                                    <span className="mapas-ferramenta-titulo">FERRAMENTAS</span>
                                    <button
                                        className={`mapas-token-ferramenta ${ferramenta === "selecionar" ? "ativo" : ""}`}
                                        onClick={() => setFerramenta("selecionar")}
                                    >
                                        <MousePointer2 size={16} /> Selecionar
                                    </button>
                                    <button
                                        className={`mapas-token-ferramenta ${ferramenta === "regua" ? "ativo" : ""}`}
                                        onClick={() => {
                                            setFerramenta("regua");
                                            setMedicao(null);
                                            medicaoRef.current = null;
                                        }}
                                    >
                                        <Ruler size={16} /> Régua
                                    </button>
                                    <label className="mapas-toggle">
                                        <input
                                            type="checkbox"
                                            checked={cenarioAtual.gradeAtiva}
                                            onChange={(e) => atualizarCenario({ gradeAtiva: e.target.checked })}
                                        />
                                        <Grid3X3 size={16} /> Mostrar grade
                                    </label>
                                </div>
                            </div>

                            <div className="mapas-zoom-barra">
                                <span className="mapas-zoom-indicador">{Math.round(zoom * 100)}%</span>
                                <button className="mapas-botao-secundario" onClick={() => alterarZoom(zoom - 0.1)} disabled={zoom <= 0.25} title="Diminuir zoom">
                                    <ZoomOut size={16} />
                                </button>
                                <button className="mapas-botao-secundario" onClick={() => alterarZoom(zoom + 0.1)} disabled={zoom >= 3} title="Aumentar zoom">
                                    <ZoomIn size={16} />
                                </button>
                                <button className="mapas-botao-secundario" onClick={centralizarMapa} title="Restaurar zoom">
                                    <Maximize size={16} /> Ajustar
                                </button>
                                <span className="mapas-dica-zoom">Use Ctrl + roda do mouse para zoom.</span>
                            </div>

                            <div className="mapas-area-trabalho">
                                <div
                                    ref={areaMapaRef}
                                    className={`mapas-canvas ${cenarioAtual.gradeAtiva ? "com-grade" : ""} ${ferramenta === "regua" ? "modo-regua" : ""}`}
                                    onPointerMove={(event) => {
                                        moverToken(event);
                                        atualizarMedicao(event);
                                    }}
                                    onPointerUp={(event) => {
                                        if (ferramenta === "regua") finalizarMedicao(event);
                                        arrastandoRef.current = null;
                                    }}
                                    onPointerCancel={() => { arrastandoRef.current = null; }}
                                    onPointerDown={iniciarMedicao}
                                    onWheel={zoomComRoda}
                                    style={{
                                        "--tamanho-grade": `${tamanhoQuadrado * zoom}px`,
                                    }}
                                >
                                    <div
                                        className="mapas-conteudo-transformado"
                                        style={{
                                            transform: `translate(${deslocamento.x}px, ${deslocamento.y}px) scale(${zoom})`,
                                        }}
                                    >
                                        {imagemUrl ? (
                                            <img className="mapas-imagem-fundo" src={imagemUrl} alt="Mapa do cenário" draggable="false" />
                                        ) : (
                                            <div className="mapas-vazio">
                                                <div className="mapas-vazio-icone"><Map size={34} /></div>
                                                <h2>Seu cenário começa aqui</h2>
                                                <p>Envie uma imagem de mapa para preencher o espaço de trabalho.</p>
                                                <button className="mapas-botao-principal" onClick={() => imagemInputRef.current?.click()}>
                                                    <Upload size={17} /> Escolher mapa
                                                </button>
                                            </div>
                                        )}

                                        {(cenarioAtual.tokens || []).map((token) => {
                                            const urlToken = token.imagem instanceof Blob ? criarUrl(token.imagem) : null;

                                            return (
                                                <button
                                                    key={token.id}
                                                    className={`mapas-token ${tokenSelecionado === token.id ? "selecionado" : ""} ${token.imagem ? "token-imagem" : ""}`}
                                                    style={{
                                                        left: token.x,
                                                        top: token.y,
                                                        width: token.tamanho,
                                                        height: token.tamanho,
                                                        transform: `translate(-50%, -50%) rotate(${token.rotacao}deg)`,
                                                    }}
                                                    onPointerDown={(event) => iniciarArrasteToken(event, token)}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        setTokenSelecionado(token.id);
                                                    }}
                                                    onDoubleClick={() => setTokenEmEdicao(token.id)}
                                                    title={`${token.nome} — arraste para mover; duplo clique para editar`}
                                                >
                                                    {urlToken ? (
                                                        <img src={urlToken} alt={token.nome} draggable="false" />
                                                    ) : (
                                                        <span>{token.emoji}</span>
                                                    )}
                                                </button>
                                            );
                                        })}

                                        {medicao && (
                                            <svg className="mapas-svg-regua">
                                                <line
                                                    x1={medicao.inicio.x}
                                                    y1={medicao.inicio.y}
                                                    x2={medicao.fim.x}
                                                    y2={medicao.fim.y}
                                                    stroke="#facc15"
                                                    strokeWidth={2 / zoom}
                                                    strokeDasharray={`${6 / zoom} ${4 / zoom}`}
                                                />
                                                <circle cx={medicao.inicio.x} cy={medicao.inicio.y} r={4 / zoom} fill="#facc15" />
                                                <circle cx={medicao.fim.x} cy={medicao.fim.y} r={4 / zoom} fill="#facc15" />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                {medicao && (
                                    <div className="mapas-medicao-resultado">
                                        <Ruler size={16} />
                                        Distância: {distanciaMedida.toFixed(2)} {cenarioAtual.unidade}
                                    </div>
                                )}
                            </div>

                            <div className="mapas-painel-inferior">
                                <section className="mapas-painel-card">
                                    <div className="mapas-painel-titulo"><Ruler size={18} /><h3>Grade e distância</h3></div>
                                    <label>Tamanho da grade <span>{cenarioAtual.tamanhoGrade}px</span></label>
                                    <input type="range" min="20" max="100" step="5" value={cenarioAtual.tamanhoGrade} onChange={(e) => atualizarCenario({ tamanhoGrade: Number(e.target.value) })} />
                                    <label>Distância por quadrado</label>
                                    <div className="mapas-distancia-linha">
                                        <input type="number" min="0.1" step="0.5" value={cenarioAtual.distanciaPorQuadrado} onChange={(e) => atualizarCenario({ distanciaPorQuadrado: Math.max(0.1, Number(e.target.value) || 0.1) })} />
                                        <select value={cenarioAtual.unidade} onChange={(e) => atualizarCenario({ unidade: e.target.value })}>
                                            <option value="m">Metros</option>
                                            <option value="ft">Pés</option>
                                        </select>
                                    </div>
                                    <p className="mapas-nota">Selecione Régua e clique, segure e arraste no mapa para medir. A escala depende do tamanho configurado para os quadrados.</p>
                                </section>

                                <section className="mapas-painel-card">
                                    <div className="mapas-painel-titulo"><Volume2 size={18} /><h3>Som ambiente</h3></div>
                                    <label htmlFor="mapas-som">Ambiente deste cenário</label>
                                    <select id="mapas-som" value={cenarioAtual.somAmbiente} onChange={(e) => {
                                        atualizarCenario({ somAmbiente: e.target.value });
                                        setReproduzindo(false);
                                        audioRef.current?.pause();
                                    }}>
                                        {SONS.map((som) => <option key={som.id} value={som.id}>{som.nome}</option>)}
                                        <option value="personalizado">Áudio enviado</option>
                                    </select>
                                    <div className="mapas-audio-controles">
                                        <button className="mapas-botao-secundario" onClick={() => audioInputRef.current?.click()}><Upload size={16} /> Enviar áudio</button>
                                        <input ref={audioInputRef} type="file" accept="audio/*" hidden onChange={importarAudio} />
                                        <button className="mapas-botao-play" onClick={alternarAudio} disabled={!audioUrl || cenarioAtual.somAmbiente !== "personalizado"}>
                                            {reproduzindo ? <Pause size={17} /> : <Play size={17} />}
                                        </button>
                                    </div>
                                    <label>Volume <span>{cenarioAtual.volume}%</span></label>
                                    <input type="range" min="0" max="100" value={cenarioAtual.volume} onChange={(e) => atualizarCenario({ volume: Number(e.target.value) })} />
                                    <audio ref={audioRef} src={cenarioAtual.somAmbiente === "personalizado" ? audioUrl || undefined : undefined} loop onPause={() => setReproduzindo(false)} onPlay={() => setReproduzindo(true)} />
                                    <p className="mapas-nota">A reprodução está disponível para áudios enviados. Os sons predefinidos ainda precisam de arquivos de áudio.</p>
                                </section>

                                <section className="mapas-painel-card">
                                    <div className="mapas-painel-titulo"><Users size={18} /><h3>Editar token</h3></div>
                                    {tokenAtual ? (
                                        <>
                                            <label>Nome do token</label>
                                            <input
                                                className="mapas-campo-token"
                                                value={tokenAtual.nome}
                                                onChange={(e) => atualizarToken(tokenAtual.id, { nome: e.target.value })}
                                            />
                                            <label>Tamanho <span>{tokenAtual.tamanho}px</span></label>
                                            <input type="range" min="20" max="140" step="2" value={tokenAtual.tamanho} onChange={(e) => atualizarToken(tokenAtual.id, { tamanho: Number(e.target.value) })} />
                                            <label>Rotação <span>{tokenAtual.rotacao}°</span></label>
                                            <input type="range" min="0" max="360" step="15" value={tokenAtual.rotacao} onChange={(e) => atualizarToken(tokenAtual.id, { rotacao: Number(e.target.value) })} />
                                            <div className="mapas-token-acoes">
                                                <button className="mapas-botao-secundario" onClick={() => atualizarToken(tokenAtual.id, { rotacao: (tokenAtual.rotacao + 90) % 360 })}><RotateCcw size={15} /> Girar 90°</button>
                                                <button className="mapas-botao-perigo" onClick={excluirToken}><Trash2 size={15} /> Remover</button>
                                            </div>
                                            <p className="mapas-nota">Dê duplo clique em um token para selecioná-lo para edição. As alterações são salvas ao clicar em Salvar cenário.</p>
                                        </>
                                    ) : (
                                        <p className="mapas-nota">Selecione um token no mapa para editar o nome, tamanho e rotação. Você também pode enviar suas próprias imagens como tokens.</p>
                                    )}
                                    {cenarioAtual.tokens.length > 0 && <button className="mapas-limpar-tokens" onClick={limparTokens}><Trash2 size={14} /> Limpar todos os tokens</button>}
                                </section>
                            </div>

                            {mensagem && (
                                <div className="mapas-mensagem" role="status">
                                    {mensagem}
                                    <button onClick={() => setMensagem("")} aria-label="Fechar mensagem"><X size={16} /></button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </PageBase>
    );
}
