export type CourseStatus = 'published' | 'draft' | 'archived';
export type StudentStatus = 'active' | 'inactive' | 'suspended';
export type InstructorStatus = 'active' | 'on_leave';
export type EnrollmentStatus = 'in_progress' | 'completed' | 'dropped';
export type AssignmentStatus = 'pending' | 'graded' | 'late';
export type ContentStatus = 'published' | 'draft' | 'archived';

export interface CourseModule {
  id: string;
  title: string;
  lessonsCount: number;
  duration: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  category: 'Development' | 'Design' | 'Data & AI' | 'Business' | 'Marketing';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  thumbnail: string;
  price: number;
  duration: string;
  status: CourseStatus;
  enrolledStudents: number;
  rating: number;
  modules: CourseModule[];
  createdAt: string;
}

export interface StudentCourseProgress {
  courseId: string;
  courseTitle: string;
  progress: number;
  status: EnrollmentStatus;
  grade?: string;
  enrolledDate: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  status: StudentStatus;
  joinDate: string;
  lastActive: string;
  enrolledCourses: StudentCourseProgress[];
  completedCoursesCount: number;
  averageProgress: number;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  avatar: string;
  specialty: string;
  coursesCount: number;
  totalStudents: number;
  rating: number;
  status: InstructorStatus;
  bio: string;
  joinedDate: string;
}

export interface EnrollmentRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  courseId: string;
  courseTitle: string;
  category: string;
  enrolledDate: string;
  progress: number;
  status: EnrollmentStatus;
  lastAccessed: string;
}

export interface AssignmentSubmission {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  submittedAt: string;
  dueDate: string;
  status: AssignmentStatus;
  score: number | null;
  maxScore: number;
  feedback: string | null;
  attachmentName?: string;
}

export interface ActivityLog {
  id: string;
  type: 'enrollment' | 'course_created' | 'assignment_submitted' | 'student_joined' | 'graded';
  title: string;
  description: string;
  timestamp: string;
  iconType: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  authorAvatar: string;
  category: string;
  readTime: string;
  publishedAt: string;
  status: ContentStatus;
  views: number;
  coverImage: string;
}

export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  category: string;
  views: number;
  status: ContentStatus;
  thumbnail: string;
  videoUrl: string;
  createdAt: string;
}

export interface BookResource {
  id: string;
  title: string;
  author: string;
  category: string;
  pages: number;
  format: 'PDF' | 'EPUB';
  fileSize: string;
  downloads: number;
  status: ContentStatus;
  coverImage: string;
  downloadUrl: string;
  createdAt: string;
}

export interface PlatformSettings {
  portalName: string;
  organizationName: string;
  supportEmail: string;
  primaryColor: string;
  passGradePercentage: number;
  allowSelfRegistration: boolean;
  enableCertificates: boolean;
  notifyOnSubmissions: boolean;
  notifyOnEnrollment: boolean;
  maintenanceMode: boolean;
}
