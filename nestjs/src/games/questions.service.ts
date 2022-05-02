/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionsService {
    questions = [
        {
            question: "Which fast-food company piloted a chicken-flavored nail polish?",
            choices: ["Chick-fil-A", "Popeye's", "KFC", "Boston Market"],
            answer: 2
        }
    ]

    getQuestion() {
        return this.questions[0];
    }
}
