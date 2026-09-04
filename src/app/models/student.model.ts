export interface Student {
  id: number;
  registrationNumber: string;
  name: string;
  gpa: number;
  isActive: boolean;
  enrollmentCount: number;
}

export interface CreateStudentRequest {
  registrationNumber: string;
  name: string;
  gpa: number;
  isActived: boolean;
}
