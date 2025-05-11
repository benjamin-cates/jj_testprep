import "react";
import React from "react";
import { Page, Response } from "../schema";
import { ComponentRenderer } from "../components/component_renderer";

interface Props {
    page: Page
    page_number: number
    update_answer: (question_number: string, new_answer: string) => void,
    current_answers: Response,
    set_score: (number: string) => void,
}

const PageRender: React.FC<Props> = (props: Props) => {
    return <div className="page_view_wrapper">
        <div className="page_view">
            <div className="page_name">{props.page.name}</div>
            <div className="page_subheading">{props.page.subheading}</div>
            {props.page.content.map((component, i) => {
                return (<ComponentRenderer set_score={props.set_score} key={i} page_id={props.page_number} item={component} show_explanations={false} responses={props.current_answers} update_answer={props.update_answer}></ComponentRenderer>)
            })}
        </div>
    </div>;
}

export { PageRender };