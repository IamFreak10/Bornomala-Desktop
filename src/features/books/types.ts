export interface Book {
  bookId: number;
  courseCode: string;
  bookName: string;
  authorName: string;
  coverImage: string;
  price: string;
  quantity: number;
  sales: number;
  has_discount: boolean;
  disCountPrice: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  courseCode: string;
  courseName: string;
  books: Book[];
}

export interface Semester {
  semesterId: number;
  semesterNumber: number;
  courses: Course[];
}

export interface Department {
  departmentId: number;
  departmentName: string;
  semesters: Semester[];
}

export interface CreateBookPayload {
  dept: string;
  sem: number;
  courseCode: string;
  bookName: string;
  authorName: string;
  price: number;
  quantity: number;
  coverFile?: File;
}

export interface CreateCoursePayload {
  semesterId: number;
  courseCode: string;
  courseName: string;
}
