import { Lesson, Question, Response } from "./schema";

const score_response: (l: Lesson, r: Response) => Response = (lesson, response) => {
    let total_score = 0;
    let total_max_score = 0;
    let total_unscored = 0;
    let all_submitted = true;
    for (let i = 0; i < lesson.pages.length; i++) {
        const page = lesson.pages[i]
        for (let j = 0; j < page.content.length; j++) {
            if ((page.content[j] as any).number) {
                let q = page.content[j] as Question;
                let submitted = response.answers[i + "," + q.number].startsWith("S");
                if (!submitted) all_submitted = false;
                let current_scores = response.answers[i + "," + q.number].split(",")[0]?.split("-")?.[1]?.split("/")?.map(v => Number(v)) || [0, q.weight || 1, 0];
                if (!current_scores || current_scores.length != 3) current_scores = [0, q.weight || 1, 0];
                let user_answer = response.answers[i + "," + q.number].split(",").slice(1).join(",");

                let new_scores = current_scores.slice();
                // Set total score to weight
                new_scores[2] = q.weight || 1;
                if (submitted && !q.manual_grading) {
                    console.log(i + "," + q.number);
                    // Set unscored to 0
                    new_scores[1] = 0;
                    // Set score
                    if (q.answer.toLowerCase().trim() == response.answers[i + "," + q.number].split(",").slice(1).join(",").toLowerCase().trim()) {
                        new_scores[0] = q.weight || 1;
                    }
                    else {
                        new_scores[0] = 0;
                    }
                }

                total_score += new_scores[0];
                total_unscored += new_scores[1];
                total_max_score += new_scores[2];
                if (submitted) {
                    response.answers[i + "," + q.number] = "S-" + new_scores.join("/") + "," + user_answer;
                }
            }
        }
    }
    if (response.completion_date == "" && all_submitted) response.completion_date = new Date().toISOString().split("T")[0];
    return { ...response, score: total_score, max_score: total_max_score, unscored: total_unscored };
}

export { score_response };