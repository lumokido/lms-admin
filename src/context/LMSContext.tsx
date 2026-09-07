'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Course,
  Student,
  Instructor,
  EnrollmentRecord,
  AssignmentSubmission,
  ActivityLog,
  PlatformSettings,
  CourseStatus,
  StudentStatus,
  BlogArticle,
  VideoLesson,
  BookResource,
  ContentStatus,
} from '@/types/lms';
import {
  INITIAL_COURSES,
  INITIAL_STUDENTS,
  INITIAL_INSTRUCTORS,
  INITIAL_ENROLLMENTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_ACTIVITIES,
  INITIAL_SETTINGS,
  INITIAL_BLOGS,
  INITIAL_VIDEOS,
  INITIAL_BOOKS,
} from '@/lib/mock-data';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface LMSContextType {
  courses: Course[];
  students: Student[];
  instructors: Instructor[];
  enrollments: EnrollmentRecord[];
  assignments: AssignmentSubmission[];
  activities: ActivityLog[];
  settings: PlatformSettings;
  blogs: BlogArticle[];
  videos: VideoLesson[];
  books: BookResource[];
  toasts: ToastMessage[];
  globalSearch: string;
  setGlobalSearch: (term: string) => void;
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Course actions
  addCourse: (courseData: Omit<Course, 'id' | 'createdAt' | 'enrolledStudents' | 'rating'>) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  toggleCourseStatus: (id: string) => void;

  // Student actions
  addStudent: (studentData: Omit<Student, 'id' | 'joinDate' | 'lastActive' | 'enrolledCourses' | 'completedCoursesCount' | 'averageProgress'>) => void;
  updateStudentStatus: (id: string, status: StudentStatus) => void;
  deleteStudent: (id: string) => void;

  // Instructor actions
  addInstructor: (instructorData: Omit<Instructor, 'id' | 'coursesCount' | 'totalStudents' | 'rating' | 'joinedDate'>) => void;
  
  // Assignment actions
  gradeAssignment: (id: string, score: number, feedback: string) => void;

  // Blog actions
  addBlog: (blogData: Omit<BlogArticle, 'id' | 'publishedAt' | 'views'>) => void;
  deleteBlog: (id: string) => void;
  toggleBlogStatus: (id: string) => void;

  // Video actions
  addVideo: (videoData: Omit<VideoLesson, 'id' | 'createdAt' | 'views'>) => void;
  deleteVideo: (id: string) => void;
  toggleVideoStatus: (id: string) => void;

  // Book actions
  addBook: (bookData: Omit<BookResource, 'id' | 'createdAt' | 'downloads'>) => void;
  deleteBook: (id: string) => void;
  toggleBookStatus: (id: string) => void;

  // Settings action
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;
}

const LMSContext = createContext<LMSContextType | undefined>(undefined);

const STORAGE_KEY = 'lumokido_lms_store_v2';

