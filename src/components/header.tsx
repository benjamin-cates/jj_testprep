import React, { useContext } from "react";
import { signInWithPopup } from "firebase/auth";
import { NavLink } from "react-router";
import { AuthContext } from "../auth";



const Header: React.FC = () => {
    const firebase = useContext(AuthContext);
    let auth_thing = <></>;
    if (!firebase) {

    }
    else if (!firebase.auth.currentUser) {
        auth_thing = <button onClick={() => signInWithPopup(firebase.auth, firebase.provider)}>sign in</button>;
    }
    else {
        auth_thing = <img className="header_pfp" src={firebase.auth.currentUser!.photoURL!}></img>
    }
    let link_to = (firebase?.is_admin || !firebase?.user) ? "/" : ("/user/" + firebase.user.uid);
    let link_icon = (firebase?.is_admin || !firebase?.user) ? (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/></svg>) : (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>);

    return <div className="header">
        <div className="dashboard_button"><NavLink to={link_to}>{link_icon} Dashboard</NavLink></div>
        {auth_thing}
    </div>

};

export { Header }