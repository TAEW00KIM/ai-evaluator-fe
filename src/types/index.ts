export interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface Submission {
  id: number;
  studentId: number;
  assignmentId: number;
  submissionTime: string; // 날짜/시간은 string으로 받음
  status: "PENDING" | "RUNNING" | "COMPLETED" | "ERROR";
  score: number | null;
  log: string | null;
}
