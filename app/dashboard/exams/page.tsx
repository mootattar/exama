"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { useExamStore } from "@/lib/exam-store";
import {
  PlusCircle,
  Search,
  FileText,
  Clock,
  Users,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ExamsPage() {
  const { exams, deleteExam } = useExamStore();
  const [searchQuery, setSearchQuery] = useState("");

  console.log(exams);
  const filteredExams = exams?.filter(
    (exam) =>
      exam?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam?.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteExam = (examId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this exam? This action cannot be undone."
      )
    ) {
      deleteExam(examId);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">My Exams</h1>
              <p className="text-muted-foreground">
                Manage your created exams and track their performance
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/new-exam">
                <PlusCircle className="w-4 h-4 mr-2" />
                New Exam
              </Link>
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {filteredExams.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              {searchQuery ? (
                <>
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No exams found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms
                  </p>
                  <Button onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </>
              ) : (
                <>
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No exams created yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start building your first exam to get started
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/new-exam">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Create Your First Exam
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredExams.map((exam) => (
              <Card key={exam.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <CardTitle className="truncate">{exam.title}</CardTitle>
                        <Badge
                          variant={exam.isPublished ? "default" : "secondary"}
                        >
                          {exam.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {exam.description || "No description provided"}
                      </CardDescription>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/exams/${exam.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/edit/${exam.id}`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Exam
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteExam(exam.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Exam
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>{exam.questions.length} questions</span>
                    </div>

                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>
                        {exam.timeLimit ? `${exam.timeLimit} min` : "No limit"}
                      </span>
                    </div>

                    <div className="flex items-center text-muted-foreground">
                      <Users className="w-4 h-4 mr-2" />
                      <span>
                        {exam.questions.reduce((sum, q) => sum + q.points, 0)}{" "}
                        points
                      </span>
                    </div>

                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {new Date(exam.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      {exam.questions.map((question, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            question.type === "multiple-choice"
                              ? "bg-blue-500"
                              : question.type === "true-false"
                              ? "bg-green-500"
                              : "bg-purple-500"
                          }`}
                          title={question.type.replace("-", " ")}
                        />
                      ))}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/preview/${exam.id}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/dashboard/exams/${exam.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
