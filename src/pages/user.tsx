import React, { useContext, useEffect, useState } from "react";
import { Header } from "../components/header";
import { useParams } from "react-router";
import { AuthContext } from "../auth";
import { doc, getDoc } from "firebase/firestore";
import { AssignmentListing, ResponseListing } from "../components/assignment_listing";

import "../style/user.css";
import { TabBar } from "../components/tab_bar";
import mmap from "../material_map.json";
import { MaterialListing } from "../components/material_listing";

const UserPage: React.FC = () => {
    const user_id = useParams().user_id as string;
    const firebase = useContext(AuthContext);
    const [userData, setUserData] = useState({} as any);
    const [assignments, setAssignments] = useState({} as { [key: string]: string });
    const [scores, setScores] = useState({} as { [key: string]: string });
    const [assignments_ordered, setAssignmentsOrdered] = useState([] as [string, string][]);
    const [scores_ordered, setScoresOrdered] = useState([] as [string, string][]);
    const [tab, setTab] = useState("Assignments");
    useEffect(() => {
        if (firebase && firebase.user) {
            getDoc(doc(firebase.db, "users", user_id)).then(val => {
                if (!val.exists()) setUserData({ invalid: true } as any);
                else setUserData(val.data());
            }).catch(_ => setUserData({ invalid: true } as any));
            getDoc(doc(firebase.db, "users", user_id, "assignments", "assignments")).then(data => {
                setAssignments(data.data() as any || {});
                setAssignmentsOrdered((Object.entries(data.data() as any || {}) as [string, string][]).sort((a, b) => a[1] < b[1] ? -1 : 1));
            });
            getDoc(doc(firebase.db, "users", user_id, "scores", "scores")).then(data => {
                setScores(data.data() as any || {});
                setScoresOrdered((Object.entries(data.data() as any || {}) as [string, string][]).sort((a, b) => a[1] > b[1] ? -1 : 1));
            });
        }
    }, [user_id, firebase]);
    let tab_content = <></>;
    if (tab == "Assignments") {
        tab_content = <div className="assignments">
            {assignments_ordered.map(([location, date_and_questions]) => {
                return <AssignmentListing key={location} location={location} date_and_questions={date_and_questions} user_id={user_id}></AssignmentListing>
            })}
            {assignments_ordered.length == 0 && <h2>No assignments yet</h2>}
        </div>;
    }
    if (tab == "Responses") {
        tab_content = <div className="responses">
            {scores_ordered.map(([location, date_and_score]) => {
                return <ResponseListing location={location} date_and_score={date_and_score} key={location} user_id={user_id}></ResponseListing>;
            })}
            {scores_ordered.length == 0 && <h2>No scores yet</h2>}
        </div>;
    }
    if (tab == "Materials") {
        tab_content = <div className="materials_list">
            {Object.keys(mmap).map((material_name, i) => {
                return <MaterialListing key={i} setAssignments={setAssignments} assignments={assignments} scores={scores} user_id={user_id} item={(mmap as any)[material_name]}></MaterialListing>
            })}
        </div>;
    }
    return <div className="page">
        <Header></Header>
        <div className="vertical_list">
            <div className="user_data">
                {userData.alias &&
                    <>
                        <img className="user_image" src={userData.image} />
                        <div className="user_info_text">
                            <div className="user_name">{userData.alias}</div>
                            <div className="user_email">{userData.email}</div>
                            <div className="user_school">{userData.school}</div>

                        </div></>}
                {userData.invalid && <h2>User not found</h2>}
            </div>
            <TabBar active_tab={tab} set_tab={setTab} tab_names={["Assignments", "Responses", "Materials"]}></TabBar>
            {tab_content}
        </div>
    </div>;
}


export { UserPage };