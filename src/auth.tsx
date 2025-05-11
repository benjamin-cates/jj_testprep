import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, AuthProvider, getAuth, User } from "firebase/auth";
import { doc, Firestore, getDoc, getFirestore, setDoc } from "firebase/firestore";
import React, { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider } from "firebase/auth";

export const AuthContext = createContext(null as AuthData | null);

const firebaseConfig = {
    apiKey: "AIzaSyAYfJSxsFfGi1OX7lZZdhRxTF3WdfZv6S8",
    authDomain: "jjprep-c42d0.firebaseapp.com",
    projectId: "jjprep-c42d0",
    storageBucket: "jjprep-c42d0.firebasestorage.app",
    messagingSenderId: "665792273306",
    appId: "1:665792273306:web:dce37024c2de359aa8f823"
};

export interface AuthData {
    db: Firestore,
    app: FirebaseApp,
    auth: Auth,
    user: User | null,
    is_admin: boolean,
    provider: AuthProvider,
}

export const AuthWrapper = (props: { children?: React.ReactNode }) => {
    const [app] = useState(() => initializeApp(firebaseConfig));
    const [db] = useState(() => getFirestore(app));
    const [provider] = useState(() => new GoogleAuthProvider());
    const [auth] = useState(getAuth(app));
    const [auth_context, update] = useState({ db, app, auth, user: null, is_admin: false, provider } satisfies AuthData as AuthData);
    useEffect(() => {
        return auth.onAuthStateChanged((user: User | null) => {
            if (user) {
                update({ user: user, auth, app, provider, db, is_admin: user.uid == "1QcONK9msKd2MXDpF2jyx9EFpEc2" });
                (async () => {
                    let document = doc(db, "users", user.uid);
                    if (!(await getDoc(document)).exists()) {
                        await setDoc(document, {
                            uid: user.uid,
                            name: user.displayName,
                            alias: user.displayName,
                            subjects: [],
                            school: "School not entered",
                            active: true,
                            image: user.photoURL,
                            email: user.email,
                            // Guaranteed to be false by security rules.
                            admin: false,
                        });
                    }
                })();
            }
        });
    }, [auth]);

    return <AuthContext.Provider value={auth_context}>
        {props.children}

    </AuthContext.Provider>;
}