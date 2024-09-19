import React, { useState } from "react";
import axios from "axios";

function App() {
  const [studentName, setStudentName] = useState("");
  const [code, setCode] = useState("");
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/submit_code", {
        student_name: studentName,
        code: code,
      });
      setResults(response.data.plagiarism_results);
    } catch (error) {
      console.error("There was an error submitting the code!", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>CodeGuard - Plagiarism Detection Prototype</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Student Name:</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Code:</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            rows="10"
            cols="50"
          />
        </div>
        <button type="submit">Submit Code</button>
      </form>

      {results && (
        <div style={{ marginTop: "20px" }}>
          <h2>Plagiarism Results:</h2>
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                Compared with {result.compared_with}: Similarity{" "}
                {(result.similarity * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
