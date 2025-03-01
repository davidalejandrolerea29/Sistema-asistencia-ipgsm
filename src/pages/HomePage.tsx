import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Users, ClipboardCheck } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Sistema de Control de Asistencias
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Gestiona la asistencia de estudiantes de manera eficiente utilizando códigos QR personalizados.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <div className="bg-blue-100 p-3 rounded-full mb-4">
            <QrCode size={32} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Escaneo de QR</h2>
          <p className="text-gray-600 mb-4">
            Registra asistencias rápidamente escaneando los códigos QR de los estudiantes.
          </p>
          <Link
            to="/scan"
            className="mt-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Escanear QR
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <Users size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Gestión de Estudiantes</h2>
          <p className="text-gray-600 mb-4">
            Administra la información de los estudiantes y genera códigos QR personalizados.
          </p>
          <Link
            to="/students"
            className="mt-auto bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Gestionar Estudiantes
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <div className="bg-purple-100 p-3 rounded-full mb-4">
            <ClipboardCheck size={32} className="text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Registro de Asistencias</h2>
          <p className="text-gray-600 mb-4">
            Visualiza y gestiona el historial de asistencias por curso y estudiante.
          </p>
          <Link
            to="/attendance"
            className="mt-auto bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Ver Asistencias
          </Link>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
        <h2 className="text-xl font-semibold mb-4 text-indigo-800">Cursos Disponibles</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(year => (
            <div key={year} className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-lg text-center mb-2">{year}° Año</h3>
              <div className="flex justify-center space-x-2">
                {["I", "II", "III"].map(division => (
                  <Link
                    key={`${year}-${division}`}
                    to={`/attendance?year=${year}&division=${division}`}
                    className="px-2 py-1 bg-indigo-100 hover:bg-indigo-200 rounded text-indigo-800 text-sm transition-colors"
                  >
                    {division}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;