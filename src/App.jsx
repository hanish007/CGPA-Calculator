import React, { useState } from "react";
import "./App.css";

function App() {
  const [courses, setCourses] = useState([{ subject: "", credits: "", grade: "" }]);
  const [cgpa, setCgpa] = useState(null);

  const gradeToPoints = {
    O: 10,
    "A+": 9,
    A: 8,
    "B+": 7,
    B: 6,
    C: 5,
  };

  const creditOptions = [1, 2, 3, 4, 5, 6];

  const handleChange = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
  };

  const addCourse = () => {
    setCourses([...courses, { subject: "", credits: "", grade: "" }]);
  };

  const removeCourse = (index) => {
    const newCourses = courses.filter((_, i) => i !== index);
    setCourses(newCourses);
  };

  const calculateCGPA = () => {
    let totalGradePoints = 0;
    let totalCredits = 0;

    courses.forEach((course) => {
      const gradePoints = gradeToPoints[course.grade];
      const credits = parseFloat(course.credits);
      if (gradePoints && credits) {
        totalGradePoints += gradePoints * credits;
        totalCredits += credits;
      }
    });

    setCgpa(totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0);
  };

  return (
    <div className="App">
      <h1>CGPA Calculator</h1>
      <div className="course-list">
        {courses.map((course, index) => (
          <div key={index} className="course-input">
            <input
              type="text"
              placeholder="Subject"
              value={course.subject}
              onChange={(e) => handleChange(index, "subject", e.target.value)}
              className="subject-input"
            />
            <select
              value={course.credits}
              onChange={(e) => handleChange(index, "credits", e.target.value)}
            >
              <option value="">Select Credits</option>
              {creditOptions.map((credit) => (
                <option key={credit} value={credit}>
                  {credit}
                </option>
              ))}
            </select>
            <select
              value={course.grade}
              onChange={(e) => handleChange(index, "grade", e.target.value)}
            >
              <option value="">Select Grade</option>
              {Object.keys(gradeToPoints).map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
            <button className="remove-btn" onClick={() => removeCourse(index)}>
              ✖
            </button>
          </div>
        ))}
      </div>
      <button className="add-btn" onClick={addCourse}>
        ➕ Add Course
      </button>
      <button className="calculate-btn" onClick={calculateCGPA}>
        🧮 Calculate CGPA
      </button>

      {cgpa !== null && <h2>Your CGPA: {cgpa}</h2>}
    </div>
  );
}

export default App;