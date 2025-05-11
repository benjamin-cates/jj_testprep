import React, { useContext, useEffect, useState } from "react";
import { default_response, Lesson, Question, Response } from "../schema";
import { PageRender } from "./page_renderer";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useParams } from "react-router";
import { AuthContext } from "../auth";
import { Header } from "../components/header";
import { score_response } from "../scoring";

const LessonViewer: React.FC = () => {
    const params = useParams();
    const firebase = useContext(AuthContext);
    const [page, setPage] = useState(0);
    const lesson_name = params.lesson_name as string;
    const material_name = params.material_name as string;
    const [response, set_response] = useState(() => default_response(material_name, lesson_name));
    const user_id = params.user_id as string;
    const [lesson_data, set_lesson_data] = useState({ pages: [], name: "", id: "" } satisfies Lesson as Lesson);
    const [update_scores, set_update_scores] = useState(false);

    useEffect(() => {
        if (!firebase) return;
        if (firebase.user) {
            fetch(
                "/" + material_name + "/" + lesson_name + ".json",
            ).then(resp => {
                resp.json().then(data => {
                    set_lesson_data(data);
                    let blank_answers = {} as { [key: string]: string };
                    for (let page = 0; page < data.pages.length; page++) {
                        for (let item = 0; item < data.pages[page].content.length; item++) {
                            if ((data.pages[page].content[item] as any).number) {
                                blank_answers[page + "," + (data.pages[page].content[item] as any).number] = "N,";
                            }
                        }
                    }
                    set_response({ ...response, answers: blank_answers });
                    getDoc(doc(firebase.db, "users", user_id, "responses", material_name + "|" + lesson_name)).then(data => {
                        if (data.exists()) set_response({ ...data.data(), answers: { ...blank_answers, ...data.get("answers") } } as any);
                    });
                });
            });
        }
    }, [firebase, firebase?.user, lesson_name, user_id]);
    if (lesson_data.pages.length == 0) {
        return <div className="page"><Header></Header></div>

    }
    const update_answer = (number: string, new_answer: string) => {
        let new_answers = { ...response.answers };
        new_answers[page + "," + number] = "N," + new_answer;
        set_response({ ...response, answers: new_answers });
    };
    const submit = (my_answers: Response) => {
        if (!firebase || !firebase.user) return alert("User login expired");
        my_answers = score_response(lesson_data, my_answers);
        console.log(my_answers);
        setDoc(doc(firebase.db, "users", user_id, "responses", material_name + "|" + lesson_name), my_answers).then(() => {
            console.log("Submitted answers");
        })
        if (my_answers.completion_date != "") {
            deleteDoc(doc(firebase.db, "users", user_id, "assignments", material_name + "|" + lesson_name)).then(() => {
                console.log("Deleted assignment");
            })
        }
        set_response({ ...my_answers });
    };
    const submit_page = () => {
        let new_answers = { ...response.answers };
        for (let [key, _value] of Object.entries(new_answers)) {
            if (key.startsWith(page + ",")) {
                new_answers[key] = "S," + new_answers[key].split(",").slice(1).join(",");
            }
        }
        submit({ ...response, answers: new_answers });
    };
    const set_score_button = (number: string) => {
        let key = page + "," + number;
        let new_answers = { ...response };
        let score = prompt("Enter the score for question " + number);
        if (score == null) return;
        let max_score = (lesson_data.pages[page].content.find(x => (x as any).number == number) as any)?.weight || 1;
        console.log(max_score);
        new_answers.answers[key] = "S-" + (parseInt(score) || 0) + "/0/" + max_score + "," + new_answers.answers[key].split(",").slice(1).join(",");
        set_response(new_answers);
        set_update_scores(true);
    }
    let unanswered = [];
    let not_submitted = false;
    for (let [key, value] of Object.entries(response.answers)) {
        if (key.startsWith(page + ",") && value == "N,") unanswered.push(key.split(",")[1]);
        if (key.startsWith(page + ",") && value.startsWith("N,")) not_submitted = true;
    }
    const page_buttons = <div className="page_turn_buttons"><button onClick={() => setPage(Math.max(page - 1, 0))} className={page == 0 ? "inactive" : "active"}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="-200 -960 960 960" width="24px" fill="#FFFFFF"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" /></svg></button>

        {!firebase?.is_admin && !not_submitted && <div>Page {page + 1} submitted</div>}
        {!firebase?.is_admin && not_submitted && unanswered.length == 0 && <button className="submit active" onClick={submit_page}>{not_submitted ? "Submit page" : "Answers submitted"}</button>}
        {!firebase?.is_admin && unanswered.length != 0 && <button className="submit" onClick={() => alert("Questions " + unanswered + " have not been answered")}>Submit page</button>}
        {firebase?.is_admin && <button className={"update_scores" + (update_scores ? " active" : "")} onClick={() => { submit(response); set_update_scores(false) }}>Update Scores</button>}
        <div>Page {page + 1}/{lesson_data.pages.length}</div><button onClick={() => setPage(Math.min(page + 1, lesson_data.pages.length - 1))} className={page == lesson_data.pages.length - 1 ? "inactive" : "active"}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" /></svg></button></div>;
    return <>
        <div className="page">
            <Header></Header>
            {page_buttons}
            {lesson_data.pages[page] && <PageRender set_score={set_score_button} page={lesson_data.pages[page]} current_answers={response} page_number={page} update_answer={update_answer}></PageRender>}
        </div >
    </>;

};

export { LessonViewer };