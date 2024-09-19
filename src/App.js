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
