import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAttendance } from '../context/AttendanceContext';
import { CheckCircle, XCircle, User, ArrowLeft } from 'lucide-react';

const ScanResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getStudent, markAttendance } = useAttendance();
  
  const [student, setStudent] = useState<any>(null);
  const [attendanceMarked, setAttendanceMarked] = useState<boolean | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundStudent = getStudent(id);
      setStudent(foundStudent || null);
    }
  }, [id, getStudent]);
  
  const handleMarkAttendance = (present: boolean) => {
    if (student) {
      markAttendance(student.id, present);
      setAttendanceMarked(present);
      
      // Reset and navigate back after 3 seconds
      setTimeout(() => {
        navigate('/scan');
      }, 3000);
    }
  };
  
  if (!student) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 text-center">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-xl text-red-600 mb-4">Estudiante no encontrado</p>
          <p className="text-gray-600 mb-6">
            El código QR escaneado no corresponde a ningún estudiante registrado.
          </p>
          <button
            onClick={() => navigate('/scan')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center justify-center mx-auto"
          >
            <ArrowLeft size={18} className="mr-2" />
            Volver al Escaneo
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      {!attendanceMarked ? (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <User size={24} className="text-indigo-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">{student.name}</h2>
              <p className="text-sm text-gray-600">
                {student.course}° "{student.division}"
              </p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">¿Deseas marcar la asistencia de este estudiante?</p>
          
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => handleMarkAttendance(true)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
            >
              <CheckCircle size={18} className="mr-2" />
              Presente
            </button>
            
            <button
              onClick={() => handleMarkAttendance(false)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
            >
              <XCircle size={18} className="mr-2" />
              Ausente
            </button>
          </div>
          
          <button
            onClick={() => navigate('/scan')}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center"
          >
            <ArrowLeft size={18} className="mr-2" />
            Volver al Escaneo
          </button>
        </div>
      ) : (
        <div className={`rounded-lg shadow-md p-6 text-center ${
          attendanceMarked ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
        }`}>
          <div className="inline-flex items-center justify-center p-3 rounded-full mb-2 bg-white">
            {attendanceMarked ? (
              <CheckCircle size={30} className="text-green-600" />
            ) : (
              <XCircle size={30} className="text-red-600" />
            )}
          </div>
          <h2 className="text-lg font-semibold mb-1">
            {attendanceMarked ? 'Asistencia Registrada' : 'Ausencia Registrada'}
          </h2>
          <p className={`${attendanceMarked ? 'text-green-800' : 'text-red-800'} mb-4`}>
            {student.name} ha sido marcado como {attendanceMarked ? 'presente' : 'ausente'}
          </p>
          <p className="text-sm text-gray-600">
            Redirigiendo al escáner...
          </p>
        </div>
      )}
    </div>
  );
};

export default ScanResultPage;