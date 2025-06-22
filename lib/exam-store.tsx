"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Question {
  id: string;
  type: "multiple-choice" | "true-false" | "open-ended";
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: Date;
  timeLimit?: number;
  isPublished: boolean;
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  score: number;
  totalPoints: number;
  completedAt: Date;
  answers: Record<string, any>;
}

interface ExamStoreContextType {
  exams: Exam[];
  results: ExamResult[];
  createExam: (exam: Omit<Exam, "id" | "createdAt">) => string;
  updateExam: (id: string, exam: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  getExam: (id: string) => Exam | undefined;
  submitExamResult: (result: Omit<ExamResult, "id">) => void;
}

const ExamStoreContext = createContext<ExamStoreContextType | undefined>(
  undefined
);

export function ExamStoreProvider({ children }: { children: React.ReactNode }) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);

  useEffect(() => {
    // Load mock data
    const mockExam: Exam = JSON.parse(
      localStorage.getItem("exams") || "[]"
    ) || {
      id: "1",
      title: "Sample Quiz",
      description: "A sample quiz to demonstrate the platform",
      questions: [
        {
          id: "1",
          type: "multiple-choice",
          question: "What is the capital of France?",
          options: ["London", "Berlin", "Paris", "Madrid"],
          correctAnswer: 2,
          points: 10,
        },
        {
          id: "2",
          type: "true-false",
          question: "The Earth is flat.",
          correctAnswer: "false",
          points: 5,
        },
        {
          id: "3",
          type: "open-ended",
          question: "Explain the concept of photosynthesis.",
          points: 15,
        },
      ],
      createdAt: new Date(),
      timeLimit: 60,
      isPublished: true,
    };
    const mockResult: ExamResult = JSON.parse(
      localStorage.getItem("results") || "[]"
    ) || {
      id: "1",
      examId: "1",
      examTitle: "Sample Quiz",
      score: 25,
      totalPoints: 30,
      completedAt: new Date(Date.now() - 86400000),
      answers: {},
    };

    setExams(mockExam);
    setResults(mockResult);
  }, []);

  const createExam = (examData: Omit<Exam, "id" | "createdAt">): string => {
    const newExam: Exam = {
      ...examData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setExams((prev) => [...prev, newExam]);
    const allExams = [...exams, newExam];
    localStorage.setItem("exams", JSON.stringify(allExams));
    return newExam.id;
  };

  const updateExam = (id: string, examData: Partial<Exam>) => {
    setExams((prev) =>
      prev.map((exam) => (exam.id === id ? { ...exam, ...examData } : exam))
    );
  };

  const deleteExam = (id: string) => {
    setExams((prev) => prev.filter((exam) => exam.id !== id));
  };

  const getExam = (id: string) => {
    console.log(exams);
    return exams.find((exam) => exam.id === id);
  };

  const submitExamResult = (resultData: Omit<ExamResult, "id">) => {
    const newResult: ExamResult = {
      ...resultData,
      id: Date.now().toString(),
    };
    setResults((prev) => [...prev, newResult]);
    const allResults = [...results, newResult];
    localStorage.setItem("results", JSON.stringify(allResults));
  };

  return (
    <ExamStoreContext.Provider
      value={{
        exams,
        results,
        createExam,
        updateExam,
        deleteExam,
        getExam,
        submitExamResult,
      }}
    >
      {children}
    </ExamStoreContext.Provider>
  );
}

export function useExamStore() {
  const context = useContext(ExamStoreContext);
  if (context === undefined) {
    throw new Error("useExamStore must be used within an ExamStoreProvider");
  }
  return context;
}
