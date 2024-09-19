import React, { useState } from "react";

// Sample code snippets for plagiarism check (can be more extensive)
const sampleCodeSnippets = [
  {
    name: "Sample Code 1",
    code: `def hello_world():\n  print("Hello, world!")`
  },
  {
    name: "Sample Code 2",
    code: `def sum(a, b):\n  return a + b`
  }
];

// Function to check plagiarism by comparing student code with sample snippets
const checkPlagiarism = (studentCode) => {
  const results = sampleCodeSnippets.map((sample) => {
    // Simple similarity check using string matching (can be improved)
    const similarity = studentCode.includes(sample.code) ? 1 : 0;
    return {
      compared_with: sample.name,
      similarity
    };
  });
  return results;
};

function App() {
  const [studentName, setStudentName] = useState("");
  const [code, setCode] = useState("");
  const [results, setResults] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const plagiarismResults = checkPlagiarism(code);
    setResults(plagiarismResults);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>CodeGuard - Plagiarism Detection Prototype</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <label htmlFor="studentName">Student Name:</label>
          <input
            id="studentName"
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
            style={{ width: "100%", padding: "5px" }}
          />
        </div>
        <div>
          <label htmlFor="codeInput">Code:</label>
          <textarea
            id="codeInput"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            rows="10"
            style={{ width: "100%", padding: "5px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", cursor: "pointer" }}>
          Submit Code
        </button>
      </form>
      {results && (
        <div style={{ marginTop: "20px" }}>
          <h2>Plagiarism Results:</h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {results.map((result, index) => (
              <li key={index} style={{ marginBottom: "10px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px" }}>
                Compared with {result.compared_with}: Similarity{" "}
                <strong>{(result.similarity * 100).toFixed(2)}%</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;