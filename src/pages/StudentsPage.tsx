import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import CourseSelector from '../components/CourseSelector';
import StudentList from '../components/StudentList';
import { UserPlus, Loader } from 'lucide-react';
import { divisions, years } from '../types';

const StudentsPage: React.FC = () => {
  const { addStudent, getStudentsByCourse, deleteStudent, loading } = useAttendance();
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [selectedDivision, setSelectedDivision] = useState<string>("I");
  const [newStudentName, setNewStudentName] = useState<string>("");
  const [newStudentDNI, setNewStudentDNI] = useState<string>("");
  const [isAddingStudent, setIsAddingStudent] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const students = getStudentsByCourse(selectedYear, selectedDivision);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim() && newStudentDNI.trim()) {
      setIsSubmitting(true);
      try {
        await addStudent(newStudentName.trim(), selectedYear, selectedDivision, newStudentDNI.trim());
        setNewStudentName("");
        setNewStudentDNI("");
        setIsAddingStudent(false);
      } catch (error) {
        console.error("Error adding student:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este estudiante? Esta acción no se puede deshacer.")) {
      try {
        await deleteStudent(id);
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <Loader size={40} className="text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600">Cargando estudiantes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Estudiantes</h1>
        <button
          onClick={() => setIsAddingStudent(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center"
        >
          <UserPlus size={18} className="mr-2" />
          Agregar Estudiante
        </button>
      </div>

      <CourseSelector
        selectedYear={selectedYear}
        selectedDivision={selectedDivision}
        onYearChange={setSelectedYear}
        onDivisionChange={setSelectedDivision}
      />

      {isAddingStudent && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Agregar Nuevo Estudiante</h2>
          <form onSubmit={handleAddStudent} className="flex flex-col gap-4">
            <div className="flex-1">
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Estudiante
              </label>
              <input
                type="text"
                id="studentName"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nombre completo"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="studentDNI" className="block text-sm font-medium text-gray-700 mb-1">
                DNI del Estudiante
              </label>
              <input
                type="text"
                id="studentDNI"
                value={newStudentDNI}
                onChange={(e) => setNewStudentDNI(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="DNI"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingStudent(false);
                  setNewStudentName("");
                  setNewStudentDNI("");
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={18} className="animate-spin mr-2" />
                    Guardando...
                  </>
                ) : (
                  'Guardar'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">
          Estudiantes de {selectedYear}° "{selectedDivision}"
        </h2>
        <StudentList students={students} onDelete={handleDeleteStudent} />
      </div>
    </div>
  );
};

export default StudentsPage;