import React, { useState } from "react";
import "./App.css";

function App() {
  const [semesters, setSemesters] = useState({
    1: [{ subject: "", credits: "", grade: "" }],
  });

  const [selectedSemester, setSelectedSemester] = useState(1);
  const [cgpa, setCgpa] = useState(null);
  const [semesterGPA, setSemesterGPA] = useState({});

  const [weightedInputs, setWeightedInputs] = useState({
    totalWeightedGradePoints: "",
    totalCredits: "",
    resultCGPA: null,
  });

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

    const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(3) : 0;
    setSemesterGPA((prev) => ({
      ...prev,
      [selectedSemester]: gpa,
    }));
  };

  const calculateCGPA = () => {
    let totalWeightedGradePoints = 0;
    let totalCredits = 0;

    for (let semester = 1; semester <= Object.keys(semesters).length; semester++) {
      let semesterCredits = 0;
      let semesterGradePoints = 0;

      semesters[semester]?.forEach((course) => {
        const gradePoints = gradeToPoints[course.grade];
        const credits = parseFloat(course.credits);
        if (gradePoints && credits) {
          semesterGradePoints += gradePoints * credits;
          semesterCredits += credits;
        }
      });

      if (semesterCredits > 0) {
        totalWeightedGradePoints += semesterGradePoints;
        totalCredits += semesterCredits;
      }
    }

    const cgpa = totalCredits > 0 ? (totalWeightedGradePoints / totalCredits).toFixed(2) : 0;
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

  const deleteSemester = (semesterToDelete) => {
    if (Object.keys(semesters).length > 1) {
      const updatedSemesters = { ...semesters };
      delete updatedSemesters[semesterToDelete];

      // Adjust semester numbers
      const reorderedSemesters = Object.keys(updatedSemesters)
        .sort((a, b) => a - b)
        .reduce((acc, key, index) => {
          acc[index + 1] = updatedSemesters[key];
          return acc;
        }, {});

      setSemesters(reorderedSemesters);

      // Adjust selected semester
      const newSelectedSemester =
        semesterToDelete > 1 ? semesterToDelete - 1 : 1;
      setSelectedSemester(newSelectedSemester);
    }
  };

  const handleWeightedInputChange = (field, value) => {
    setWeightedInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateWeightedCGPA = () => {
    const { totalWeightedGradePoints, totalCredits } = weightedInputs;
    const weightedCGPA =
      totalCredits > 0
        ? (parseFloat(totalWeightedGradePoints) / parseFloat(totalCredits)).toFixed(2)
        : 0;
    setWeightedInputs((prev) => ({
      ...prev,
      resultCGPA: weightedCGPA,
    }));
  };

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar">
        <ul>
          <li><a href="#cgpa-calculator">CGPA Calculator</a></li>
          <li><a href="#weighted-cgpa-calculator">Weighted CGPA Calculator</a></li>
          <li><a href="#about-us">About Us</a></li>
        </ul>
      </nav>

      <h1>CGPA & Weighted CGPA Calculator</h1>

      {/* CGPA Calculator Section */}
      <div className="cgpa-section" id="cgpa-calculator">
        <h2>CGPA Calculator</h2>
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
            <div className="semester-actions">
              <button className="add-semester-btn" onClick={addSemester}>
                Add Semester
              </button>
              <button
                className="delete-semester-btn"
                onClick={() => deleteSemester(selectedSemester)}
                disabled={Object.keys(semesters).length === 1}
              >
                Delete Semester
              </button>
            </div>
          </div>

          <div className="semester-section">
            <h2>Semester {selectedSemester}</h2>
            {semesters[selectedSemester]?.map((course, index) => (
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
                  {[1, 2, 3, 4, 5, 6].map((credit) => (
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
            <button className="add-btn" onClick={addCourse}>
              ➕ Add Subject
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

      {/* Weighted CGPA Section */}
      <div className="weighted-section" id="weighted-cgpa-calculator">
        <h2>Weighted CGPA Calculator</h2>
        <div className="weighted-input">
          <label>Total Weighted Grade Points:</label>
          <input
            type="number"
            value={weightedInputs.totalWeightedGradePoints}
            onChange={(e) =>
              handleWeightedInputChange("totalWeightedGradePoints", e.target.value)
            }
          />
        </div>
        <div className="weighted-input">
          <label>Total Credits:</label>
          <input
            type="number"
            value={weightedInputs.totalCredits}
            onChange={(e) =>
              handleWeightedInputChange("totalCredits", e.target.value)
            }
          />
        </div>
        <button className="calculate-btn" onClick={calculateWeightedCGPA}>
          📊 Calculate Weighted CGPA
        </button>
        {weightedInputs.resultCGPA !== null && (
          <h3>Weighted CGPA: {weightedInputs.resultCGPA}</h3>
        )}
      </div>

      {/* About Us Section */}
      <div className="about-us" id="about-us">
        <h2>About Us</h2>
        <p>We are dedicated to helping students track their academic performance with ease.</p>
      </div>
    </div>
  );
}

export default App;
