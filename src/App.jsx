import React, { useState } from "react";
import "./App.css";

function App() {
  const [semesters, setSemesters] = useState({
    1: [{ subject: "", credits: "", grade: "" }],
  });

  const [selectedSemester, setSelectedSemester] = useState(1);
  const [cgpa, setCgpa] = useState(null);
  const [semesterGPA, setSemesterGPA] = useState({});

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
    const updatedSemesters = { ...semesters };
    updatedSemesters[selectedSemester][index][field] = value;
    setSemesters(updatedSemesters);
  };

  const addCourse = () => {
    const updatedSemesters = { ...semesters };
    updatedSemesters[selectedSemester] = [
      ...updatedSemesters[selectedSemester],
      { subject: "", credits: "", grade: "" },
    ];
    setSemesters(updatedSemesters);
  };

  const removeCourse = (index) => {
    const updatedSemesters = { ...semesters };
    updatedSemesters[selectedSemester] = updatedSemesters[selectedSemester].filter(
      (_, i) => i !== index
    );
    setSemesters(updatedSemesters);
  };

  const calculateGPA = () => {
    let totalGradePoints = 0;
    let totalCredits = 0;

    semesters[selectedSemester]?.forEach((course) => {
      const gradePoints = gradeToPoints[course.grade];
      const credits = parseFloat(course.credits);
      if (gradePoints && credits) {
        totalGradePoints += gradePoints * credits;
        totalCredits += credits;
      }
    });

    const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;
    setSemesterGPA((prev) => ({
      ...prev,
      [selectedSemester]: gpa,
    }));
  };

  const calculateCGPA = () => {
    let totalGPA = 0;
    let count = 0;

    for (let semester = 1; semester <= Object.keys(semesters).length; semester++) {
      if (semesterGPA[semester]) {
        totalGPA += parseFloat(semesterGPA[semester]);
        count++;
      }
    }

    const cgpa = count > 0 ? (totalGPA / count).toFixed(2) : 0;
    setCgpa(cgpa);
  };

  const addSemester = () => {
    const newSemester = Object.keys(semesters).length + 1;
    setSemesters({
      ...semesters,
      [newSemester]: [{ subject: "", credits: "", grade: "" }],
    });
    setSelectedSemester(newSemester);
  };

  return (
    <div className="App">
      <h1>CGPA Calculator</h1>
      <div className="layout">
        <div className="semester-list">
          {Object.keys(semesters).map((semester) => (
            <button
              key={semester}
              className={`semester-btn ${
                Number(semester) === selectedSemester ? "active" : ""
              }`}
              onClick={() => setSelectedSemester(Number(semester))}
            >
              Semester {semester}
            </button>
          ))}
          <button className="add-semester-btn" onClick={addSemester}>
            ➕ Add Semester
          </button>
        </div>
        <div className="semester-section">
          <h2>Semester {selectedSemester}</h2>
          {semesters[selectedSemester]?.map((course, index) => (
            <div key={index} className="course-input">
              <input
                type="text"
                placeholder="Subject"
                value={course.subject}
                onChange={(e) =>
                  handleChange(index, "subject", e.target.value)
                }
                className="subject-input"
              />
              <select
                value={course.credits}
                onChange={(e) =>
                  handleChange(index, "credits", e.target.value)
                }
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
                onChange={(e) =>
                  handleChange(index, "grade", e.target.value)
                }
              >
                <option value="">Select Grade</option>
                {Object.keys(gradeToPoints).map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
              <button
                className="remove-btn"
                onClick={() => removeCourse(index)}
              >
                ✖
              </button>
            </div>
          ))}
          <button className="add-btn" onClick={addCourse}>
            ➕ Add Course
          </button>
          <button className="gpa-btn" onClick={calculateGPA}>
            📊 Calculate GPA
          </button>
          {semesterGPA[selectedSemester] && (
            <h3>GPA for Semester {selectedSemester}: {semesterGPA[selectedSemester]}</h3>
          )}
        </div>
      </div>
      <div className="action-buttons">
        <button className="calculate-btn" onClick={calculateCGPA}>
          🧮 Calculate CGPA
        </button>
      </div>
      {cgpa !== null && <h2>Overall CGPA: {cgpa}</h2>}
    </div>
  );
}

export default App;
