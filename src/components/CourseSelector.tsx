import React from 'react';
import { divisions, years } from '../types';

interface CourseSelectorProps {
  selectedYear: number;
  selectedDivision: string;
  onYearChange: (year: number) => void;
  onDivisionChange: (division: string) => void;
}

const CourseSelector: React.FC<CourseSelectorProps> = ({
  selectedYear,
  selectedDivision,
  onYearChange,
  onDivisionChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
          Año
        </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}° Año
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-1">
          División
        </label>
        <select
          id="division"
          value={selectedDivision}
          onChange={(e) => onDivisionChange(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {divisions.map((division) => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CourseSelector;