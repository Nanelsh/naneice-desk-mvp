export type Attendance = "Present" | "Absent" | "Late";
export type SessionStatus = "scheduled" | "active" | "completed";

export type Student = {
  id: string;
  name: string;
  subject: string;
  academicLevel: string;
  phone: string;
  parentPhone: string;
  totalSessions: number;
  remainingSessions: number;
  subscriptionEndDate: string;
  notes: string;
  createdAt: string;
};

export type Session = {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  durationMinutes: number;
  status: SessionStatus;
  attendance?: Attendance;
  homework?: string;
  notes?: string;
};

export type AppData = {
  pin: string;
  teacherName: string;
  students: Student[];
  sessions: Session[];
};

export const STORAGE_KEY = "naneice-desk-mvp-v1";
