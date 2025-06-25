"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useExamStore } from "@/lib/exam-store";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Award,
  FileText,
  Users,
} from "lucide-react";

export default function ResultsPage() {
  const { results, exams } = useExamStore();

  const totalSubmissions = results.length;
  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce(
            (acc, result) => acc + (result.score / result.totalPoints) * 100,
            0
          ) / results.length
        )
      : 0;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBadgeVariant = (percentage: number) => {
    if (percentage >= 80) return "default";
    if (percentage >= 60) return "secondary";
    return "destructive";
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Exam Results</h1>
          <p className="text-muted-foreground">
            Track performance and analyze exam submissions
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Submissions
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubmissions}</div>
              <p className="text-xs text-muted-foreground">Across all exams</p>
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
              <div
                className={`text-2xl font-bold ${getScoreColor(averageScore)}`}
              >
                {averageScore}%
              </div>
              <p className="text-xs text-muted-foreground">
                Overall performance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {results.length > 0
                  ? Math.max(
                      ...results.map((r) =>
                        Math.round((r.score / r.totalPoints) * 100)
                      )
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Best performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Exams
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {exams.filter((e) => e.isPublished).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently published
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Results List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Recent Submissions
            </CardTitle>
            <CardDescription>
              Latest exam results and performance data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No results yet</h3>
                <p className="text-muted-foreground">
                  Results will appear here once participants complete your exams
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result) => {
                  const percentage = Math.round(
                    (result.score / result.totalPoints) * 100
                  );
                  return (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium truncate">
                            {result.examTitle}
                          </h3>
                          <Badge variant={getScoreBadgeVariant(percentage)}>
                            {percentage}%
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(result.completedAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Award className="w-4 h-4 mr-1" />
                            {result.score} / {result.totalPoints} points
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-2xl font-bold ${getScoreColor(
                            percentage
                          )}`}
                        >
                          {percentage}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {result.score}/{result.totalPoints}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Insights */}
        {results.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">90-100%</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (results.filter(
                                (r) => (r.score / r.totalPoints) * 100 >= 90
                              ).length /
                                results.length) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">
                        {
                          results.filter(
                            (r) => (r.score / r.totalPoints) * 100 >= 90
                          ).length
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">80-89%</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (results.filter((r) => {
                                const pct = (r.score / r.totalPoints) * 100;
                                return pct >= 80 && pct < 90;
                              }).length /
                                results.length) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">
                        {
                          results.filter((r) => {
                            const pct = (r.score / r.totalPoints) * 100;
                            return pct >= 80 && pct < 90;
                          }).length
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">60-79%</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (results.filter((r) => {
                                const pct = (r.score / r.totalPoints) * 100;
                                return pct >= 60 && pct < 80;
                              }).length /
                                results.length) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">
                        {
                          results.filter((r) => {
                            const pct = (r.score / r.totalPoints) * 100;
                            return pct >= 60 && pct < 80;
                          }).length
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Below 60%</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (results.filter(
                                (r) => (r.score / r.totalPoints) * 100 < 60
                              ).length /
                                results.length) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">
                        {
                          results.filter(
                            (r) => (r.score / r.totalPoints) * 100 < 60
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Highest Score
                    </span>
                    <span className="font-medium text-green-500">
                      {Math.max(
                        ...results.map((r) =>
                          Math.round((r.score / r.totalPoints) * 100)
                        )
                      )}
                      %
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Lowest Score
                    </span>
                    <span className="font-medium text-red-500">
                      {Math.min(
                        ...results.map((r) =>
                          Math.round((r.score / r.totalPoints) * 100)
                        )
                      )}
                      %
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Pass Rate (≥60%)
                    </span>
                    <span className="font-medium">
                      {Math.round(
                        (results.filter(
                          (r) => (r.score / r.totalPoints) * 100 >= 60
                        ).length /
                          results.length) *
                          100
                      )}
                      %
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Points Awarded
                    </span>
                    <span className="font-medium">
                      {results.reduce((sum, r) => sum + r.score, 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
