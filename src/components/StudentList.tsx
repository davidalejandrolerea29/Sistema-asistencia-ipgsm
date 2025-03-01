import React from 'react';
import { Student } from '../types';
import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StudentListProps {
  students: Student[];
  onDelete: (id: string) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onDelete }) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Nombre</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Curso</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Asistencia Hoy</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {students.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                No hay estudiantes registrados en este curso
              </td>
            </tr>
          ) : (
            students.map((student) => {
              const todayRecord = student.attendanceRecords.find(
                (record) => record.date === today
              );
              
              return (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{student.name}</td>
                  <td className="py-3 px-4 text-sm">
                    {student.course}° "{student.division}"
                  </td>
                  <td className="py-3 px-4">
                    {todayRecord ? (
                      <div className="flex items-center">
                        {todayRecord.present ? (
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
                        <span className="ml-2 text-xs text-gray-500">
                          {todayRecord.time}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Sin registrar</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/student/${student.id}`}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => onDelete(student.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;