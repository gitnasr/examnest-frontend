// Core DTOs from API specification
export interface AuthenticationDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
  accessToken: string;
}

export interface BranchDTO {
  branchName: string;
}

export interface TrackDTO {
  branchId: number;
  trackName: string;
}

export interface CourseDTO {
  trackId: number;
  courseName: string;
}

export interface QuestionBankDTO {
  courseId: number;
  questionText: string;
  questionType: string;
  modelAnswer?: string;
  points: number;
}

export interface ChoiceDTO {
  questionId: number;
  choiceLetter: string;
  choiceText: string;
}

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

export interface UpdateDto {
  branchId: number;
  trackId: number;
  userId: string;
}

export interface StudentUpdatePayload {
  branchId: number;
  trackId: number;
  userId: string;
}

export interface UpgradeDTO {
  userId: string;
  type: Roles;
  trackId: number;
  branchId: number;
}

export interface QuestionBankCreatePayload {
  courseId: number;
  questionText: string;
  questionType: string;
  modelAnswer?: string;
  points: number;
}

export interface ChoiceCreatePayload {
  questionId: number;
  choiceLetter: string;
  choiceText: string;
}

// Enums
export enum Roles {
  Student = 0,
  Instructor = 1,
  Admin = 2,
  SuperAdmin = 3
}

export enum UserRole {
  Student = 0,
  Instructor = 1,
  Admin = 2,
  SuperAdmin = 3
}

// Auth-specific interfaces
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: Roles;
  branchId?: number;
  trackId?: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserInfo;
}

export interface TokenPayload {
  jti: string;
  unique_name: string;
  nameid: string;
  email: string;
  name?: string;
  role: string;
  nbf: number;
  exp: number;
  iat: number;
  iss: string;
  aud: string;
  sub?: string; // Optional for backward compatibility
}

// Extended models with additional properties
export interface Branch {
  id: number;
  branchName: string;
}

export interface Track {
  id: number;
  trackName: string;
  branchId: number;
  branch?: Branch;
}

export interface Course {
  courseID: number;
  trackID: number;
  courseName: string;
  trackName: string;
  branchID: number;
  branchName: string;
  track?: Track;
}

export interface QuestionBank {
  questionID: number;
  courseID: number;
  questionText: string;
  questionType: string;
  modelAnswer: string;
  points: number;
  courseName: string;
  trackID: number;
  trackName: string;
  choices?: Choice[];
  course?: Course;
}

export interface Choice {
  questionId: number;
  choiceLetter: string;
  choiceText: string;
}

// Updated Exam interface to match actual API response
export interface Exam {
  id: number; // Keep as 'id' for consistency with other interfaces
  courseId: number;
  courseName: string; // Added to match API response
  noOfQuestions: number;
  examDate: string;
  endDate: string;
  course?: Course; // Optional for extended data
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

export interface Instructor {
  id: number;
  userId: string;
  branchId: number;
  trackId: number;
  branch?: Branch;
  track?: Track;
}

export interface Student {
  id: number;
  userId: string;
  branchName: string;
  trackName: string;
  user?: UserInfo;
}

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[] | null;
}

export interface ArrayResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  errors: string[] | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// API response for exam display endpoint
export interface ExamDisplayResponse {
  success: boolean;
  message: string;
  data: QuestionBank[];
  errors?: string[] | null;
} 