export interface ExamCreatePayload {
  courseId: number;
  noOfQuestions: number;
  examDate: string;
  endDate: string;
}

export interface ExamAnswerDTO {
  questionID: number;
  studentAnswer: string;
}

export interface SubmissionPayload {
  examID: number;
  answers: ExamAnswerDTO[];
}

export interface Exam {
  id: number;
  courseId: number;
  noOfQuestions: number;
  examDate: string;
  endDate: string;
  course?: Course;
}

export interface Course {
  id: number;
  courseName: string;
  trackId: number;
  track?: Track;
}

export interface Track {
  id: number;
  trackName: string;
  branchId: number;
  branch?: Branch;
}

export interface Branch {
  id: number;
  branchName: string;
}

export interface QuestionBank {
  questionId: number;
  questionText: string;
  questionType: string;
  modelAnswer?: string;
  points: number;
  choices?: Choice[];
}

export interface Choice {
  questionId: number;
  choiceLetter: string;
  choiceText: string;
}

export interface ExamDisplay {
  id: number;
  courseId: number;
  noOfQuestions: number;
  examDate: string;
  endDate: string;
  course?: Course;
  questions?: QuestionBank[];
}

// API response for exam display endpoint
export interface ExamDisplayResponse {
  success: boolean;
  message: string;
  data: QuestionBank[];
  errors?: string[] | null;
}

export interface Submission {
  id: number;
  examID: number;
  studentId: string;
  submissionDate: string;
  score?: number;
  exam?: Exam;
}

export interface SubmissionDetail {
  id: number;
  examID: number;
  studentId: string;
  submissionDate: string;
  score?: number;
  exam?: Exam;
  answers?: ExamAnswerDTO[];
}

export interface StudentResult {
  studentId: number;
  examId: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  submissionDate: string;
} 