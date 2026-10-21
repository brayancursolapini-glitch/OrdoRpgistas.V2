
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
    BookOpen,
    Search,
    Plus,
    Trash2,
    ArrowLeft,
    FileText,
    Upload,
    X,
    Library,
    HardDrive,
    AlertCircle,
} from "lucide-react";

import PageBase from "../PageBase";
import "./Livros.css";

const DB_NAME = "ordo-rpgistas-livros-db";
const DB_VERSION = 1;
const STORE_NAME = "livros";

const CATEGORIAS = [
    { value: "todos", label: "Todas as categorias" },
    { value: "dnd", label: "D&D" },
    { value: "ordem", label: "Ordem Paranormal" },
    { value: "historias", label: "Histórias e livros" },
    { value: "outros", label: "Outros" },
];

/*
|--------------------------------------------------------------------------
| LIVROS FIXOS DO SITE
|--------------------------------------------------------------------------
|
| Coloque os arquivos PDF na pasta:
| client/public/pdfs/
|
| Os livros fixos aparecem para todos os visitantes.
| O título exibido é independente do nome real do arquivo.
|
*/

const LIVROS_FIXOS = [
    {
        id: "dnd-5e-livro-do-jogador",
        titulo: "Dungeons & Dragons 5e — Livro do Jogador",
        categoria: "dnd",
        nomeArquivo:
            "dd-5e-livro-do-jogador-fundo-branco-biblioteca-elfica.pdf",
        tamanho: 0,
        criadoEm: "",
        url: `${import.meta.env.BASE_URL}pdfs/dd-5e-livro-do-jogador-fundo-branco-biblioteca-elfica.pdf`,
        fixo: true,
    },
];

function abrirBanco() {
    return new Promise((resolve, reject) => {
        if (!("indexedDB" in window)) {
            reject(
                new Error(
                    "Este navegador não oferece suporte ao armazenamento necessário."
                )
            );
            return;
        }

        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                });

                store.createIndex("titulo", "titulo", {
                    unique: false,
                });

                store.createIndex("categoria", "categoria", {
                    unique: false,
                });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function listarLivros() {
    const db = await abrirBanco();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const request = transaction.objectStore(STORE_NAME).getAll();

        request.onsuccess = () => {
            const resultado = request.result.sort((a, b) =>
                a.titulo.localeCompare(b.titulo, "pt-BR")
            );

            resolve(resultado);
        };

        request.onerror = () => reject(request.error);

        transaction.oncomplete = () => db.close();

        transaction.onerror = () => {
            db.close();
            reject(transaction.error);
        };
    });
}

async function salvarLivro(livro) {
    const db = await abrirBanco();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");

        transaction.objectStore(STORE_NAME).put(livro);

        transaction.oncomplete = () => {
            db.close();
            resolve();
        };

        transaction.onerror = () => {
            const error = transaction.error;
            db.close();
            reject(error);
        };

        transaction.onabort = () => {
            const error = transaction.error;
            db.close();
            reject(error || new Error("A gravação foi cancelada."));
        };
    });
}

async function excluirLivro(id) {
    const db = await abrirBanco();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");

        transaction.objectStore(STORE_NAME).delete(id);

        transaction.oncomplete = () => {
            db.close();
            resolve();
        };

        transaction.onerror = () => {
            const error = transaction.error;
            db.close();
            reject(error);
        };

        transaction.onabort = () => {
            const error = transaction.error;
            db.close();
            reject(error || new Error("A exclusão foi cancelada."));
        };
    });
}

