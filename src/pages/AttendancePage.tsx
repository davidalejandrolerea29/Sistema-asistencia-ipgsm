import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAttendance } from '../context/AttendanceContext';
import CourseSelector from '../components/CourseSelector';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import { divisions, years } from '../types';

const AttendancePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { getStudentsByCourse } = useAttendance();
  
  const initialYear = searchParams.get('year') 
    ? parseInt(searchParams.get('year') as string) 
    : 1;
  
  const initialDivision = searchParams.get('division') || "I";
  
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [selectedDivision, setSelectedDivision] = useState<string>(initialDivision);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  const students = getStudentsByCourse(selectedYear, selectedDivision);
  
  // Calculate attendance statistics
  const totalStudents = students.length;
  const presentStudents = students.filter(student => 
    student.attendanceRecords.some(
      record => record.date === selectedDate && record.present
    )
  ).length;
  const absentStudents = students.filter(student => 
    student.attendanceRecords.some(
      record => record.date === selectedDate && !record.present
    )
  ).length;
  const notRegisteredStudents = totalStudents - presentStudents - absentStudents;
  
  const presentPercentage = totalStudents > 0 
    ? Math.round((presentStudents / totalStudents) * 100) 
    : 0;
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Registro de Asistencias</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <CourseSelector
            selectedYear={selectedYear}
            selectedDivision={selectedDivision}
            onYearChange={setSelectedYear}
            onDivisionChange={setSelectedDivision}
          />
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Presentes</h2>
              <p className="text-3xl font-bold">{presentStudents}</p>
              <p className="text-sm text-gray-500">
                {presentPercentage}% del total
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full">
              <XCircle size={24} className="text-red-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Ausentes</h2>
              <p className="text-3xl font-bold">{absentStudents}</p>
              <p className="text-sm text-gray-500">
                {totalStudents > 0 ? Math.round((absentStudents / totalStudents) * 100) : 0}% del total
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-400">
          <div className="flex items-center">
            <div className="bg-gray-100 p-3 rounded-full">
              <Calendar size={24} className="text-gray-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Sin Registrar</h2>
              <p className="text-3xl font-bold">{notRegisteredStudents}</p>
              <p className="text-sm text-gray-500">
                {totalStudents > 0 ? Math.round((notRegisteredStudents / totalStudents) * 100) : 0}% del total
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">
          Asistencia del {new Date(selectedDate).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </h2>
        
        {students.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No hay estudiantes registrados en este curso
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Nombre</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Estado</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => {
                  const attendanceRecord = student.attendanceRecords.find(
                    record => record.date === selectedDate
                  );
                  
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{student.name}</td>
                      <td className="py-3 px-4">
                        {attendanceRecord ? (
                          attendanceRecord.present ? (
                            <span className="flex items-center text-green-600">
                              <CheckCircle size={16} className="mr-1" />
                              Presente
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600">
                              <XCircle size={16} className="mr-1" />
                              Ausente
                            </span>
                          )
                        ) : (
                          <span className="text-gray-400">Sin registrar</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {attendanceRecord?.time || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;