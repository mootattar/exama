"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { QuestionForm } from "@/components/exam/question-form";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useExamStore, Question } from "@/lib/exam-store";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  Eye,
  Clock,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function EditExamPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { getExam, updateExam } = useExamStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState<number | undefined>(undefined);
  const [hasTimeLimit, setHasTimeLimit] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  useEffect(() => {
    const foundExam = getExam(params.id as string);
    setTitle(foundExam?.title || "");
    setDescription(foundExam?.description || "");
    setTimeLimit(foundExam?.timeLimit);
    setQuestions(foundExam?.questions || []);
    setIsPublished(foundExam?.isPublished || false);
    setStartDate(foundExam?.startsAt || "");
    setEndDate(foundExam?.endsAt || "");
    if (foundExam?.timeLimit) {
      setHasTimeLimit(true);
    }
  }, [params.id, getExam]);

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setShowQuestionForm(true);
  };

  const handleEditQuestion = (index: number) => {
    setEditingQuestion(index);
    setShowQuestionForm(true);
  };

  const handleSaveQuestion = (questionData: Omit<Question, "id">) => {
    const newQuestion: Question = {
      ...questionData,
      id: Date.now().toString(),
    };

    if (editingQuestion !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestion] = newQuestion;
      setQuestions(updatedQuestions);
    } else {
      setQuestions([...questions, newQuestion]);
    }

    setShowQuestionForm(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSaveExam = async () => {
    if (!title.trim()) {
      alert("Please enter an exam title");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }
    if (startDate >= endDate && hasTimeLimit) {
      alert("please add correct date!");
      return;
    }

    setIsSaving(true);
    if (!user) {
      return;
    }
    try {
      const examId = params.id as string;
      const examData = {
        title: title.trim(),
        description: description.trim(),
        questions,
        timeLimit: hasTimeLimit ? timeLimit : undefined,
        isPublished,
        startsAt: startDate,
        endsAt: endDate,
      };
      updateExam(examId, examData, user.id);
      router.push(`/dashboard/exams/${examId}`);
    } catch (error) {
      alert("Failed to save exam. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const getQuestionTypeColor = (type: Question["type"]) => {
    switch (type) {
      case "multiple-choice":
        return "bg-blue-500";
      case "true-false":
        return "bg-green-500";
      case "open-ended":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  if (showQuestionForm) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <QuestionForm
              question={
                editingQuestion !== null
                  ? questions[editingQuestion]
                  : undefined
              }
              onSave={handleSaveQuestion}
              onCancel={() => {
                setShowQuestionForm(false);
                setEditingQuestion(null);
              }}
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Exam</h1>
            <p className="text-muted-foreground">
              Build your exam by adding details and questions
            </p>
          </div>

          <div className="space-y-8">
            {/* Exam Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Exam Details
                </CardTitle>
                <CardDescription>
                  Basic information about your exam
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Exam Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter exam title..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the exam..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="time-limit"
                    checked={hasTimeLimit}
                    onCheckedChange={setHasTimeLimit}
                  />
                  <Label htmlFor="time-limit">Set time limit</Label>
                </div>

                {hasTimeLimit && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="time-limit-value">
                        Time Limit (minutes)
                      </Label>
                      <Input
                        id="time-limit-value"
                        type="number"
                        value={timeLimit || ""}
                        onChange={(e) =>
                          setTimeLimit(parseInt(e.target.value) || undefined)
                        }
                        placeholder="60"
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="datetime-local"
                        value={startDate || ""}
                        onChange={(e) => setStartDate(e.target.value)}
                        // onChange={(e) => console.log(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="datetime-local"
                        value={endDate || ""}
                        onChange={(e) => setEndDate(e.target.value)}
                        // onChange={(e) => console.log(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                  <Label htmlFor="published">Publish immediately</Label>
                </div>
              </CardContent>
            </Card>

            {/* Questions Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      Questions ({questions.length})
                      {totalPoints > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {totalPoints} points total
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Add different types of questions to your exam
                    </CardDescription>
                  </div>
                  <Button onClick={handleAddQuestion}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {questions.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No questions yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start building your exam by adding your first question
                    </p>
                    <Button onClick={handleAddQuestion}>
                      Add Your First Question
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium">
                                Question {index + 1}
                              </span>
                              <div
                                className={`w-2 h-2 rounded-full ${getQuestionTypeColor(
                                  question.type
                                )}`}
                              />
                              <Badge variant="outline" className="text-xs">
                                {question.type.replace("-", " ")}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {question.points} pts
                              </Badge>
                            </div>
                            <p className="text-sm mb-2">{question.question}</p>

                            {question.type === "multiple-choice" &&
                              question.options && (
                                <div className="text-xs text-muted-foreground">
                                  {question.options.length} options • Correct:
                                  Option{" "}
                                  {(question.correctAnswer as number) + 1}
                                </div>
                              )}

                            {question.type === "true-false" && (
                              <div className="text-xs text-muted-foreground">
                                Correct answer: {question.correctAnswer}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditQuestion(index)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteQuestion(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  {questions.length} questions
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {totalPoints} points
                </div>
                {hasTimeLimit && timeLimit && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {timeLimit} minutes
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/exams")}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveExam}
                  disabled={
                    isSaving ||
                    !title.trim() ||
                    questions.length === 0 ||
                    (startDate.length > 0 &&
                      endDate.length > 0 &&
                      startDate >= endDate)
                  }
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isPublished ? "Publish Exam" : "Save Draft"}
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Validation Alert */}
            {(!title.trim() || questions.length === 0) && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please add a title and at least one question before saving.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
