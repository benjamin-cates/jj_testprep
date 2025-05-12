import React from "react"
import { NavLink } from "react-router";
import mmap from "../material_map.json";

const AssignmentListing: React.FC<{ user_id: string, location: string, date_and_questions: string }> = (props: { user_id: string, location: string, date_and_questions: string }) => {
    let material_name = props.location.split("|")[0];
    let lesson_name = props.location.split("|")[1];
    let questions = props.date_and_questions.split(",")[1];
    let usa_date_split = props.date_and_questions.split(",")[0].split("-");
    let usa_date = usa_date_split[1] + "/" + usa_date_split[2] + "/" + usa_date_split[0];
    let late = new Date(props.date_and_questions.split(",")[0]) < new Date();
    return <div className="assignment">
        <div>
            <div className="assignment_lesson_name">{lesson_name}</div>
            <div className="assignment_material_name">{material_name}</div>
        </div>
        <div className={"assignment_due_date" + (late ? " late" : "")}>{usa_date}</div>
        <div>
            <div className="assignment_score">{questions} Q's</div>
            <NavLink to={"/user/" + props.user_id + "/material/" + material_name + "/lesson/" + lesson_name}><div className={"assignment_goto_button"}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg></div></NavLink>
        </div>
    </div>
};

const ResponseListing: React.FC<{ user_id: string, location: string, date_and_score: string }> = (props: { user_id: string, location: string, date_and_score: string }) => {
    let [score, unscored, max_score] = props.date_and_score.split(",")[1].split("/").map(Number);
    let material_name = props.location.split("|")[0];
    let lesson_name = props.location.split("|")[1];
    let usa_date_split = props.date_and_score.split(",")[0].split("-");
    let usa_date = "Completed " + usa_date_split[1] + "/" + usa_date_split[2] + "/" + usa_date_split[0];
    return <div className="assignment">
        <div>
            <div className="assignment_lesson_name">{lesson_name}</div>
            <div className="assignment_material_name">{material_name}</div>
        </div>
        <div className="assignment_due_date">{usa_date}</div>
        <div>
            <div className="assignment_score">{unscored == 0 ? (score + "/" + max_score) : "Unscored"}</div>
            <NavLink to={"/user/" + props.user_id + "/material/" + material_name + "/lesson/" + lesson_name}><div className="response_goto_button"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg></div></NavLink>
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