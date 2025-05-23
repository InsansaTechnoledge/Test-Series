export const calculateResult = (responses) => {
    let totalMarks = 0;
    const wrongAnswers = [];
    const unattempted = [];

    responses.forEach(({ question_id, user_response, correct_response, question_type, positive_marks, negative_marks }) => {

        const isAttempted =
            user_response !== null &&
            user_response !== undefined &&
            (
                typeof user_response === 'boolean' ||
                (typeof user_response === 'string' && user_response.trim() !== '') ||
                (typeof user_response === 'number') ||
                (Array.isArray(user_response) && user_response.length > 0) ||
                (typeof user_response === 'object' && Object.keys(user_response).length > 0)
            );

        let isCorrect = false;

        if (!isAttempted) {
            unattempted.push(question_id);
            return;
        };

        switch (question_type) {
            case "mcq":
            case "numerical":
            case "tf":
            case "fill":
                isCorrect = user_response.toString().trim().toLowerCase() === correct_response.toString().trim().toLowerCase()
                break;
            case 'msq': // multiple correct options
                if (Array.isArray(user_response) && Array.isArray(correct_response)) {
                    const sortedUser = [...user_response].sort();
                    const sortedCorrect = [...correct_response].sort();
                    isCorrect = JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
                }
                break;
            case 'match': // compare key-value mappings
                if (
                    typeof user_response === 'object' &&
                    typeof correct_response === 'object'
                ) {
                    const userKeys = Object.keys(user_response);
                    const correctKeys = Object.keys(correct_response);
                    isCorrect = userKeys.length === correctKeys.length &&
                        userKeys.every(key => user_response[key] === correct_response[key]);
                }
                break;
            case 'comprehension':
                isCorrect = true;
                for (let subId in correct_response) {
                    const correct = correct_response?.[subId][0];
                    const user = user_response?.[subId];
                    console.log("UEER", user);

                    const isUserAttempted =
                        user !== null &&
                        user !== undefined &&
                        (
                            typeof user === 'boolean' ||
                            (typeof user === 'string' && user.trim() !== '') ||
                            (typeof user === 'number') ||
                            (Array.isArray(user) && user.length > 0) ||
                            (typeof user === 'object' && Object.keys(user).length > 0)
                        );


                    if (!isUserAttempted) {
                        continue;
                    }
                    const positive_marks = correct_response?.[subId][1];
                    const negative_marks = correct_response?.[subId][2];
                    const question_type = correct_response?.[subId][3];
                    let subCorrect = false;
                    console.log(question_type);
                    switch (question_type) {
                        case "mcq":
                        case "numerical":
                        case "tf":
                            subCorrect = user?.toString().trim().toLowerCase() === correct?.toString().trim().toLowerCase();

                            console.log(subCorrect);
                            break;

                        case "msq":
                            subCorrect = Array.isArray(user) &&
                                Array.isArray(correct) &&
                                user.length === correct.length &&
                                user.every(val => correct.includes(val));
                            break;

                        case "fill":
                            subCorrect = typeof user === "string" &&
                                typeof correct === "string" &&
                                user.trim().toLowerCase() === correct.trim().toLowerCase();
                            break;

                        case "matching":
                            subCorrect = typeof user === "object" &&
                                typeof correct === "object" &&
                                Object.keys(correct).every(
                                    key => user[key] === correct[key]
                                );
                            break;

                        default:
                            subCorrect = false;
                    }

                    if (!subCorrect) {
                        isCorrect = false;
                        totalMarks -= negative_marks;
                    }
                    else {
                        totalMarks += positive_marks;
                    }

                }
                break;
            default:
                isCorrect = false
        }

        if (question_type !== 'comprehension') {
            totalMarks += isCorrect ? positive_marks : negative_marks;
        }

        if (!isCorrect) {
            wrongAnswers.push({
                questionId: question_id,
                response: user_response
            });
        }

    });

    return { totalMarks, unattempted, wrongAnswers };
}


// switch (question.question_type) {
//     case "mcq":
//         return question.correct_option;
//     case "msq":
//         return question.correct_options;
//     case "fill":
//     case "numerical":
//         return question.correct_answer;
//     case "tf":
//         return question.is_true;
//     case "match":
//         return question.correct_pairs;
//     case "comprehension":
//         return question.sub_questions.reduce((acc, sub_q) => {
//             const response = getCorrectResponse(sub_q);
//             return {
//                 ...acc,
//                 [sub_q.id]: response
//             };
//         }, {})
//     default:
//         return question.correct_response;
// }