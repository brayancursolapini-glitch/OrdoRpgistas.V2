
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    browserLocalPersistence,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    setPersistence,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";

import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";

import { auth, db } from "../lib/firebase";


const UserContext = createContext(null);


function montarUsuario(firebaseUser, perfil = {}) {
    return {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,

        email: firebaseUser.email || "",

        name:
            perfil.name ||
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "RPGista",

        username:
            perfil.username ||
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "RPGista",

        favoriteSystem: perfil.favoriteSystem || "",

        createdAt: perfil.createdAt || null,

        lastLoginAt:
            firebaseUser.metadata?.lastSignInTime || null,

        photoURL: firebaseUser.photoURL || null,
    };
}


export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);


    useEffect(() => {
        let ativo = true;

        async function configurarPersistencia() {
            try {
                await setPersistence(
                    auth,
                    browserLocalPersistence
                );
            } catch (erro) {
                console.error(
                    "Erro ao configurar persistência:",
                    erro
                );
            }
        }

        configurarPersistencia();


        const unsubscribe = onAuthStateChanged(
            auth,
            async (firebaseUser) => {
                if (!ativo) return;

                if (!firebaseUser) {
                    setUser(null);
                    setAuthLoading(false);
                    return;
                }

                try {
                    const referenciaPerfil = doc(
                        db,
                        "users",
                        firebaseUser.uid
                    );

                    const snapshotPerfil = await getDoc(
                        referenciaPerfil
                    );

                    const perfil = snapshotPerfil.exists()
                        ? snapshotPerfil.data()
                        : {};

                    const usuarioAtual = montarUsuario(
                        firebaseUser,
                        perfil
                    );

                    if (ativo) {
                        setUser(usuarioAtual);
                    }
                } catch (erro) {
                    console.error(
                        "Erro ao carregar perfil:",
                        erro
                    );

                    if (ativo) {
                        setUser(
                            montarUsuario(firebaseUser)
                        );
                    }
                } finally {
                    if (ativo) {
                        setAuthLoading(false);
                    }
                }
            }
        );


        return () => {
            ativo = false;
            unsubscribe();
        };
    }, []);


    async function login({ email, password }) {
        const emailLimpo = email.trim().toLowerCase();

        await setPersistence(
            auth,
            browserLocalPersistence
        );

        const resultado =
            await signInWithEmailAndPassword(
                auth,
                emailLimpo,
                password
            );

        const firebaseUser = resultado.user;

        const referenciaPerfil = doc(
            db,
            "users",
            firebaseUser.uid
        );

        const snapshotPerfil = await getDoc(
            referenciaPerfil
        );

        const perfil = snapshotPerfil.exists()
            ? snapshotPerfil.data()
            : {};

        await setDoc(
            referenciaPerfil,
            {
                email: firebaseUser.email || emailLimpo,

                lastLoginAt: serverTimestamp(),

                updatedAt: serverTimestamp(),
            },
            { merge: true }
        );

        const usuarioAtual = montarUsuario(
            firebaseUser,
            perfil
        );

        setUser(usuarioAtual);

        return usuarioAtual;
    }


    async function register({
        name,
        username,
        email,
        password,
        favoriteSystem,
    }) {
        const emailLimpo = email.trim().toLowerCase();

        await setPersistence(
            auth,
            browserLocalPersistence
        );

        const resultado =
            await createUserWithEmailAndPassword(
                auth,
                emailLimpo,
                password
            );

        const firebaseUser = resultado.user;

        await updateProfile(firebaseUser, {
            displayName: username || name || "RPGista",
        });

        const referenciaPerfil = doc(
            db,
            "users",
            firebaseUser.uid
        );

        const perfil = {
            uid: firebaseUser.uid,

            name: name || username || "RPGista",

            username: username || name || "RPGista",

            email: firebaseUser.email || emailLimpo,

            favoriteSystem: favoriteSystem || "",

            createdAt: serverTimestamp(),

            lastLoginAt: serverTimestamp(),

            updatedAt: serverTimestamp(),
        };

        await setDoc(
            referenciaPerfil,
            perfil
        );

        const usuarioAtual = montarUsuario(
            firebaseUser,
            {
                ...perfil,
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
            }
        );

        setUser(usuarioAtual);

        return usuarioAtual;
    }


    async function logout() {
        await signOut(auth);
        setUser(null);
    }


    return (
        <UserContext.Provider
            value={{
                user,
                authLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}


export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error(
            "useUser deve ser usado dentro de UserProvider."
        );
    }

    return context;
}
