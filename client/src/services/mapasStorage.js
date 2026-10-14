
const DB_NAME = "ordo-rpgistas-mapas";
const DB_VERSION = 1;
const STORE_NAME = "cenarios";

function abrirBanco() {
    return new Promise((resolve, reject) => {
        if (!("indexedDB" in window)) {
            reject(new Error("Seu navegador não oferece suporte ao IndexedDB."));
            return;
        }

        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
            reject(request.error || new Error("Não foi possível abrir o banco."));
        };
    });
}

async function executarTransacao(modo, operacao) {
    const db = await abrirBanco();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, modo);
        const store = transaction.objectStore(STORE_NAME);

        let resultado;

        try {
            resultado = operacao(store);
        } catch (error) {
            db.close();
            reject(error);
            return;
        }

        transaction.oncomplete = () => {
            db.close();
            resolve(resultado?.result);
        };

        transaction.onerror = () => {
            db.close();
            reject(transaction.error || new Error("Falha na operação."));
        };

        transaction.onabort = () => {
            db.close();
            reject(transaction.error || new Error("Operação cancelada."));
        };
    });
}

export async function listarCenarios() {
    return executarTransacao("readonly", (store) => store.getAll());
}

export async function buscarCenario(id) {
    return executarTransacao("readonly", (store) => store.get(id));
}

export async function salvarCenario(cenario) {
    if (!cenario?.id) {
        throw new Error("O cenário precisa ter um ID.");
    }

    const registro = {
        ...cenario,
        atualizadoEm: new Date().toISOString(),
    };

    await executarTransacao("readwrite", (store) => store.put(registro));

    return registro;
}

export async function excluirCenario(id) {
    return executarTransacao("readwrite", (store) => store.delete(id));
}
