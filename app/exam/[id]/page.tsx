"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { useExamStore, Question } from "@/lib/exam-store";
import { useAuth } from "@/lib/auth";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  FileText,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export default function ExamPage() {
  const params = useParams();
  const { user } = useAuth();
  const { getExam, submitExamResult } = useExamStore();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [exam, setExam] = useState(getExam(params.id as string));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const foundExam = getExam(params.id as string);
    setExam(foundExam);
    console.log("found exam is ", foundExam);
    console.log("the exam id is ", params.id);

    if (foundExam && foundExam.timeLimit) {
      setTimeLeft(foundExam.timeLimit * 60); // Convert minutes to seconds
    }
  }, [params.id, getExam]);

  useEffect(() => {
    if (!user && exam) {
      setShowAuthDialog(true);
    }
  }, [user, exam]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev && prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    if (!exam || !user) return;

    let calculatedScore = 0;
    exam.questions.forEach((question) => {
      const userAnswer = answers[question.id];

      if (question.type === "multiple-choice") {
        if (userAnswer === question.correctAnswer) {
          calculatedScore += question.points;
        }
      } else if (question.type === "true-false") {
        if (userAnswer === question.correctAnswer) {
          calculatedScore += question.points;
        }
      }
      // Open-ended questions would need manual grading
    });

    setScore(calculatedScore);
    setIsSubmitted(true);

    submitExamResult({
      examId: exam.id,
      examTitle: exam.title,
      score: calculatedScore,
      totalPoints: exam.questions.reduce((sum, q) => sum + q.points, 0),
      completedAt: new Date(),
      answers,
    });
  };

  if (!exam) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Exam not found</h2>
          <p className="text-muted-foreground">
            The exam you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h1 className="text-3xl font-bold mb-2">{exam.title}</h1>
              <p className="text-muted-foreground">
                {exam.description ||
                  "Complete this exam to test your knowledge"}
              </p>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>{exam.questions.length} questions</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span>
                      {exam.timeLimit
                        ? `${exam.timeLimit} minutes`
                        : "No time limit"}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    <span>
                      {exam.questions.reduce((sum, q) => sum + q.points, 0)}{" "}
                      points
                    </span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Please sign in to take this exam
                </p>

                <Button
                  onClick={() => setShowAuthDialog(true)}
                  className="w-full"
                >
                  Sign In to Start Exam
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <AuthDialog
          isOpen={showAuthDialog}
          onClose={() => setShowAuthDialog(false)}
          onSuccess={() => setShowAuthDialog(false)}
        />
      </div>
    );
  }

  if (isSubmitted) {
    const totalPoints = exam.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / totalPoints) * 100);

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h1 className="text-3xl font-bold mb-2">Exam Complete!</h1>
              <p className="text-muted-foreground">
                You have successfully submitted your exam
              </p>
            </div>

            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <div className="text-4xl font-bold text-green-500 mb-2">
                    {percentage}%
                  </div>
                  <div className="text-lg text-muted-foreground">
                    {score} out of {totalPoints} points
                  </div>
                </div>

                <Progress value={percentage} className="w-full" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="font-semibold">{exam.questions.length}</div>
                    <div className="text-sm text-muted-foreground">
                      Questions
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">
                      {Object.keys(answers).length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Answered
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{score}</div>
                    <div className="text-sm text-muted-foreground">
                      Points Earned
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Thank you for completing "{exam.title}". Your results have
                    been recorded.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = exam.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / exam.questions.length) * 100;
  const isLastQuestion = currentQuestion === exam.questions.length - 1;
  const allAnswered = exam.questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{exam.title}</h1>
                <p className="text-muted-foreground">
                  Question {currentQuestion + 1} of {exam.questions.length}
                </p>
              </div>

              {timeLeft !== null && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span
                    className={`font-mono font-semibold ${
                      timeLeft < 300 ? "text-red-500" : "text-foreground"
                    }`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>
              )}
            </div>

            <Progress value={progress} className="w-full" />
          </div>

          {/* Question */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Question {currentQuestion + 1}
                </CardTitle>
                <Badge variant="secondary">{currentQ.points} points</Badge>
              </div>
              <CardDescription>{currentQ.question}</CardDescription>
            </CardHeader>
            <CardContent>
              {currentQ.type === "multiple-choice" && currentQ.options && (
                <RadioGroup
                  value={answers[currentQ.id]?.toString() || ""}
                  onValueChange={(value) =>
                    handleAnswerChange(currentQ.id, parseInt(value))
                  }
                >
                  {currentQ.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={index.toString()}
                        id={`option-${index}`}
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQ.type === "true-false" && (
                <RadioGroup
                  value={answers[currentQ.id] || ""}
                  onValueChange={(value) =>
                    handleAnswerChange(currentQ.id, value)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="true" />
                    <Label htmlFor="true" className="cursor-pointer">
                      True
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="false" />
                    <Label htmlFor="false" className="cursor-pointer">
                      False
                    </Label>
                  </div>
                </RadioGroup>
              )}

              {currentQ.type === "open-ended" && (
                <Textarea
                  value={answers[currentQ.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(currentQ.id, e.target.value)
                  }
                  placeholder="Enter your answer here..."
                  rows={4}
                />
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              {exam.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    index === currentQuestion
                      ? "bg-primary text-primary-foreground"
                      : answers[exam.questions[index].id] !== undefined
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Submit Exam
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                disabled={currentQuestion === exam.questions.length - 1}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Warning if not all answered */}
          {!allAnswered && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 text-yellow-800">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">
                  You have unanswered questions. Please complete all questions
                  before submitting.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
