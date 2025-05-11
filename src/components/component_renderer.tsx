import React, { useContext } from "react";
import { Component, Passage, Question, Response } from "../schema";
import { AuthContext } from "../auth";


interface Props {
    item: Component,
    page_id: number,
    responses: Response,
    update_answer: (question_number: string, new_answer: string) => void,
    show_explanations: boolean,
    set_score: (number: string) => void,
}

const ComponentRenderer: React.FC<Props> = (props: Props) => {
    const firebase = useContext(AuthContext);
    const check = <svg xmlns="http://www.w3.org/2000/svg" height="0.9em" viewBox="-20 -1010 960 960" width="0.9em" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" /></svg>;
    const x = <svg xmlns="http://www.w3.org/2000/svg" height="0.9em" viewBox="0 -960 960 960" width="0.9em" fill="#fff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>;
    const right = <svg xmlns="http://www.w3.org/2000/svg" height="0.9em" viewBox="-20 -940 960 960" width="0.9em" fill="#fff"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg>;

    if ((props.item as any).definition) {
        return <div className="definition_component">
            <div className="word">{(props.item as any).word}</div>
            <div className="definition" dangerouslySetInnerHTML={{ __html: (props.item as any).definition }}></div>
        </div>;
    }
    if ((props.item as any).number) {
        let question = props.item as Question;
        let user_answer = (props.responses.answers[props.page_id + "," + question.number] || "").split(",")[1];
        let user_submitted = (props.responses.answers[props.page_id + "," + question.number] || "").startsWith("S");
        let q = <div className="question_question" dangerouslySetInnerHTML={{ __html: question.question || "Select the best answer" }}></div>
        let number = <div className="question_number">{question.number}</div>;
        let top_right = <div>{question.weight || 1} Point</div>;
        if (user_submitted) {
            let scores = props.responses.answers[props.page_id + "," + question.number].split(",")[0].substring(2).split("/").map(v => Number(v));
            if (scores[1] != 0) {
                top_right = <div>Unscored/{question.weight || 1}</div>;
                if (firebase?.is_admin) {
                    top_right = <button className="score_button" onClick={() => props.set_score(question.number)}>Set Score</button>
                }
            }
            else {
                top_right = <div>{scores[0]}/{scores[2]}</div>
            }
        }
        let header = <div className="question_header"><div>{number}{q}</div>{top_right}</div>;
        let middle = <>Question type not found</>;
        if (question.type == "mcq") {
            let ans = question.answer.charCodeAt(0) - "A".charCodeAt(0);
            let user_code = user_answer.charCodeAt(0) - "A".charCodeAt(0);
            middle = <div className="mcq">{
                (question.options as string[]).map((v, i) => {
                    let class_name = "";
                    if (user_code == i) class_name += " user_selected";
                    let symbol = "" as any
                    if (user_submitted) {
                        class_name += ans == i ? " correct" : " incorrect";
                        symbol = [[right, ""], [check, x]][class_name.includes("user") ? 1 : 0][class_name.includes("incor") ? 1 : 0];
                    }
                    return (<div key={i} onClick={() => { if (!user_submitted) props.update_answer(question.number, String.fromCharCode("A".charCodeAt(0) + i)) }} className={"option_box" + (user_submitted ? "" : " mutable")}><div className={"selection_box box_mcq" + class_name}>{symbol}</div><div className={"mcq_option" + class_name} dangerouslySetInnerHTML={{ __html: v }}></div></div>);
                })
            }</div >;
        }
        else if (question.type == "multi_select") {
            let ans_list = question.answer.split("").map(v => v == "T" ? true : false);
            let user_ans_list = (user_answer || "F".repeat(question.options!.length)).split("").map(v => v == "T" ? true : false);
            middle = <div className="multi_select">{
                (question.options as string[]).map((v, i) => {
                    let class_name = "";
                    if (user_ans_list[i]) class_name += " user_selected";
                    if (user_submitted) class_name += ans_list[i] ? " correct" : " incorrect";
                    let toggled = user_ans_list.slice();
                    toggled[i] = !toggled[i];
                    return (<div onClick={() => {
                        if (!user_submitted) props.update_answer(question.number, toggled.map(v => v ? "T" : "F").join(""))
                    }} className={"option_box" + (user_submitted ? "" : " mutable")} key={i}><div className={"selection_box box_multi" + class_name}>{user_submitted && (class_name.includes("incor") ? "" : (class_name.includes("user") ? check : right))}</div><div className={"multi_select_option" + class_name} dangerouslySetInnerHTML={{ __html: v }}></div></div>);
                })
            }</div >;
        }
        else if (question.type == "frq_short") {
            if (user_submitted || firebase?.is_admin) {
                middle = <div className="frq_short">
                    {user_answer || "No answer submitted"}
                </div>;
            }
            else {
                middle = <div className="frq_short">
                    <input className="frq_input" onChange={(e) => props.update_answer(question.number, e.currentTarget.value)} value={user_answer}></input>
                </div>;

            }
        }
        else if (question.type == "frq_long") {
            middle = <div className="frq_long">
                <input className="frq_input" onChange={(e) => props.update_answer(question.number, e.currentTarget.value)} value={user_answer}></input>
            </div>;
        }
        return <div className="question component">
            {header}
            {middle}
            {props.show_explanations && <div className="explanation" dangerouslySetInnerHTML={{ __html: (question.explanation || "No explanation available") }}></div>}
        </div>
    }
    if ((props.item as any).section_header) {
        return <div className="section_header component">{(props.item as any).section_header}</div>
    }
    if ((props.item as any).passage) {
        let passage = props.item as Passage;
        return <>
            {passage.name && <div className="passage_name component">{passage.name}</div>}
            {(props.item as any).passage.map((v: string, i: number) => (<div key={i} dangerouslySetInnerHTML={{ __html: v }}></div>))}
        </>

    }
};


export { ComponentRenderer };