import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { QuizMetadata } from "./types";

interface QuizFormProps {
  onSubmit: (data: QuizMetadata) => void;
  existingMetadata?: QuizMetadata | null;
}

const QuizForm: React.FC<QuizFormProps> = ({ onSubmit, existingMetadata }) => {
  const [totalMarks, setTotalMarks] = useState(0);
  const [numQuestions, setNumQuestions] = useState(1);
  const [deadlineOption, setDeadlineOption] = useState<"NO_DEADLINE" | "DEADLINE">("NO_DEADLINE");
  const [deadline, setDeadline] = useState("");
  const [allowHint, setAllowHint] = useState(false);

  // Pre-fill form if editing existing quiz
  useEffect(() => {
    if (existingMetadata) {
      setTotalMarks(existingMetadata.passThreshold || 0);
      setNumQuestions(existingMetadata.maxAttempts || 1);
      setDeadlineOption(existingMetadata.quizType);
      setDeadline(existingMetadata.deadline ? new Date(existingMetadata.deadline).toISOString().slice(0, 16) : "");
      setAllowHint(existingMetadata.allowHint || false);
    }
  }, [existingMetadata]);

  const handleSubmit = () => {
    onSubmit({
      passThreshold: totalMarks,
      maxAttempts: numQuestions,
      quizType: deadlineOption,
      deadline: deadlineOption === "DEADLINE" ? new Date(deadline) : undefined,
      allowHint: allowHint,
      allowPartialGrading: false,
      questionVisibility: 0,
      releaseTime: undefined,
      approximateTimeToComplete: "",
      showCorrectAnswersAfterSubmission: false,
      showExplanationAfterSubmission: false,
      showScoreAfterSubmission: false,
    });
  };

  return (
    <div className="w-full space-y-4">
      
      <div className="flex flex-col space-y-1">
        <Label>Total Marks:</Label>
        <Input
          type="number"
          value={totalMarks}
          onChange={(e) => setTotalMarks(Number(e.target.value))}
        />
      </div>

      <div className="flex flex-col space-y-1">
        <Label>Number of Attempts:</Label>
        <Input
          type="number"
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
        />
      </div>

      <div className="flex flex-col space-y-1">
        <Label>Deadline Option:</Label>
        <Select value={deadlineOption} onValueChange={(value) => setDeadlineOption(value as "NO_DEADLINE" | "DEADLINE")}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NO_DEADLINE">NO DEADLINE</SelectItem>
            <SelectItem value="DEADLINE">DEADLINE</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {deadlineOption === "DEADLINE" && (
        <div className="flex flex-col space-y-1">
          <Label>Deadline Date & Time:</Label>
          <Input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch checked={allowHint} onCheckedChange={setAllowHint} />
        <Label>Allow Hint</Label>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit}>
          Save Metadata
        </Button>
      </div>
    </div>
  );
};

export default QuizForm;
