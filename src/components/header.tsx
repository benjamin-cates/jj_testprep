import React, { useContext } from "react";
import { signInWithRedirect } from "firebase/auth";
import { NavLink } from "react-router";
import { AuthContext } from "../auth";



const Header: React.FC = () => {
    const firebase = useContext(AuthContext);
    let auth_thing = <></>;
    if (!firebase) {

    }
    else if (!firebase.auth.currentUser) {
        auth_thing = <button onClick={() => signInWithRedirect(firebase.auth, firebase.provider)}>sign in</button>;
    }
    else {
        auth_thing = <img src={firebase.auth.currentUser!.photoURL!}></img>
    }
    return <div className="header">
        <div><NavLink to={firebase?.user ? ("/user/" + firebase?.user!.uid) : "/"}>Dashboard</NavLink></div>
        <div>
            {auth_thing}
        </div>
    </div>

};

export { Header }