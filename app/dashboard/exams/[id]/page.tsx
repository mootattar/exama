"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useExamStore } from "@/lib/exam-store";
import {
  ArrowLeft,
  Edit,
  Eye,
  Share,
  Clock,
  FileText,
  Award,
  Calendar,
  CheckCircle,
  Circle,
} from "lucide-react";

export default function ExamDetailPage() {
  const params = useParams();
  const { getExam } = useExamStore();
  const exam = getExam(params.id as string);

  if (!exam) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Exam not found</h2>
            <p className="text-muted-foreground mb-4">
              The exam {"you'"}re looking for {"doesn'"}t exist or has been
              deleted.
            </p>
            <Button asChild>
              <Link href="/dashboard/exams">Back to Exams</Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalPoints = exam.questions.reduce((sum, q) => sum + q.points, 0);
  const questionTypes = exam.questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const examUrl = `${window.location.origin}/exam/${exam.id}`;

  const copyExamUrl = () => {
    navigator.clipboard.writeText(examUrl);
    // In a real app, you'd show a toast notification here
    alert("Exam URL copied to clipboard!");
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button variant="ghost" asChild>
                <Link href="/dashboard/exams">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Exams
                </Link>
              </Button>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-3xl font-bold truncate">{exam.title}</h1>
                  <Badge variant={exam.isPublished ? "default" : "secondary"}>
                    {exam.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {exam.description || "No description provided"}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={copyExamUrl}>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/exam/${exam.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`/dashboard/exams/${exam.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Exam Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-semibold">{exam.questions.length}</div>
                    <div className="text-sm text-muted-foreground">
                      Questions
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  <div>
                    <div className="font-semibold">{totalPoints}</div>
                    <div className="text-sm text-muted-foreground">
                      Total Points
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-semibold">
                      {exam.timeLimit ? `${exam.timeLimit} min` : "No limit"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Time Limit
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="font-semibold">
                      {new Date(exam.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Created</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Questions List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Questions ({exam.questions.length})</CardTitle>
                  <CardDescription>
                    Review all questions in this exam
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {exam.questions.map((question, index) => (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">
                              Question {index + 1}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {question.type.replace("-", " ")}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {question.points} pts
                            </Badge>
                          </div>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              question.type === "multiple-choice"
                                ? "bg-blue-500"
                                : question.type === "true-false"
                                ? "bg-green-500"
                                : "bg-purple-500"
                            }`}
                          />
                        </div>

                        <p className="text-sm mb-3">{question.question}</p>

                        {question.type === "multiple-choice" &&
                          question.options && (
                            <div className="space-y-1">
                              {question.options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className="flex items-center space-x-2 text-sm"
                                >
                                  {optionIndex === question.correctAnswer ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-muted-foreground" />
                                  )}
                                  <span
                                    className={
                                      optionIndex === question.correctAnswer
                                        ? "text-green-600 font-medium"
                                        : "text-muted-foreground"
                                    }
                                  >
                                    {option}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                        {question.type === "true-false" && (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              {question.correctAnswer === "true" ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Circle className="w-4 h-4 text-muted-foreground" />
                              )}
                              <span
                                className={
                                  question.correctAnswer === "true"
                                    ? "text-green-600 font-medium"
                                    : "text-muted-foreground"
                                }
                              >
                                True
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              {question.correctAnswer === "false" ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Circle className="w-4 h-4 text-muted-foreground" />
                              )}
                              <span
                                className={
                                  question.correctAnswer === "false"
                                    ? "text-green-600 font-medium"
                                    : "text-muted-foreground"
                                }
                              >
                                False
                              </span>
                            </div>
                          </div>
                        )}

                        {question.type === "open-ended" && (
                          <p className="text-sm text-muted-foreground">
                            Open-ended question - manual grading required
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Exam Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Question Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(questionTypes).map(([type, count]) => (
                      <div
                        key={type}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              type === "multiple-choice"
                                ? "bg-blue-500"
                                : type === "true-false"
                                ? "bg-green-500"
                                : "bg-purple-500"
                            }`}
                          />
                          <span className="text-sm capitalize">
                            {type.replace("-", " ")}
                          </span>
                        </div>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sharing</CardTitle>
                  <CardDescription>
                    Share this exam with participants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded border text-sm font-mono break-all">
                      {examUrl}
                    </div>
                    <Button onClick={copyExamUrl} className="w-full">
                      <Share className="w-4 h-4 mr-2" />
                      Copy Exam URL
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href={`/dashboard/exams/${exam.id}/edit`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Exam
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href={`/exam/${exam.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      Take Exam
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