export function LMSProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [instructors, setInstructors] = useState<Instructor[]>(INITIAL_INSTRUCTORS);
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>(INITIAL_ENROLLMENTS);
  const [assignments, setAssignments] = useState<AssignmentSubmission[]>(INITIAL_ASSIGNMENTS);
  const [activities, setActivities] = useState<ActivityLog[]>(INITIAL_ACTIVITIES);
  const [settings, setSettings] = useState<PlatformSettings>(INITIAL_SETTINGS);
  const [blogs, setBlogs] = useState<BlogArticle[]>(INITIAL_BLOGS);
  const [videos, setVideos] = useState<VideoLesson[]>(INITIAL_VIDEOS);
  const [books, setBooks] = useState<BookResource[]>(INITIAL_BOOKS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [globalSearch, setGlobalSearch] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.courses) setCourses(parsed.courses);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.instructors) setInstructors(parsed.instructors);
        if (parsed.enrollments) setEnrollments(parsed.enrollments);
        if (parsed.assignments) setAssignments(parsed.assignments);
        if (parsed.activities) setActivities(parsed.activities);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.blogs) setBlogs(parsed.blogs);
        if (parsed.videos) setVideos(parsed.videos);
        if (parsed.books) setBooks(parsed.books);
      }
    } catch (e) {
      console.warn('Could not read from local storage, using initial mock data', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          courses,
          students,
          instructors,
          enrollments,
          assignments,
          activities,
          settings,
          blogs,
          videos,
          books,
        })
      );
    } catch (e) {
      console.warn('Could not sync to local storage', e);
    }
  }, [courses, students, instructors, enrollments, assignments, activities, settings, blogs, videos, books, isLoaded]);

  const showToast = ({ type, title, message }: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addActivity = (title: string, description: string, type: ActivityLog['type'], iconType: string) => {
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      title,
      description,
      type,
      timestamp: 'Just now',
      iconType,
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // Course Actions
  const addCourse = (courseData: Omit<Course, 'id' | 'createdAt' | 'enrolledStudents' | 'rating'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `crs-${Date.now()}`,
      enrolledStudents: 0,
      rating: 5.0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCourses((prev) => [newCourse, ...prev]);
    addActivity('Course Created', `Course "${newCourse.title}" was added`, 'course_created', 'BookOpen');
    showToast({
      type: 'success',
      title: 'Course Created',
      message: `"${newCourse.title}" has been successfully added.`,
    });
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast({
      type: 'info',
      title: 'Course Updated',
      message: 'Course changes have been saved.',
    });
  };

  const deleteCourse = (id: string) => {
    const courseToDelete = courses.find((c) => c.id === id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
    showToast({
      type: 'warning',
      title: 'Course Deleted',
      message: `"${courseToDelete?.title || 'Course'}" was removed.`,
    });
  };

  const toggleCourseStatus = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus: CourseStatus = c.status === 'published' ? 'draft' : 'published';
          showToast({
            type: nextStatus === 'published' ? 'success' : 'info',
            title: `Course ${nextStatus === 'published' ? 'Published' : 'Moved to Draft'}`,
            message: `"${c.title}" is now ${nextStatus}.`,
          });
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  // Student Actions
  const addStudent = (studentData: Omit<Student, 'id' | 'joinDate' | 'lastActive' | 'enrolledCourses' | 'completedCoursesCount' | 'averageProgress'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      enrolledCourses: [],
      completedCoursesCount: 0,
      averageProgress: 0,
    };
    setStudents((prev) => [newStudent, ...prev]);
    addActivity('Student Registered', `${newStudent.name} was added to the directory`, 'student_joined', 'UserPlus');
    showToast({
      type: 'success',
      title: 'Student Added',
      message: `${newStudent.name} has been enrolled into the portal.`,
    });
  };

  const updateStudentStatus = (id: string, status: StudentStatus) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    showToast({
      type: 'info',
      title: 'Status Updated',
      message: `Student status updated to ${status}.`,
    });
  };

  const deleteStudent = (id: string) => {
    const student = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    showToast({
      type: 'warning',
      title: 'Student Removed',
      message: `${student?.name || 'Student'} was removed from the roster.`,
    });
  };

  // Instructor Actions
  const addInstructor = (instructorData: Omit<Instructor, 'id' | 'coursesCount' | 'totalStudents' | 'rating' | 'joinedDate'>) => {
    const newInst: Instructor = {
      ...instructorData,
      id: `inst-${Date.now()}`,
      coursesCount: 0,
      totalStudents: 0,
      rating: 5.0,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setInstructors((prev) => [newInst, ...prev]);
    showToast({
      type: 'success',
      title: 'Instructor Added',
      message: `${newInst.name} has been added to the faculty list.`,
    });
  };

  // Assignment Actions
  const gradeAssignment = (id: string, score: number, feedback: string) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            status: 'graded',
            score,
            feedback,
          };
        }
        return a;
      })
    );
    const asg = assignments.find((a) => a.id === id);
    addActivity(
      'Assignment Graded',
      `Graded submission for ${asg?.studentName || 'Student'} (${score}/100)`,
      'graded',
      'Award'
    );
    showToast({
      type: 'success',
      title: 'Assignment Graded',
      message: `Score of ${score}/100 recorded for ${asg?.studentName || 'student'}.`,
    });
  };

  // Blog Actions
  const addBlog = (blogData: Omit<BlogArticle, 'id' | 'publishedAt' | 'views'>) => {
    const newBlog: BlogArticle = {
      ...blogData,
      id: `blog-${Date.now()}`,
      publishedAt: new Date().toISOString().split('T')[0],
      views: 0,
    };
    setBlogs((prev) => [newBlog, ...prev]);
    showToast({
      type: 'success',
      title: 'Blog Article Added',
      message: `"${newBlog.title}" has been created.`,
    });
  };

  const deleteBlog = (id: string) => {
    const item = blogs.find((b) => b.id === id);
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    showToast({
      type: 'warning',
      title: 'Article Removed',
      message: `"${item?.title || 'Article'}" was deleted.`,
    });
  };

  const toggleBlogStatus = (id: string) => {
    setBlogs((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const next = b.status === 'published' ? 'draft' : 'published';
          showToast({
            type: next === 'published' ? 'success' : 'info',
            title: `Article ${next === 'published' ? 'Published' : 'Moved to Draft'}`,
            message: `"${b.title}" status is now ${next}.`,
          });
          return { ...b, status: next };
        }
        return b;
      })
    );
  };

  // Video Actions
  const addVideo = (videoData: Omit<VideoLesson, 'id' | 'createdAt' | 'views'>) => {
    const newVid: VideoLesson = {
      ...videoData,
      id: `vid-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
    };
    setVideos((prev) => [newVid, ...prev]);
    showToast({
      type: 'success',
      title: 'Video Added',
      message: `"${newVid.title}" uploaded to library.`,
    });
  };

  const deleteVideo = (id: string) => {
    const vid = videos.find((v) => v.id === id);
    setVideos((prev) => prev.filter((v) => v.id !== id));
    showToast({
      type: 'warning',
      title: 'Video Removed',
      message: `"${vid?.title || 'Video'}" was deleted.`,
    });
  };

  const toggleVideoStatus = (id: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const next = v.status === 'published' ? 'draft' : 'published';
          return { ...v, status: next };
        }
        return v;
      })
    );
  };

  // Book Actions
  const addBook = (bookData: Omit<BookResource, 'id' | 'createdAt' | 'downloads'>) => {
    const newBook: BookResource = {
      ...bookData,
      id: `bk-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      downloads: 0,
    };
    setBooks((prev) => [newBook, ...prev]);
    showToast({
      type: 'success',
      title: 'Book Added',
      message: `"${newBook.title}" added to digital library.`,
    });
  };

  const deleteBook = (id: string) => {
    const bk = books.find((b) => b.id === id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
    showToast({
      type: 'warning',
      title: 'Book Removed',
      message: `"${bk?.title || 'Book'}" was deleted.`,
    });
  };

  const toggleBookStatus = (id: string) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const next = b.status === 'published' ? 'draft' : 'published';
          return { ...b, status: next };
        }
        return b;
      })
    );
  };

  // Settings Action
  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Platform preferences have been updated.',
    });
  };

  return (
    <LMSContext.Provider
      value={{
        courses,
        students,
        instructors,
        enrollments,
        assignments,
        activities,
        settings,
        blogs,
        videos,
        books,
        toasts,
        globalSearch,
        setGlobalSearch,
        showToast,
        removeToast,
        addCourse,
        updateCourse,
        deleteCourse,
        toggleCourseStatus,
        addStudent,
        updateStudentStatus,
        deleteStudent,
        addInstructor,
        gradeAssignment,
        addBlog,
        deleteBlog,
        toggleBlogStatus,
        addVideo,
        deleteVideo,
        toggleVideoStatus,
        addBook,
        deleteBook,
        toggleBookStatus,
        updateSettings,
      }}
    >
      {children}
    </LMSContext.Provider>
  );
}

export function useLMS() {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
}
