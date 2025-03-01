import React, { useState } from 'react';
import { Student } from '../types';
import { CheckCircle, XCircle } from 'lucide-react';

interface AttendanceHistoryProps {
  student: Student;
}

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ student }) => {
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const filteredRecords = student.attendanceRecords.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
  });

  // Sort records by date (newest first)
  const sortedRecords = [...filteredRecords].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Historial de Asistencias</h3>
      
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={handlePreviousMonth}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          &lt;
        </button>
        <span className="font-medium">
          {months[currentMonth]} {currentYear}
        </span>
        <button 
          onClick={handleNextMonth}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          &gt;
        </button>
      </div>
      
      {sortedRecords.length === 0 ? (
        <p className="text-center text-gray-500 py-4">
          No hay registros de asistencia para este mes
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedRecords.map((record, index) => {
                const date = new Date(record.date);
                const formattedDate = date.toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                });
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm">{formattedDate}</td>
                    <td className="py-2 px-4">
                      {record.present ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle size={16} className="mr-1" />
                          Presente
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <XCircle size={16} className="mr-1" />
                          Ausente
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-500">
                      {record.time || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;