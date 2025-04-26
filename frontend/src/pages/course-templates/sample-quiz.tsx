import React, { useState } from 'react';
import Quiz from './quiz'; // Assuming Quiz is in the same directory
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, Trophy } from "lucide-react";

// Sample quiz data
const quizItems = [
  {
    id: "q1",
    title: "What is React primarily used for?",
    marks: 5,
    type: 'MCQ' as const,
    options: [
      { id: "a1", text: "Building user interfaces" },
      { id: "a2", text: "Database management" },
      { id: "a3", text: "Server-side processing" },
      { id: "a4", text: "Network security" }
    ],
    correctAnswer: "a1"
  },
  {
    id: "q2",
    title: "Which of the following are JavaScript frameworks or libraries? (Select all that apply)",
    marks: 10,
    type: 'MSQ' as const,
    options: [
      { id: "b1", text: "React" },
      { id: "b2", text: "Angular" },
      { id: "b3", text: "Python" },
      { id: "b4", text: "Vue" }
    ],
    correctAnswer: ["b1", "b2", "b4"]
  },
  {
    id: "q3",
    title: "Explain briefly what is the Virtual DOM in React?",
    marks: 15,
    type: 'TEXT' as const,
    correctAnswer: "virtual dom"
  }
];

export default function SampleQuiz() {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState<Record<string, any>>({});
  const [isTimeUp, setIsTimeUp] = useState(false);
  
  const handleStartQuiz = () => {
    setIsQuizStarted(true);
  };
  
  const handleQuizComplete = (answers: Record<string, any>) => {
    setIsQuizCompleted(true);
    setQuizResults(answers);
    console.log("Quiz completed with answers:", answers);
  };
  
  const handleTimeUp = () => {
    setIsTimeUp(true);
    setIsQuizCompleted(true);
    console.log("Time's up!");
  };
  
  const resetQuiz = () => {
    setIsQuizStarted(false);
    setIsQuizCompleted(false);
    setIsTimeUp(false);
    setQuizResults({});
  };
  
  // Calculate score (simple implementation)
  const calculateScore = () => {
    let score = 0;
    let totalPossible = 0;
    
    quizItems.forEach(item => {
      totalPossible += item.marks;
      
      if (item.type === 'MCQ' && quizResults[item.id] === item.correctAnswer) {
        score += item.marks;
      } else if (item.type === 'MSQ') {
        const selectedAnswers = quizResults[item.id] || [];
        const correctAnswers = item.correctAnswer as string[];
        
        // Check if arrays have the same elements (simple comparison)
        if (selectedAnswers.length === correctAnswers.length && 
            selectedAnswers.every(val => correctAnswers.includes(val))) {
          score += item.marks;
        }
      } else if (item.type === 'TEXT') {
        // Simple case-insensitive substring check
        const userAnswer = (quizResults[item.id] || "").toLowerCase();
        const correctAnswer = (item.correctAnswer as string).toLowerCase();
        
        if (userAnswer.includes(correctAnswer)) {
          score += item.marks;
        }
      }
    });
    
    return { score, totalPossible };
  };
  
  const { score, totalPossible } = isQuizCompleted ? calculateScore() : { score: 0, totalPossible: 0 };
  
  if (!isQuizStarted) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-md">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Sample Quiz</CardTitle>
            <CardDescription>
              Test your knowledge with this quick quiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>Time allowed: 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-muted-foreground" />
                <span>Questions: {quizItems.length}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleStartQuiz} className="w-full">
              Start Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (isQuizCompleted) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-md">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">
              {isTimeUp ? "Time's Up!" : "Quiz Completed"}
            </CardTitle>
            <CardDescription>
              {isTimeUp 
                ? "You ran out of time, but here are your results." 
                : "Thanks for completing the quiz. Here are your results."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="rounded-full bg-primary/10 p-6">
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">
                {score} / {totalPossible}
              </h3>
              <p className="text-center text-muted-foreground">
                {score === totalPossible 
                  ? "Perfect score! Excellent work!" 
                  : score > totalPossible / 2 
                    ? "Good job! Keep learning." 
                    : "Keep practicing to improve your score."}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={resetQuiz} className="w-full">
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <Quiz 
      time={2} // 2 minutes
      items={quizItems} 
      onComplete={handleQuizComplete} 
      onTimeUp={handleTimeUp} 
    />
  );
}
