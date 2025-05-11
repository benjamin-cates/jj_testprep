import React, { useContext, useEffect, useState } from "react";
import { Header } from "../components/header";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NavLink, useNavigate } from "react-router";

import "../style/dashboard.css";
import { AuthContext } from "../auth";

interface Props {

}
interface UserProps {
    image: string,
    admin: boolean,
    alias: string,
    email: string,
    uid: string,
}
const UserListing: React.FC<UserProps> = (props: UserProps) => {
    return <NavLink to={"user/" + props.uid} className="user_listing">
        <div>
            <img className="user_listing_image" src={props.image || "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"}></img>
            <div className="user_names"><div>{props.alias}</div><div>{props.email}</div></div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#222222"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg>
    </NavLink>;
};

const Dashboard: React.FC<Props> = (props: Props) => {
    const firebase = useContext(AuthContext);
    let navigate = useNavigate();
    const [users_list, set_users_list] = useState([] as any[]);
    useEffect(() => {
        if (!firebase) return;
        if (!firebase.is_admin) {

            if (firebase.user) navigate("/user/" + firebase.user.uid);
            return;
        }
        let users_collection = collection(firebase.db, "users")
        const q = query(users_collection);
        getDocs(q).then(value => {
            console.log(value)
            let user_list = [] as any;
            value.forEach(val => {
                user_list.push(val.data());
            });
            set_users_list(user_list);
        });
    }, [firebase?.user, firebase?.is_admin]);
    let header = <Header></Header>;
    if (!firebase || !firebase.user) {
        return <>{header}<div>You are not logged in</div></>;
    }
    if (firebase.is_admin) {
        return <div className="page">
            {header}
            <h2>Users List</h2>
            <div className="vertical_list">
                {users_list.map((v, i) => (<UserListing key={i} {...v}></UserListing>))}
            </div>
        </div>;
    }
    return <div className="page">
        {header}
        Hello user
    </div>;
}


export { Dashboard };