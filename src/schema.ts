export interface Question {
    mode: "test_question" | "reading_check",
    number: string,
    question?: string,
    options?: string[],
    type: "mcq" | "frq_long" | "frq_short" | "multi_select",
    answer: string,
    explanation?: string,
    weight?: number,
    manual_grading?: boolean
}

export interface Page {
    name: string,
    subheading?: string
    type: "definition_table" | "test" | "lesson" | "reading_check",
    allow_individual_submission?: boolean,
    content: Component[],
    allow_calculator?: boolean,
}

export interface SectionHeader {
    section_header: string,
}

export interface Definition {
    word: string,
    definition: string,
}

export interface Passage {
    passage: string[],
    name?: string
}

export interface Assignment {
    lesson_name: string,
    material_name: string,
    due_date: string,
    questions: string,
}

export interface Response {
    lesson_name: string,
    material_name: string,
    answers: { [id: string]: string },
    max_score: number,
    score: number,
    unscored: number,
    completion_date: string,
    custom_lesson?: Lesson,
}

export interface Material {
    name: string,
    subject: string,
    lessons: { name: string, questions: number }[]
}

export function default_response(material_name: string, lesson_name: string): Response {
    return {
        answers: {},
        max_score: 0,
        score: 0,
        unscored: 0,
        completion_date: "",
        lesson_name: lesson_name,
        material_name: material_name
    }
}

export type Component = SectionHeader | Question | Definition | Passage;

export interface Lesson {
    pages: Page[],
    name: string,
    id: string,
    curve?: string[],
}
