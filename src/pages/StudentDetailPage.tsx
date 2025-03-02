import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAttendance } from '../context/AttendanceContext';
import StudentQR from '../components/StudentQR';
import AttendanceHistory from '../components/AttendanceHistory';
import CourseSelector from '../components/CourseSelector';
import { ArrowLeft, Save, Printer, Loader } from 'lucide-react';
import { divisions, years } from '../types';

const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getStudent, addStudent, loading } = useAttendance();
  
  const [name, setName] = useState<string>("");
  const [course, setCourse] = useState<number>(1);
  const [division, setDivision] = useState<string>("I");
  const [dni, setDni] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const student = id ? getStudent(id) : undefined;
  const isNewStudent = !student && !id;
  
  useEffect(() => {
    if (student) {
      setName(student.name);
      setCourse(student.course);
      setDivision(student.division);
      setDni(student.dni || "");
    }
  }, [student]);
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isNewStudent) {
        const newStudent = await addStudent(name, course, division, dni);
        navigate(`/student/${newStudent.id}`);
      } else {
        // Update student logic would go here
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving student:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <Loader size={40} className="text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600">Cargando información del estudiante...</p>
      </div>
    );
  }
  
  if (!student && !isNewStudent) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-xl text-gray-600">Estudiante no encontrado</p>
        <button
          onClick={() => navigate('/students')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Volver a la lista
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-gray-200"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isNewStudent ? "Nuevo Estudiante" : student?.name}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          {isEditing || isNewStudent ? (
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nombre del estudiante"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">
                  DNI
                </label>
                <input
                  type="text"
                  id="dni"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="DNI del estudiante"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <CourseSelector
                selectedYear={course}
                selectedDivision={division}
                onYearChange={setCourse}
                onDivisionChange={setDivision}
              />
              
              <div className="flex justify-end space-x-2 mt-4">
                {!isNewStudent && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      if (student) {
                        setName(student.name);
                        setCourse(student.course);
                        setDivision(student.division);
                        setDni(student.dni || "");
                      }
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={18} className="animate-spin mr-2" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Guardar
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Información del Estudiante</h2>
                <p className="mb-2">
                  <span className="font-medium">Nombre:</span> {student?.name}
                </p>
                <p className="mb-2">
                  <span className="font-medium">DNI:</span> {student?.dni}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Curso:</span> {student?.course}° "{student?.division}"
                </p>
                <p className="mb-4">
                  <span className="font-medium">ID:</span> {student?.id}
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Editar Información
                </button>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-4">Código QR del Estudiante</h2>
                <div className="flex flex-col items-center">
                  {student && (
                    <StudentQR student={student} />
                  )}
                  <button
                    onClick={handlePrint}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                  >
                    <Printer size={18} className="mr-2" />
                    Imprimir QR
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        
        {student && (
          <div>
            <AttendanceHistory student={student} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetailPage;