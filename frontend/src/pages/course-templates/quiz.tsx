import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";

// Define question types
type QuestionType = 'MCQ' | 'MSQ' | 'TEXT';

// Interface for question options
interface QuestionOption {
  id: string;
  text: string;
}

// Interface for quiz items
interface QuizItem {
  id: string;
  title: string;
  marks: number;
  type: QuestionType;
  options?: QuestionOption[];
  correctAnswer?: string | string[];
}

// Props for Quiz component
interface QuizProps {
  time: number; // Time in minutes
  items: QuizItem[];
  onComplete?: (answers: Record<string, any>) => void;
  onTimeUp?: () => void;
}

export default function Quiz({ time, items, onComplete, onTimeUp }: QuizProps) {
  const [open, setOpen] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(time * 60); // Convert minutes to seconds
  
  // Timer
  useEffect(() => {
    if (!open || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [open, timeLeft, onTimeUp]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };
  
  const handleNext = () => {
    if (currentQuestion < items.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleSubmit = () => {
    onComplete?.(answers);
    setOpen(false);
  };
  
  // Render different question types
  const renderQuestion = (question: QuizItem) => {
    switch (question.type) {
      case 'MCQ':
        return (
          <RadioGroup
            value={answers[question.id] || ''}
            onValueChange={(value) => handleAnswer(question.id, value)}
          >
            {question.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 mb-3 p-2 rounded-md hover:bg-slate-50">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="w-full cursor-pointer">{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'MSQ':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => {
              const checked = (answers[question.id] || []).includes(option.id);
              return (
                <div key={option.id} className="flex items-center space-x-2 mb-2 p-2 rounded-md hover:bg-slate-50">
                  <Checkbox 
                    id={option.id}
                    checked={checked}
                    onCheckedChange={(checked) => {
                      const currentAnswers = answers[question.id] || [];
                      let newAnswers;
                      if (checked) {
                        newAnswers = [...currentAnswers, option.id];
                      } else {
                        newAnswers = currentAnswers.filter((id: string) => id !== option.id);
                      }
                      handleAnswer(question.id, newAnswers);
                    }}
                  />
                  <Label htmlFor={option.id} className="w-full cursor-pointer">{option.text}</Label>
                </div>
              );
            })}
          </div>
        );
      case 'TEXT':
        return (
          <Input
            type="text"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder="Type your answer here"
            className="w-full"
          />
        );
      default:
        return <div>Unsupported question type</div>;
    }
  };
  
  const currentQuestionItem = items[currentQuestion];
  const progress = ((currentQuestion + 1) / items.length) * 100;
  const isTimeRunningLow = timeLeft < 60; // Less than a minute
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Quiz</DialogTitle>
          <DialogDescription>
            <div className="flex justify-between items-center">
              <span>Complete all questions before the time runs out</span>
              <span className={`text-lg font-medium ${isTimeRunningLow ? 'text-red-500 flex items-center gap-1' : ''}`}>
                {isTimeRunningLow && <AlertCircle size={16} className="animate-pulse" />}
                {formatTime(timeLeft)}
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-4">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-1 text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {items.length}</span>
            <span>{currentQuestionItem.marks} marks</span>
          </div>
        </div>
        
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div className="mb-1 text-sm text-muted-foreground">
              {currentQuestionItem.type === 'MCQ' && 'Select one option'}
              {currentQuestionItem.type === 'MSQ' && 'Select all that apply'}
              {currentQuestionItem.type === 'TEXT' && 'Type your answer'}
            </div>
            <h3 className="text-lg font-medium mb-4">{currentQuestionItem.title}</h3>
            {renderQuestion(currentQuestionItem)}
          </CardContent>
        </Card>
        
        <div className="flex justify-between mt-4">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          <Button 
            onClick={handleNext}
            variant={currentQuestion < items.length - 1 ? "default" : "default"}
          >
            {currentQuestion < items.length - 1 ? 'Next' : 'Submit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
