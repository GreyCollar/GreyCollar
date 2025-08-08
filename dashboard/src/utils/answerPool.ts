const IMPROVEMENT_ANSWERS = [
  "Your answer needs improvement. Please try again.",
  "I need more information from you. Could you please elaborate?",
  "Your response is incomplete. Please provide more details.",
  "Please provide a more comprehensive answer.",
  "Your answer could be clearer. Please rephrase your response.",
];

const CORRECT_ANSWERS = [
  "Excellent! Your answer is correct. 👍",
  "Perfect! Well done!",
  "Great job! Your answer is accurate.",
  "Spot on! You've got it right.",
  "Excellent work! Your response is correct.",
  "👍",
];

export const getRandomImprovementAnswer = () => {
  return IMPROVEMENT_ANSWERS[
    Math.floor(Math.random() * IMPROVEMENT_ANSWERS.length)
  ];
};

export const getRandomCorrectAnswer = () => {
  return CORRECT_ANSWERS[Math.floor(Math.random() * CORRECT_ANSWERS.length)];
};
