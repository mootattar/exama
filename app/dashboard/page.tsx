"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useExamStore } from "@/lib/exam-store";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import {
  FileText,
  PlusCircle,
  BarChart3,
  Clock,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";

export default function DashboardPage() {
  const { exams, results } = useExamStore();
  const { user } = useAuth();

  const totalExams = exams.length;
  const publishedExams = exams.filter((exam) => exam.isPublished).length;
  const totalResults = results.length;
  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce(
            (acc, result) => acc + (result.score / result.totalPoints) * 100,
            0
          ) / results.length
        )
      : 0;

  const recentExams = exams.slice(0, 3);
  const recentResults = results.slice(-3).reverse();

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground mt-2">
            Here's an overview of your exam platform activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalExams}</div>
              <p className="text-xs text-muted-foreground">
                {publishedExams} published
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Exams
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResults}</div>
              <p className="text-xs text-muted-foreground">Total submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}%</div>
              <p className="text-xs text-muted-foreground">Across all exams</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResults}</div>
              <p className="text-xs text-muted-foreground">New submissions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Exams */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Exams</CardTitle>
                  <CardDescription>Your latest created exams</CardDescription>
                </div>
                <Button asChild size="sm">
                  <Link href="/dashboard/new-exam">
                    <PlusCircle className="w-4 h-4 mr-1" />
                    New Exam
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentExams.length > 0 ? (
                <div className="space-y-4">
                  {recentExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium truncate">{exam.title}</h3>
                          <Badge
                            variant={exam.isPublished ? "default" : "secondary"}
                          >
                            {exam.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {exam.questions.length} questions •{" "}
                          {exam.timeLimit || "No"} time limit
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/exams/${exam.id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No exams created yet</p>
                  <Button asChild className="mt-4">
                    <Link href="/dashboard/new-exam">
                      Create Your First Exam
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Results */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Results</CardTitle>
                  <CardDescription>Latest exam submissions</CardDescription>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard/analytics">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentResults.length > 0 ? (
                <div className="space-y-4">
                  {recentResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">
                          {result.examTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(result.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {result.score}/{result.totalPoints}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round(
                            (result.score / result.totalPoints) * 100
                          )}
                          %
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No results yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-auto p-6 flex-col space-y-2">
              <Link href="/dashboard/new-exam">
                <PlusCircle className="w-8 h-8" />
                <span className="font-medium">Create New Exam</span>
                <span className="text-xs opacity-80">
                  Start building your exam
                </span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto p-6 flex-col space-y-2"
            >
              <Link href="/dashboard/exams">
                <FileText className="w-8 h-8" />
                <span className="font-medium">Manage Exams</span>
                <span className="text-xs opacity-80">Edit and organize</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto p-6 flex-col space-y-2"
            >
              <Link href="/dashboard/analytics">
                <BarChart3 className="w-8 h-8" />
                <span className="font-medium">View Analytics</span>
                <span className="text-xs opacity-80">Track performance</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
