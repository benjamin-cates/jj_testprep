import React, { useContext, useState } from "react";
import { Material } from "../schema";
import { AuthContext } from "../auth";
import { doc, setDoc, writeBatch } from "firebase/firestore";
import { AssignmentListing, ResponseListing, UnassignedListing } from "./assignment_listing";
import "../style/assignment_page.css";

interface Props {
    item: Material,
    assignments: { [key: string]: string },
    scores: { [key: string]: string },
    user_id: string,
    setAssignments: (a: { [key: string]: string }) => void,
}

const MaterialListing: React.FC<Props> = (props: Props) => {
    const firebase = useContext(AuthContext);
    const user_id = props.user_id;
    const material = props.item;
    const [days_of_week, set_days_of_week] = useState([false, false, false, false, false, false, false]);
    const [basis, _set_basis] = useState(new Date());
    const [queue, set_queue] = useState(() => Array.from({ length: material.lessons.length }, () => false));
    const [open, setOpen] = useState(false);
    const [is_assign, setIsAssign] = useState(false);

    let do_dates = days_of_week.includes(true);

    const submit = async () => {
        let batch = writeBatch(firebase!.db);
        let due_date = new Date(basis);
        if (days_of_week[due_date.getDay()] == true) due_date.setDate(due_date.getDate() - 1);
        let new_assignments = { ...props.assignments };
        for (let i in queue) {
            if (queue[i]) continue;
            due_date.setDate(due_date.getDate() + 1);
            if (do_dates) while (days_of_week[due_date.getDay()] == false) due_date.setDate(due_date.getDate() + 1);
            let old_date = due_date.toISOString().split("T")[0];
            if (!do_dates) old_date = "";

            new_assignments[material.name + "|" + material.lessons[i].name] = old_date + "," + material.lessons[i].questions;
        }

        props.setAssignments(new_assignments);
        setDoc(doc(firebase!.db, "users", user_id, "assignments", "assignments"), new_assignments);
        setIsAssign(false);
        await batch.commit();
    };
    let due_date = new Date(basis);
    if (days_of_week[due_date.getDay()] == true) due_date.setDate(due_date.getDate() - 1);
    return <div className="material_box">
        <div className="material_header">
            <button onClick={() => setOpen(!open)} className={open ? "active" : "inactive"}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" /></svg></button>
            <div className="material_header_name">{material.name}</div>
            <div className="material_header_subject">{material.subject}</div>
            {"Completed: " + Object.keys(props.scores).reduce((c, e) => e.startsWith(material.name + "|") ? (c + 1) : c, 0) + "/" + material.lessons.length}
        </div>
        {open && <div className="material_listing_body">
            {firebase?.is_admin &&
                <div className="admin_info">
                    <button className={is_assign ? "cancel_button" : "reassign_button"} onClick={() => {
                        let start_queue = Array.from({ length: material.lessons.length }, () => false);
                        for (let i = 0; i < start_queue.length; i++) {
                            if (props.scores[material.name + "|" + material.lessons[i].name]) {
                                start_queue[i] = true;
                            }
                        }
                        set_queue(start_queue);
                        setIsAssign(!is_assign)
                    }

                    }>{is_assign ? "Cancel" : "Reassign"}</button>
                    {is_assign && <><div className="frequency_buttons">
                        {"SMTWRFS".split("").map((v, i) => (<button key={i} className={"day_of_week" + (days_of_week[i] ? " active" : "")} onClick={() => { let d = days_of_week.slice(); d[i] = !d[i]; set_days_of_week(d); }}>{v}</button>))}</div>
                        <button className="assign_confirmation_button" onClick={submit}>Assign</button></>}
                </div>
            }
            {is_assign && firebase?.is_admin &&
                material.lessons.map((v: any, i: number) => {
                    let response = props.scores[material.name + "|" + v.name];
                    let old_date = "";
                    if (!queue[i]) {
                        due_date.setDate(due_date.getDate() + 1);
                        if (do_dates) while (days_of_week[due_date.getDay()] == false) due_date.setDate(due_date.getDate() + 1);
                        old_date = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][due_date.getDay()] + " " + (due_date.getMonth() + 1) + "/" + (due_date.getDate()) + "/" + (due_date.getFullYear());
                    }
                    return <div key={i} className={"assignment" + (queue[i] ? "" : " active")}>
                        <div>
                            <div className="assignment_lesson_name">{v.name}</div>
                            <div className="assignment_material_name">{material.name}</div>
                        </div>
                        {response && <div className="lesson_date">Completed</div>}
                        {(!response) && (do_dates && !queue[i]) && <div className="lesson_date">{old_date}</div>}
                        <button className={"select_lesson_button" + (queue[i] ? "" : " active")} onClick={() => { let q = queue.slice(); q[i] = !q[i]; set_queue(q); }}></button>
                    </div>;
                })}
            {((!is_assign) || !(firebase?.is_admin)) && material.lessons.map((lesson, i) => {
                let location = material.name + "|" + lesson.name;
                let response = props.scores[location];
                if (response) {
                    return <ResponseListing key={i} location={location} date_and_score={response} user_id={props.user_id}></ResponseListing>
                }
                let assignment = props.assignments[location];
                if (assignment) {
                    return <AssignmentListing key={i} location={location} date_and_questions={assignment} user_id={props.user_id}></AssignmentListing>;
                }
                return <UnassignedListing key={i} lesson={lesson.name} material={material.name} user_id={props.user_id}></UnassignedListing>;

            })}
        </div>
        }
    </div >;

}

export { MaterialListing };