import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Student, AttendanceRecord, getCourseKey } from '../types';
import { supabase } from '../lib/supabase';

interface AttendanceContextType {
  students: Student[];
  loading: boolean;
  addStudent: (name: string, course: number, division: string, dni: string) => Promise<Student>;
  getStudent: (id: string) => Student | undefined;
  getStudentByDNI: (dni: string) => Student | undefined;
  markAttendance: (studentId: string, present: boolean) => Promise<void>;
  getStudentsByCourse: (course: number, division: string) => Student[];
  deleteStudent: (id: string) => Promise<void>;
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
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch students from Supabase on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        
        // Fetch students
        const { data: studentsData, error: studentsError } = await supabase
          .from('students')
          .select('*');
        
        if (studentsError) {
          throw studentsError;
        }
        
        // Fetch attendance records
        const { data: attendanceData, error: attendanceError } = await supabase
          .from('attendance_records')
          .select('*');
        
        if (attendanceError) {
          throw attendanceError;
        }
        
        // Map attendance records to students
        const studentsWithAttendance = studentsData.map(student => {
          const studentAttendance = attendanceData
            .filter(record => record.student_id === student.id)
            .map(record => ({
              date: record.date,
              present: record.present,
              time: record.time
            }));
          
          return {
            id: student.id,
            name: student.name,
            course: student.course,
            division: student.division,
            dni: student.dni,
            attendanceRecords: studentAttendance
          };
        });
        
        setStudents(studentsWithAttendance);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to local storage if Supabase fails
        const savedStudents = localStorage.getItem('students');
        if (savedStudents) {
          setStudents(JSON.parse(savedStudents));
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);

  // Save to local storage as backup
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem('students', JSON.stringify(students));
    }
  }, [students]);

  const addStudent = async (name: string, course: number, division: string, dni: string): Promise<Student> => {
    try {
      const newStudentId = uuidv4();
      
      // Insert into Supabase
      const { error } = await supabase
        .from('students')
        .insert({
          id: newStudentId,
          name,
          course,
          division,
          dni,
          created_at: new Date().toISOString()
        });
      
      if (error) {
        throw error;
      }
      
      const newStudent: Student = {
        id: newStudentId,
        name,
        course,
        division,
        dni,
        attendanceRecords: []
      };
      
      setStudents(prev => [...prev, newStudent]);
      return newStudent;
    } catch (error) {
      console.error('Error adding student:', error);
      
      // Fallback to local state if Supabase fails
      const newStudent: Student = {
        id: uuidv4(),
        name,
        course,
        division,
        dni,
        attendanceRecords: []
      };
      
      setStudents(prev => [...prev, newStudent]);
      return newStudent;
    }
  };

  const getStudent = (id: string): Student | undefined => {
    return students.find(student => student.id === id);
  };

  const getStudentByDNI = (dni: string): Student | undefined => {
    return students.find(student => student.dni === dni);
  };

  const markAttendance = async (studentId: string, present: boolean) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const time = new Date().toLocaleTimeString();
      
      // Check if there's already an attendance record for today
      const { data: existingRecords, error: fetchError } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('student_id', studentId)
        .eq('date', today);
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (existingRecords && existingRecords.length > 0) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('attendance_records')
          .update({
            present,
            time
          })
          .eq('id', existingRecords[0].id);
        
        if (updateError) {
          throw updateError;
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('attendance_records')
          .insert({
            id: uuidv4(),
            student_id: studentId,
            date: today,
            present,
            time,
            created_at: new Date().toISOString()
          });
        
        if (insertError) {
          throw insertError;
        }
      }
      
      // Update local state
      setStudents(prev => 
        prev.map(student => {
          if (student.id === studentId) {
            const existingRecordIndex = student.attendanceRecords.findIndex(
              record => record.date === today
            );
            
            let updatedRecords: AttendanceRecord[];
            
            if (existingRecordIndex >= 0) {
              updatedRecords = [...student.attendanceRecords];
              updatedRecords[existingRecordIndex] = {
                date: today,
                present,
                time
              };
            } else {
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
    } catch (error) {
      console.error('Error marking attendance:', error);
      
      // Fallback to local state if Supabase fails
      const today = new Date().toISOString().split('T')[0];
      const time = new Date().toLocaleTimeString();
      
      setStudents(prev => 
        prev.map(student => {
          if (student.id === studentId) {
            const existingRecordIndex = student.attendanceRecords.findIndex(
              record => record.date === today
            );
            
            let updatedRecords: AttendanceRecord[];
            
            if (existingRecordIndex >= 0) {
              updatedRecords = [...student.attendanceRecords];
              updatedRecords[existingRecordIndex] = {
                date: today,
                present,
                time
              };
            } else {
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
    }
  };

  const getStudentsByCourse = (course: number, division: string): Student[] => {
    return students.filter(
      student => student.course === course && student.division === division
    );
  };

  const deleteStudent = async (id: string) => {
    try {
      // Delete from Supabase
      const { error: attendanceError } = await supabase
        .from('attendance_records')
        .delete()
        .eq('student_id', id);
      
      if (attendanceError) {
        throw attendanceError;
      }
      
      const { error: studentError } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (studentError) {
        throw studentError;
      }
      
      // Update local state
      setStudents(prev => prev.filter(student => student.id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
      
      // Fallback to local state if Supabase fails
      setStudents(prev => prev.filter(student => student.id !== id));
    }
  };

  return (
    <AttendanceContext.Provider
      value={{
        students,
        loading,
        addStudent,
        getStudent,
        getStudentByDNI,
        markAttendance,
        getStudentsByCourse,
        deleteStudent
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};