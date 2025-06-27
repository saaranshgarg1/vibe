import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QuizMetadata, QuizQuestion } from "./types";
import QuizForm from "./QuizForm";
import GeneratedQuestionsList from "./GeneratedQuestionsList";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const questionTypes = [
  "SELECT_ONE_IN_LOT",
  "SELECT_MANY_IN_LOT",
  "NUMERIC_ANSWER_TYPE",
  "DESCRIPTIVE",
  "ORDER_THE_LOTS",
] as const;

type QuizOverlayProps = { onClose: () => void };

type SortableOptionProps = {
    id: string;
    idx: number;
    text: string;
    manualType: string;
    correctAnswerIndex: number | null;
    correctAnswerIndexes: number[];
    onChangeOption: (index: number, value: string) => void;
    onSetCorrectIndex: (index: number) => void;
    onToggleCorrectIndexes: (index: number) => void;
  };

  function SortableOption({
  id,
  idx,
  text,
  manualType,
  correctAnswerIndex,
  correctAnswerIndexes,
  onChangeOption,
  onSetCorrectIndex,
  onToggleCorrectIndexes,
}: SortableOptionProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="flex items-center gap-2 border p-2 rounded w-full"
    >
      {/* Drag Handle with listeners */}
      <span
        className="cursor-move w-4 text-center"
        {...attributes}
        {...listeners}
      >
        ::
      </span>

      <span className="w-6 text-center">{idx + 1}.</span>

      <Input
        value={text}
        onChange={(e) => onChangeOption(idx, e.target.value)}
        className="flex-1"
      />

      {manualType === "SELECT_MANY_IN_LOT" && (
        <input
          type="checkbox"
          checked={correctAnswerIndexes.includes(idx)}
          onChange={() => onToggleCorrectIndexes(idx)}
        />
      )}

      {manualType === "SELECT_ONE_IN_LOT" && (
        <input
          type="radio"
          name="correctOption"
          checked={correctAnswerIndex === idx}
          onChange={() => onSetCorrectIndex(idx)}
        />
      )}
    </div>
  );
}


