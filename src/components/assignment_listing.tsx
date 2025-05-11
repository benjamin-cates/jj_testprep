import React, { useContext } from "react"
import { Assignment, Response } from "../schema"
import { AuthContext } from "../auth";
import { NavLink } from "react-router";
import mmap from "../material_map.json";

const AssignmentListing: React.FC<{ user_id: string, item: Assignment }> = (props: { user_id: string, item: Assignment }) => {
    const is_admin = useContext(AuthContext)?.is_admin || false;
    let item = props.item;
    let late = new Date(item.due_date) < new Date();
    let usa_date_split = item.due_date.split("-");
    let usa_date = usa_date_split[1] + "/" + usa_date_split[2] + "/" + usa_date_split[0];
    return <div className="assignment">
        <div>
            <div className="assignment_lesson_name">{item.lesson_name}</div>
            <div className="assignment_material_name">{item.material_name}</div>
        </div>
        <div className={"assignment_due_date" + (late ? " late" : "")}>{usa_date}</div>
        <div>
            <div className="assignment_score">{item.questions} Q's</div>
            <NavLink to={"/user/" + props.user_id + "/material/" + item.material_name + "/lesson/" + item.lesson_name}><div className={"assignment_goto_button"}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg></div></NavLink>
        </div>
    </div>
};

const ResponseListing: React.FC<{ user_id: string, item: Response }> = (props: { user_id: string, item: Response }) => {
    let item = props.item;
    let usa_date_split = item.completion_date.split("-");
    let usa_date = item.completion_date == "" ? "" : ("Completed " + usa_date_split[1] + "/" + usa_date_split[2] + "/" + usa_date_split[0]);
    return <div className="assignment">
        <div>
            <div className="assignment_lesson_name">{item.lesson_name}</div>
            <div className="assignment_material_name">{item.material_name}</div>
        </div>
        <div className="assignment_due_date">{usa_date}</div>
        <div>
            <div className="assignment_score">{item.unscored == 0 ? (item.score + "/" + item.max_score) : "Unscored"}</div>
            <NavLink to={"/user/" + props.user_id + "/material/" + item.material_name + "/lesson/" + item.lesson_name}><div className="response_goto_button"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg></div></NavLink>
        </div>

    </div>
};

const UnassignedListing: React.FC<{ user_id: string, material: string, lesson: string }> = (props: { user_id: string, material: string, lesson: string }) => {
    return <div className="assignment">
        <div>
            <div className="assignment_lesson_name">{props.lesson}</div>
            <div className="assignment_material_name">{props.material}</div>
        </div>
        <div className="assignment_due_date">Not assigned</div>
        <div>
            <div className="assignment_score">{(mmap as any)[props.material]?.lessons?.find((v: any) => v.name == props.lesson)?.questions} Q's</div>
            <NavLink to={"/user/" + props.user_id + "/material/" + props.material + "/lesson/" + props.lesson}><div className="preview_goto_button"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg></div></NavLink>
        </div>

    </div>

}

export { AssignmentListing, ResponseListing, UnassignedListing };