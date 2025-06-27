import { QuizQuestion } from './types';

const mockGenerateQuestions = (): QuizQuestion[] => [
  {
    id: "1",
    type: "SELECT_ONE_IN_LOT",
    question: "Sample MCQ?",
    options: ["A", "B", "C"],
    points: 2
  },
  {
    id: "2",
    type: "DESCRIPTIVE",
    question: "Explain your answer.",
    points: 5
  }
];

const QuestionGenerator = ({ onGenerate }: { onGenerate: (questions: QuizQuestion[]) => void }) => {
  const handleGenerate = () => {
    const generated = mockGenerateQuestions();
    onGenerate(generated);
  };

  return (
    <div className="mt-4">
      <button onClick={handleGenerate} className="bg-green-500 text-white px-3 py-1 rounded">Generate Questions</button>
      <button className="ml-4 bg-yellow-500 text-white px-3 py-1 rounded">Add Manually (coming soon)</button>
    </div>
  );
};

export default QuestionGenerator;
