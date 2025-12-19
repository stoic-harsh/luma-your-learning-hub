export type UserRole = 'employee' | 'manager' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  avatar?: string;
  managerId?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  provider: 'Internal' | 'Udemy' | 'Coursera' | 'LinkedIn Learning' | 'Other';
  isExternal: boolean;
  reimbursementEligible: boolean;
  price?: number;
  rating: number;
  enrolledCount: number;
}

export interface Certification {
  id: string;
  name: string;
  provider: string;
  dateEarned?: string;
  expiryDate?: string;
  deadline?: string;
  status: 'Active' | 'Expired' | 'Pending' | 'In Progress';
  badgeUrl?: string;
}

export interface LearningProgress {
  courseId: string;
  course: Course;
  progress: number;
  startedAt: string;
  completedAt?: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

export interface CourseRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  courseId: string;
  course: Course;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'Reimbursed';
  requestedAt: string;
  approvedAt?: string;
  completedAt?: string;
  reimbursementAmount?: number;
  proofUrl?: string;
  managerNotes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  department: string;
  avatar?: string;
  completedCourses: number;
  activeCertifications: number;
  pendingRequests: number;
}

export interface AIRecommendation {
  courseId: string;
  course: Course;
  reason: string;
  matchScore: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