export default function QuizOverlay({ onClose }: QuizOverlayProps) {
  const [metadata, setMetadata] = useState<QuizMetadata | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [showGenerateOptions, setShowGenerateOptions] = useState(false);
  const [showManualSelect, setShowManualSelect] = useState(false);

  const [generateCounts, setGenerateCounts] = useState<Record<string, number>>(
    Object.fromEntries(questionTypes.map((t) => [t, 0]))
  );

  const [manualType, setManualType] = useState<string>("");
  const [manualQuestionText, setManualQuestionText] = useState("");
  const [manualOptions, setManualOptions] = useState<{ id: string, text: string }[]>([
    { id: crypto.randomUUID(), text: "" }
  ]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(null);
  const [correctAnswerIndexes, setCorrectAnswerIndexes] = useState<number[]>([]);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(1);
  const [manualHint, setManualHint] = useState("");
  const [lowerLimit, setLowerLimit] = useState(0);
  const [upperLimit, setUpperLimit] = useState(0);
  const [decimalPrecision, setDecimalPrecision] = useState(0);
  const [descriptiveAnswer, setDescriptiveAnswer] = useState("");

  const sensors = useSensors(useSensor(PointerSensor));

  const handleMetadataSubmit = (data: QuizMetadata) => setMetadata(data);

  const handleGenerateQuestions = () => setShowGenerateOptions(true);
  const handleGenerateSubmit = () => {
    const total = Object.values(generateCounts).reduce((a, b) => a + b, 0);
    if (total === 0) return alert("Enter at least one question count.");
    const newQs: QuizQuestion[] = [];
    questionTypes.forEach((t) => {
      for (let i = 0; i < generateCounts[t]; i++) {
        newQs.push({
          id: `${t}_${Date.now()}_${i}`,
          type: t,
          question: `Auto-generated ${t} question ${i + 1}`,
          points: 1,
          timeLimit: timeLimitMinutes * 60,
        });
      }
    });
    setQuestions((prev) => [...prev, ...newQs]);
    setShowGenerateOptions(false);
  };

  const handleAddManual = () => {
    setShowManualSelect(true);
    setManualType("");
    setManualQuestionText("");
    setManualOptions([{ id: `${Date.now()}`, text: "" }]);
    setCorrectAnswerIndex(null);
    setCorrectAnswerIndexes([]);
    setManualHint("");
    setTimeLimitMinutes(1);
    setLowerLimit(0);
    setUpperLimit(0);
    setDecimalPrecision(0);
    setDescriptiveAnswer("");
    setOrderingSaved(false); 
  };

  const handleAddOption = () => 
    setManualOptions((prev) => [...prev, { id: crypto.randomUUID(), text: "" }]);

  const handleOptionChange = (idx: number, val: string) =>
    setManualOptions((opt) => 
      opt.map((o, i) => 
        i === idx ? { ...o, text: val } : o
      )
    );


  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = manualOptions.findIndex((o) => o.id === active.id);
      const newIndex = manualOptions.findIndex((o) => o.id === over?.id);
      setManualOptions((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  const handleManualSubmit = () => {
    if (!manualType || !manualQuestionText.trim())
      return alert("Please type & select a question.");
    if (manualType === "DESCRIPTIVE" && !descriptiveAnswer.trim())
      return alert("Add descriptive answer.");
    if (
      ["SELECT_ONE_IN_LOT", "SELECT_MANY_IN_LOT", "ORDER_THE_LOTS"].includes(
        manualType
      )
    ) {
      if (manualOptions.some((o) => !o.text.trim()))
        return alert("Fill in all options.");
      if (manualType === "SELECT_ONE_IN_LOT" && correctAnswerIndex === null)
        return alert("Select correct option.");
      if (
        manualType === "SELECT_MANY_IN_LOT" &&
        correctAnswerIndexes.length === 0
      )
        return alert("Select at least one correct.");
      if (manualType === "ORDER_THE_LOTS" && !orderingSaved)
         return alert("Please save the order before submitting.");
    }

    const newQuestion: QuizQuestion & any = {
      id: `${manualType}_${Date.now()}`,
      type: manualType as QuizQuestion["type"],
      question: manualQuestionText,
      points: 1,
      timeLimit: timeLimitMinutes * 60,
      hint: manualHint || undefined,
    };

    if (manualType === "SELECT_ONE_IN_LOT") {
      newQuestion.options = manualOptions;
      newQuestion.correctAnswerIndex = correctAnswerIndex!;
    }

    if (manualType === "SELECT_MANY_IN_LOT") {
      newQuestion.options = manualOptions;
      newQuestion.correctAnswerIndexes = correctAnswerIndexes;
    }

    if (manualType === "NUMERIC_ANSWER_TYPE") {
      newQuestion.solution = {
        lowerLimit,
        upperLimit,
        decimalPrecision,
      };
    }

    if (manualType === "DESCRIPTIVE") {
      newQuestion.solution = {
        solutionText: descriptiveAnswer.trim(),
      };
    }

    if (manualType === "ORDER_THE_LOTS") {
      newQuestion.options = manualOptions;
      newQuestion.solution = {
        ordering: manualOptions.map((opt, idx) => ({
          lotItem: { text: opt, explaination: "" },
          order: idx,
        })),
      };
    }

    setQuestions((prev) => [...prev, newQuestion]);
    setShowManualSelect(false);
  };

  const shouldShowOptions = ["SELECT_ONE_IN_LOT", "SELECT_MANY_IN_LOT", "ORDER_THE_LOTS"].includes(manualType);

  const [orderingSaved, setOrderingSaved] = useState(false);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="w-[90vw] max-w-[90vw] h-[85vh] bg-white flex flex-col items-center rounded-xl shadow-lg px-10 py-8 overflow-y-auto"
        style={{maxWidth: '90vw', width: '90vw'}}
      >
        <div className="w-full flex justify-between">
          <DialogTitle className="text-2xl font-semibold">Create Quiz</DialogTitle>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>

        <section className="w-[85%] space-y-4 border p-4 rounded-md" style={{maxWidth: '85vw', width: '85vw'}} >
          <h3 className="font-medium">Quiz Details</h3>
          <QuizForm onSubmit={handleMetadataSubmit} />
        </section>

        <section className="w-[85%] space-y-4 border p-4 rounded-md" style={{maxWidth: '85vw', width: '85vw'}} >
          <h3 className="font-medium">Generate Questions</h3>

          <div className="flex gap-4">
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleGenerateQuestions}
            >
              Generate Questions
            </Button>
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
              onClick={handleAddManual}
            >
              Add Manually
            </Button>
          </div>

          {showGenerateOptions && (
            <div className="space-y-2 mt-4">
              {questionTypes.map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-2"
                >
                  <label className="w-48">{t}</label>
                  <Input
                    type="number"
                    min={0}
                    value={generateCounts[t]}
                    onChange={(e) =>
                      setGenerateCounts({
                        ...generateCounts,
                        [t]: Number(e.target.value) || 0,
                      })
                    }
                    className="w-32"
                  />
                </div>
              ))}
              <Button onClick={handleGenerateSubmit}>Submit</Button>
            </div>
          )}

          {showManualSelect && (
            <div className="space-y-4 mt-4">
              <label className="font-medium">Select Question Type</label>
              <Select onValueChange={setManualType}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Choose..." />
                </SelectTrigger>
                <SelectContent>
                  {questionTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <label className="font-medium">Enter Question</label>
              <Textarea
                placeholder="Enter question text..."
                value={manualQuestionText}
                onChange={(e) => setManualQuestionText(e.target.value)}
              />

              <label className="font-medium">Time Limit (minutes)</label>
              <Input
                type="number"
                min={1}
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(Number(e.target.value) || 1)}
                className="w-32"
              />

              <label className="font-medium">Hint (optional)</label>
              <Textarea
                placeholder="Optional hint..."
                value={manualHint}
                onChange={(e) => setManualHint(e.target.value)}
              />

              {manualType === "NUMERIC_ANSWER_TYPE" && (
                <div className="space-y-2">
                  <label className="font-medium">Lower Limit</label>
                  <Input
                    type="number"
                    value={lowerLimit}
                    onChange={(e) => setLowerLimit(Number(e.target.value))}
                    className="w-32"
                  />
                  <label className="font-medium">Upper Limit</label>
                  <Input
                    type="number"
                    value={upperLimit}
                    onChange={(e) => setUpperLimit(Number(e.target.value))}
                    className="w-32"
                  />
                  <label className="font-medium">Decimal Precision</label>
                  <Input
                    type="number"
                    min={0}
                    value={decimalPrecision}
                    onChange={(e) => setDecimalPrecision(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
              )}

              {manualType === "DESCRIPTIVE" && (
                <div className="space-y-2">
                  <label className="font-medium">Answer (for LMS Eval)</label>
                  <Textarea
                    placeholder="Enter correct answer..."
                    value={descriptiveAnswer}
                    onChange={(e) => setDescriptiveAnswer(e.target.value)}
                  />
                </div>
              )}

              {shouldShowOptions && (
                <div className="space-y-2">
                  <label className="font-medium">
                    {manualType === "ORDER_THE_LOTS"
                      ? "Options (add & drag to reorder)"
                      : "Answer Options"}
                  </label>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={manualOptions.map((o) => o.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {manualOptions.map((opt, idx) => (
                         <SortableOption
                            key={opt.id}
                            id={opt.id}   
                            idx={idx}
                            text={opt.text}
                            manualType={manualType}
                            correctAnswerIndex={correctAnswerIndex}
                            correctAnswerIndexes={correctAnswerIndexes}
                            onChangeOption={(index, value) =>
                              setManualOptions((options) =>
                                options.map((o, i) =>
                                  i === index ? { ...o, text: value } : o
                                )
                              )
                            }
                            onSetCorrectIndex={setCorrectAnswerIndex}
                            onToggleCorrectIndexes={(index) =>
                              setCorrectAnswerIndexes((prev) =>
                                prev.includes(index)
                                  ? prev.filter((i) => i !== index)
                                  : [...prev, index]
                              )
                            }
                          />
                        ))}
                    </SortableContext>
                  </DndContext>

                  <Button
                    className="mt-2 bg-blue-500 hover:bg-blue-600"
                    onClick={handleAddOption}
                  >
                    Add More Options
                  </Button>

                  {manualType === "ORDER_THE_LOTS" && (
                    <Button
                      className="mt-2 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setOrderingSaved(true);
                        alert("Order Saved as Correct Answer.");
                      }}
                    >
                      Save Order
                    </Button>
                  )}
                </div>
              )}

              <Button
                className="mt-4 bg-yellow-500 hover:bg-yellow-600"
                onClick={handleManualSubmit}
              >
                Add Question
              </Button>
            </div>
          )}
        </section>

        <section className="w-[85%] space-y-4 border p-4 rounded-md" style={{maxWidth: '85vw', width: '85vw'}}>
          <h3 className="font-medium">Generated Questions</h3>
          <GeneratedQuestionsList questions={questions} setQuestions={setQuestions} />
        </section>
      </DialogContent>
    </Dialog>
  );
}
