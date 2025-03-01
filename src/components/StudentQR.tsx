import React from 'react';
import QRCode from 'react-qr-code';
import { Student } from '../types';

interface StudentQRProps {
  student: Student;
  baseUrl: string;
}

const StudentQR: React.FC<StudentQRProps> = ({ student, baseUrl }) => {
  const qrValue = `${baseUrl}/scan/${student.id}`;

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">{student.name}</h3>
      <p className="text-gray-600 mb-4">
        Curso: {student.course}° "{student.division}"
      </p>
      <div className="bg-white p-3 rounded-lg">
        <QRCode value={qrValue} size={180} />
      </div>
      <p className="mt-3 text-sm text-gray-500">ID: {student.id.substring(0, 8)}</p>
    </div>
  );
};

export default StudentQR;