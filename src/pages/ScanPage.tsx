import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAttendance } from "../context/AttendanceContext";
import { QrCode, CheckCircle, XCircle, User, Camera } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";

const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { getStudent, markAttendance } = useAttendance();

  const [studentId, setStudentId] = useState<string>("");
  const [scannedStudent, setScannedStudent] = useState<any>(null);
  const [attendanceMarked, setAttendanceMarked] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState<boolean>(false);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (showScanner) {
      scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 }, false);


      scanner.render(
        (decodedText) => {
          console.log("QR escaneado:", decodedText);
          setStudentId(decodedText);
          processStudent(decodedText);
          stopScanner();
        },
        (errorMessage) => {
          console.warn("Error escaneando:", errorMessage);
        }
      );
    }

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [showScanner]);

  const processStudent = (id: string) => {
    const student = getStudent(id);
    if (student) {
      setScannedStudent(student);
      setError(null);
    } else {
      setScannedStudent(null);
      setError("Estudiante no encontrado. Verifica el QR e intenta nuevamente.");
    }
  };

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) {
      setError("Por favor ingresa un ID de estudiante");
      return;
    }
    processStudent(studentId.trim());
  };

  const handleMarkAttendance = (present: boolean) => {
    if (scannedStudent) {
      markAttendance(scannedStudent.id, present);
      setAttendanceMarked(present);
      setTimeout(() => {
        setScannedStudent(null);
        setAttendanceMarked(null);
        setStudentId("");
      }, 3000);
    }
  };

  const stopScanner = () => {
    setShowScanner(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-100 rounded-full mb-4">
          <QrCode size={40} className="text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Escaneo de Asistencia</h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          Escanea el código QR del estudiante o ingresa su ID manualmente para registrar su asistencia.
        </p>
      </div>

      {showScanner ? (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
          <div id="qr-reader" className="w-full"></div>
          <button
            onClick={stopScanner}
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Cancelar Escaneo
          </button>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
          <button
            onClick={() => setShowScanner(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md transition-colors mb-4 flex items-center justify-center"
          >
            <Camera size={20} className="mr-2" />
            Escanear Código QR
          </button>

          <div className="relative my-4 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-600">o</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleScan}>
            <div className="mb-4">
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                ID del Estudiante
              </label>
              <input
                type="text"
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingresa el ID del estudiante"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Buscar Estudiante
            </button>

            {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
          </form>
        </div>
      )}

      {scannedStudent && !attendanceMarked && (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <User size={24} className="text-indigo-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">{scannedStudent.name}</h2>
              <p className="text-sm text-gray-600">
                {scannedStudent.course}° "{scannedStudent.division}"
              </p>
            </div>
          </div>

          <p className="text-gray-700 mb-4">¿Deseas marcar la asistencia de este estudiante?</p>

          <div className="flex space-x-2">
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
        </div>
      )}
    </div>
  );
};

export default ScanPage;
