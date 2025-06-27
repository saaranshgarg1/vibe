import { QuizQuestion } from "./types";
import { Input } from "@/components/ui/input";

type Props = {
  questions: QuizQuestion[];
  setQuestions: (questions: QuizQuestion[]) => void;
};

const GeneratedQuestionsList: React.FC<Props> = ({ questions, setQuestions }) => {

  const handleDelete = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleTimeLimitChange = (index: number, newTime: number) => {
    const updated = [...questions];
    updated[index].timeLimit = newTime * 60; // Convert minutes to seconds
    setQuestions(updated);
  };

  return (
    <div className="space-y-4">
      {questions.map((q, index) => (
        <div
          key={q.id}
          className="border border-gray-300 p-4 rounded-md space-y-2 bg-gray-50"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">
              {index + 1}. {q.question} ({q.type})
            </h4>
            <button
              className="text-red-600 hover:underline"
              onClick={() => handleDelete(q.id)}
            >
              Delete
            </button>
          </div>

          {q.hint && (
            <p className="text-sm text-gray-600">
              <strong>Hint:</strong> {q.hint}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <strong>Time Limit (minutes):</strong>
            <Input
              type="number"
              min={1}
              className="w-24 h-8"
              value={Math.round((q.timeLimit || 60) / 60)}
              onChange={(e) =>
                handleTimeLimitChange(index, parseInt(e.target.value) || 1)
              }
            />
          </div>

          {q.options && q.options.length > 0 && (
            <div>
              <p className="font-medium">Options:</p>
              <ul className="list-disc ml-6">
                {q.options.map((opt: any, idx: number) => (
                  <li
                    key={opt.id || idx}
                    className={q.correctAnswerIndex === idx ? "text-green-600 font-semibold" : ""}
                  >
                    {typeof opt === "string" ? opt : opt.text}{" "}
                    {q.correctAnswerIndex === idx && "(Correct)"}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      ))}
    </div>
  );
};

export default GeneratedQuestionsList;