function formatarTamanho(bytes) {
    if (bytes < 1024 * 1024) {
        return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function nomeSemExtensao(nome) {
    return nome.replace(/\.pdf$/i, "");
}

function gerarId() {
    if (globalThis.crypto?.randomUUID) {
        return globalThis.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function Livros({ onNavigate }) {
    const inputRef = useRef(null);
    const pdfUrlRef = useRef(null);

    const [livros, setLivros] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [categoria, setCategoria] = useState("todos");
    const [livroAberto, setLivroAberto] = useState(null);

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [aviso, setAviso] = useState("");

    const [titulo, setTitulo] = useState("");
    const [categoriaNova, setCategoriaNova] = useState("dnd");
    const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    async function atualizarLivros() {
        setCarregando(true);

        try {
            const lista = await listarLivros();
            setLivros(lista);
        } catch (error) {
            console.error("Erro ao carregar a biblioteca:", error);

            setErro(
                "Não foi possível acessar a biblioteca. Verifique se o navegador permite armazenamento local."
            );
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        atualizarLivros();
    }, []);

    useEffect(() => {
        return () => {
            if (pdfUrlRef.current) {
                URL.revokeObjectURL(pdfUrlRef.current);
            }
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | JUNTAR LIVROS FIXOS E LIVROS LOCAIS
    |--------------------------------------------------------------------------
    */

    const todosOsLivros = useMemo(
        () => [...LIVROS_FIXOS, ...livros],
        [livros]
    );

    const livrosFiltrados = useMemo(() => {
        const termo = pesquisa.trim().toLocaleLowerCase("pt-BR");

        return todosOsLivros.filter((livro) => {
            const correspondeTitulo =
                !termo ||
                livro.titulo.toLocaleLowerCase("pt-BR").includes(termo) ||
                livro.nomeArquivo.toLocaleLowerCase("pt-BR").includes(termo);

            const correspondeCategoria =
                categoria === "todos" || livro.categoria === categoria;

            return correspondeTitulo && correspondeCategoria;
        });
    }, [todosOsLivros, pesquisa, categoria]);

    function limparFormulario() {
        setTitulo("");
        setCategoriaNova("dnd");
        setArquivoSelecionado(null);
        setMostrarFormulario(false);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    function selecionarArquivo(event) {
        const arquivo = event.target.files?.[0];

        setErro("");
        setAviso("");

        if (!arquivo) {
            setArquivoSelecionado(null);
            return;
        }

        if (
            arquivo.type !== "application/pdf" &&
            !arquivo.name.toLowerCase().endsWith(".pdf")
        ) {
            setErro("Selecione um arquivo PDF.");
            setArquivoSelecionado(null);
            event.target.value = "";
            return;
        }

        setArquivoSelecionado(arquivo);

        if (!titulo.trim()) {
            setTitulo(nomeSemExtensao(arquivo.name));
        }
    }

    async function adicionarLivro(event) {
        event.preventDefault();
        setErro("");
        setAviso("");

        if (!arquivoSelecionado) {
            setErro("Selecione um arquivo PDF antes de salvar.");
            return;
        }

        if (!titulo.trim()) {
            setErro("Digite um título para o livro.");
            return;
        }

        setSalvando(true);

        try {
            const novoLivro = {
                id: gerarId(),
                titulo: titulo.trim(),
                categoria: categoriaNova,
                nomeArquivo: arquivoSelecionado.name,
                tamanho: arquivoSelecionado.size,
                tipo: "application/pdf",
                criadoEm: new Date().toISOString(),
                arquivo: arquivoSelecionado,
                fixo: false,
            };

            await salvarLivro(novoLivro);

            const lista = await listarLivros();
            setLivros(lista);

            limparFormulario();
            setAviso("PDF adicionado à biblioteca com sucesso.");
        } catch (error) {
            console.error("Erro ao salvar PDF:", error);

            setErro(
                "Não foi possível guardar este PDF. Verifique o espaço disponível no navegador e tente novamente."
            );
        } finally {
            setSalvando(false);
        }
    }

    async function abrirLivro(livro) {
        setErro("");
        setAviso("");

        /*
        | PDFs fixos: abrem pelo endereço público do site.
        | PDFs locais: abrem pelo arquivo guardado no navegador.
        */

        if (livro.fixo && livro.url) {
            setLivroAberto(livro);
            return;
        }

        try {
            if (pdfUrlRef.current) {
                URL.revokeObjectURL(pdfUrlRef.current);
                pdfUrlRef.current = null;
            }

            let arquivo = livro.arquivo;

            if (!(arquivo instanceof Blob)) {
                const listaAtualizada = await listarLivros();

                const registro = listaAtualizada.find(
                    (item) => item.id === livro.id
                );

                arquivo = registro?.arquivo;
            }

            if (!(arquivo instanceof Blob)) {
                throw new Error("O arquivo PDF não foi encontrado.");
            }

            const url = URL.createObjectURL(arquivo);
            pdfUrlRef.current = url;

            setLivroAberto({
                ...livro,
                url,
            });
        } catch (error) {
            console.error("Erro ao abrir PDF:", error);
            setErro("Não foi possível abrir este PDF.");
        }
    }

    function fecharLivro() {
        setLivroAberto(null);

        if (pdfUrlRef.current) {
            URL.revokeObjectURL(pdfUrlRef.current);
            pdfUrlRef.current = null;
        }
    }

    async function removerLivro(livro) {
        if (livro.fixo) {
            setAviso(
                "Este é um livro fixo do site. Para removê-lo, altere a lista LIVROS_FIXOS no código."
            );
            return;
        }

        const confirmar = window.confirm(
            `Deseja excluir "${livro.titulo}" da biblioteca? Esta ação não pode ser desfeita.`
        );

        if (!confirmar) return;

        setErro("");
        setAviso("");

        try {
            if (livroAberto?.id === livro.id) {
                fecharLivro();
            }

            await excluirLivro(livro.id);

            const lista = await listarLivros();
            setLivros(lista);

            setAviso("PDF removido da biblioteca.");
        } catch (error) {
            console.error("Erro ao excluir PDF:", error);
            setErro("Não foi possível excluir este PDF.");
        }
    }

    function nomeCategoria(valor) {
        return (
            CATEGORIAS.find((item) => item.value === valor)?.label ||
            "Outros"
        );
    }

    return (
        <PageBase
            title="Biblioteca de Livros"
            subtitle="Reúna seus sistemas de RPG, aventuras, histórias e livros em um só lugar."
            icon={BookOpen}
            onNavigate={onNavigate}
        >
            <div className="livros-page">
                {livroAberto ? (
                    <section className="livros-leitor">
                        <div className="livros-leitor-topo">
                            <button
                                type="button"
                                className="livros-botao livros-botao-secundario"
                                onClick={fecharLivro}
                            >
                                <ArrowLeft size={17} />
                                Voltar à biblioteca
                            </button>

                            <div className="livros-leitor-info">
                                <FileText size={18} />

                                <div>
                                    <strong>{livroAberto.titulo}</strong>
                                    <span>
                                        {nomeCategoria(livroAberto.categoria)}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="livros-icone-botao"
                                title="Fechar leitor"
                                aria-label="Fechar leitor"
                                onClick={fecharLivro}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <iframe
                            className="livros-pdf-frame"
                            src={livroAberto.url}
                            title={`Leitor de PDF: ${livroAberto.titulo}`}
                        />
                    </section>
                ) : (
                    <>
                        <section className="livros-hero">
                            <div className="livros-hero-icone">
                                <Library size={30} />
                            </div>

                            <div className="livros-hero-texto">
                                <span className="livros-eyebrow">
                                    ARQUIVO DO AVENTUREIRO
                                </span>

                                <h2>Sua biblioteca de aventuras</h2>

                                <p>
                                    Guarde seus PDFs, organize seus materiais
                                    e abra seus livros sem sair do Ordo RPGistas.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="livros-botao livros-botao-principal"
                                onClick={() => {
                                    setErro("");
                                    setAviso("");
                                    setMostrarFormulario(true);
                                }}
                            >
                                <Plus size={18} />
                                Adicionar PDF
                            </button>
                        </section>

                        <div className="livros-resumo">
                            <div className="livros-resumo-item">
                                <BookOpen size={20} />

                                <div>
                                    <strong>{todosOsLivros.length}</strong>
                                    <span>
                                        {todosOsLivros.length === 1
                                            ? "PDF na biblioteca"
                                            : "PDFs na biblioteca"}
                                    </span>
                                </div>
                            </div>

                            <div className="livros-resumo-item">
                                <HardDrive size={20} />

                                <div>
                                    <strong>Local</strong>
                                    <span>Armazenamento no navegador</span>
                                </div>
                            </div>
                        </div>

                        {mostrarFormulario && (
                            <motion.section
                                className="livros-form-card"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="livros-form-topo">
                                    <div>
                                        <h3>Adicionar um novo PDF</h3>
                                        <p>
                                            O arquivo ficará salvo neste navegador.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="livros-icone-botao"
                                        aria-label="Fechar formulário"
                                        onClick={limparFormulario}
                                    >
                                        <X size={19} />
                                    </button>
                                </div>

                                <form
                                    className="livros-form"
                                    onSubmit={adicionarLivro}
                                >
                                    <label className="livros-campo">
                                        <span>Título do livro</span>

                                        <input
                                            type="text"
                                            value={titulo}
                                            onChange={(event) =>
                                                setTitulo(event.target.value)
                                            }
                                            placeholder="Ex.: Livro do Jogador"
                                            maxLength={140}
                                            required
                                        />
                                    </label>

                                    <label className="livros-campo">
                                        <span>Categoria</span>

                                        <select
                                            value={categoriaNova}
                                            onChange={(event) =>
                                                setCategoriaNova(
                                                    event.target.value
                                                )
                                            }
                                        >
                                            {CATEGORIAS.filter(
                                                (item) => item.value !== "todos"
                                            ).map((item) => (
                                                <option
                                                    key={item.value}
                                                    value={item.value}
                                                >
                                                    {item.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <div className="livros-campo">
                                        <span>Arquivo PDF</span>

                                        <label className="livros-upload">
                                            <Upload size={22} />

                                            <strong>
                                                {arquivoSelecionado
                                                    ? arquivoSelecionado.name
                                                    : "Escolher arquivo PDF"}
                                            </strong>

                                            <small>
                                                {arquivoSelecionado
                                                    ? formatarTamanho(
                                                          arquivoSelecionado.size
                                                      )
                                                    : "Selecione um PDF no seu computador"}
                                            </small>

                                            <input
                                                ref={inputRef}
                                                type="file"
                                                accept=".pdf,application/pdf"
                                                onChange={selecionarArquivo}
                                            />
                                        </label>
                                    </div>

                                    <div className="livros-form-acoes">
                                        <button
                                            type="button"
                                            className="livros-botao livros-botao-secundario"
                                            onClick={limparFormulario}
                                            disabled={salvando}
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            type="submit"
                                            className="livros-botao livros-botao-principal"
                                            disabled={salvando}
                                        >
                                            <Plus size={17} />
                                            {salvando
                                                ? "Salvando..."
                                                : "Salvar PDF"}
                                        </button>
                                    </div>
                                </form>
                            </motion.section>
                        )}

                        {erro && (
                            <div
                                className="livros-mensagem livros-mensagem-erro"
                                role="alert"
                            >
                                <AlertCircle size={18} />
                                <span>{erro}</span>

                                <button
                                    type="button"
                                    aria-label="Fechar mensagem"
                                    onClick={() => setErro("")}
                                >
                                    <X size={17} />
                                </button>
                            </div>
                        )}

                        {aviso && (
                            <div
                                className="livros-mensagem livros-mensagem-sucesso"
                                role="status"
                            >
                                <span>{aviso}</span>

                                <button
                                    type="button"
                                    aria-label="Fechar mensagem"
                                    onClick={() => setAviso("")}
                                >
                                    <X size={17} />
                                </button>
                            </div>
                        )}

                        <section className="livros-biblioteca">
                            <div className="livros-biblioteca-topo">
                                <div>
                                    <span className="livros-eyebrow">
                                        COLEÇÃO PESSOAL
                                    </span>

                                    <h2>Todos os seus livros</h2>
                                </div>

                                <span className="livros-contagem">
                                    {livrosFiltrados.length} encontrado(s)
                                </span>
                            </div>

                            <div className="livros-filtros">
                                <label className="livros-pesquisa">
                                    <Search size={19} />

                                    <input
                                        type="search"
                                        value={pesquisa}
                                        onChange={(event) =>
                                            setPesquisa(event.target.value)
                                        }
                                        placeholder="Pesquisar por título..."
                                        aria-label="Pesquisar livros"
                                    />

                                    {pesquisa && (
                                        <button
                                            type="button"
                                            aria-label="Limpar pesquisa"
                                            onClick={() => setPesquisa("")}
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </label>

                                <label className="livros-filtro-categoria">
                                    <span>Categoria</span>

                                    <select
                                        value={categoria}
                                        onChange={(event) =>
                                            setCategoria(event.target.value)
                                        }
                                    >
                                        {CATEGORIAS.map((item) => (
                                            <option
                                                key={item.value}
                                                value={item.value}
                                            >
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            {carregando ? (
                                <div className="livros-estado-vazio">
                                    <div className="livros-loader" />
                                    <p>Carregando biblioteca...</p>
                                </div>
                            ) : livrosFiltrados.length === 0 ? (
                                <div className="livros-estado-vazio">
                                    <div className="livros-vazio-icone">
                                        <BookOpen size={30} />
                                    </div>

                                    <h3>
                                        {todosOsLivros.length === 0
                                            ? "Sua biblioteca está vazia"
                                            : "Nenhum livro encontrado"}
                                    </h3>

                                    <p>
                                        {todosOsLivros.length === 0
                                            ? "Adicione seu primeiro PDF para começar a organizar suas aventuras."
                                            : "Tente outro título ou escolha uma categoria diferente."}
                                    </p>

                                    {todosOsLivros.length === 0 && (
                                        <button
                                            type="button"
                                            className="livros-botao livros-botao-principal"
                                            onClick={() =>
                                                setMostrarFormulario(true)
                                            }
                                        >
                                            <Plus size={17} />
                                            Adicionar primeiro PDF
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="livros-grid">
                                    {livrosFiltrados.map((livro) => (
                                        <motion.article
                                            className="livros-card"
                                            key={livro.id}
                                            initial={{
                                                opacity: 0,
                                                y: 12,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            layout
                                        >
                                            <div className="livros-card-capa">
                                                <div className="livros-card-capa-luz" />
                                                <BookOpen size={42} />
                                                <span>PDF</span>
                                            </div>

                                            <div className="livros-card-conteudo">
                                                <span
                                                    className={`livros-categoria-tag livros-categoria-${livro.categoria}`}
                                                >
                                                    {nomeCategoria(
                                                        livro.categoria
                                                    )}
                                                </span>

                                                <h3 title={livro.titulo}>
                                                    {livro.titulo}
                                                </h3>

                                                <p
                                                    className="livros-card-arquivo"
                                                    title={livro.nomeArquivo}
                                                >
                                                    {livro.nomeArquivo}
                                                </p>

                                                <div className="livros-card-meta">
                                                    <span>
                                                        {livro.fixo
                                                            ? "Disponível no site"
                                                            : formatarTamanho(
                                                                  livro.tamanho || 0
                                                              )}
                                                    </span>

                                                    <span>
                                                        {livro.criadoEm
                                                            ? new Date(
                                                                  livro.criadoEm
                                                              ).toLocaleDateString(
                                                                  "pt-BR"
                                                              )
                                                            : livro.fixo
                                                              ? "Livro do site"
                                                              : ""}
                                                    </span>
                                                </div>

                                                <div className="livros-card-acoes">
                                                    <button
                                                        type="button"
                                                        className="livros-botao livros-botao-principal"
                                                        onClick={() =>
                                                            abrirLivro(livro)
                                                        }
                                                    >
                                                        <BookOpen size={16} />
                                                        Ler PDF
                                                    </button>

                                                    {!livro.fixo && (
                                                        <button
                                                            type="button"
                                                            className="livros-icone-botao livros-excluir"
                                                            title="Excluir PDF"
                                                            aria-label={`Excluir ${livro.titulo}`}
                                                            onClick={() =>
                                                                removerLivro(livro)
                                                            }
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.article>
                                    ))}
                                </div>
                            )}
                        </section>

                        <p className="livros-nota-local">
                            <HardDrive size={15} />
                            Os livros fixos ficam disponíveis para todos os
                            visitantes. Os PDFs adicionados pelo formulário
                            continuam armazenados somente neste navegador.
                        </p>
                    </>
                )}
            </div>
        </PageBase>
    );
}
