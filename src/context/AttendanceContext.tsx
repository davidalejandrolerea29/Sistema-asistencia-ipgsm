import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Student, AttendanceRecord, getCourseKey } from '../types';

interface AttendanceContextType {
  students: Student[];
  addStudent: (name: string, course: number, division: string) => Student;
  getStudent: (id: string) => Student | undefined;
  markAttendance: (studentId: string, present: boolean) => void;
  getStudentsByCourse: (course: number, division: string) => Student[];
  deleteStudent: (id: string) => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : [];
  });

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const addStudent = (name: string, course: number, division: string): Student => {
    const newStudent: Student = {
      id: uuidv4(),
      name,
      course,
      division,
      attendanceRecords: []
    };
    
    setStudents(prev => [...prev, newStudent]);
    return newStudent;
  };

  const getStudent = (id: string): Student | undefined => {
    return students.find(student => student.id === id);
  };

  const markAttendance = (studentId: string, present: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString();
    
    setStudents(prev => 
      prev.map(student => {
        if (student.id === studentId) {
          // Check if there's already an attendance record for today
          const existingRecordIndex = student.attendanceRecords.findIndex(
            record => record.date === today
          );
          
          let updatedRecords: AttendanceRecord[];
          
          if (existingRecordIndex >= 0) {
            // Update existing record
            updatedRecords = [...student.attendanceRecords];
            updatedRecords[existingRecordIndex] = {
              date: today,
              present,
              time
            };
          } else {
            // Add new record
            updatedRecords = [
              ...student.attendanceRecords,
              { date: today, present, time }
            ];
          }
          
          return {
            ...student,
            attendanceRecords: updatedRecords
          };
        }
        return student;
      })
    );
  };

  const getStudentsByCourse = (course: number, division: string): Student[] => {
    return students.filter(
      student => student.course === course && student.division === division
    );
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  return (
    <AttendanceContext.Provider
      value={{
        students,
        addStudent,
        getStudent,
        markAttendance,
        getStudentsByCourse,
        deleteStudent
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};