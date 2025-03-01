export interface Student {
  id: string;
  name: string;
  course: number;
  division: string;
  attendanceRecords: AttendanceRecord[];
}

export interface AttendanceRecord {
  date: string;
  present: boolean;
  time?: string;
}

export interface Course {
  year: number;
  division: string;
}

export const divisions = ["I", "II", "III"];
export const years = [1, 2, 3, 4, 5, 6];

export const getCourseKey = (year: number, division: string): string => {
  return `${year}-${division}`;
};