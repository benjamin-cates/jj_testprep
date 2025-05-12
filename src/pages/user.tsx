import React, { useContext, useEffect, useState } from "react";
import { Header } from "../components/header";
import { useParams } from "react-router";
import { AuthContext } from "../auth";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { Assignment, Response } from "../schema";
import { AssignmentListing, ResponseListing } from "../components/assignment_listing";

import "../style/user.css";
import { TabBar } from "../components/tab_bar";
import mmap from "../material_map.json";
import { MaterialListing } from "../components/material_listing";

const UserPage: React.FC = () => {
    const user_id = useParams().user_id as string;
    const firebase = useContext(AuthContext);
    const [userData, setUserData] = useState({} as any);
    const [assignments, setAssignments] = useState([] as Assignment[]);
    const [responses, setResponses] = useState([] as Response[]);
    const [tab, setTab] = useState("Assignments");
    useEffect(() => {
        if (firebase && firebase.user) {
            getDoc(doc(firebase.db, "users", user_id)).then(val => {
                setUserData(val.data());
            });
            getDocs(query(collection(firebase.db, "users", user_id, "assignments"), orderBy("due_date"))).then(data => {
                let list = [] as Assignment[];
                data.forEach(val => list.push(val.data() as any as Assignment));
                console.log(list);
                setAssignments(list);
            })
            getDocs(query(collection(firebase.db, "users", user_id, "responses"), orderBy("completion_date", "desc"))).then(data => {
                console.log(data);
                let list = [] as Response[];
                data.forEach(val => list.push(val.data() as any as Response));
                console.log(list);
                setResponses(list);

            })
        }
    }, [user_id, firebase]);
    let tab_content = <></>;
    if (tab == "Assignments") {
        tab_content = <div className="assignments">
            {assignments.map((v, i) => {
                return <AssignmentListing key={i} user_id={user_id} item={v}></AssignmentListing>
            })}
        </div>;

    }
    if (tab == "Responses") {
        tab_content = <div className="responses">
            {responses.map((v, i) => {
                return <ResponseListing key={i} user_id={user_id} item={v}></ResponseListing>;
            })}
        </div>;
    }
    if (tab == "Materials") {
        tab_content = <div className="materials_list">
            {Object.keys(mmap).map((material_name, i) => {
                return <MaterialListing key={i} setAssignments={setAssignments} assignments={assignments} responses={responses} user_id={user_id} item={(mmap as any)[material_name]}></MaterialListing>
            })}
        </div>;
    }
    return <div className="page">
        <Header></Header>
        <div className="vertical_list">
            <div className="user_data">
                <img className="user_image" src={userData.image} />
                <div className="user_info_text">
                    <div className="user_name">{userData.alias}</div>
                    <div className="user_email">{userData.email}</div>
                    <div className="user_school">{userData.school}</div>

                </div>
            </div>
            <TabBar active_tab={tab} set_tab={setTab} tab_names={["Assignments", "Responses", "Materials"]}></TabBar>
            {tab_content}
        </div>
    </div>;
}


export { UserPage };