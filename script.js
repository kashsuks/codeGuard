let currentAssignment = null;
let assignments = JSON.parse(localStorage.getItem('assignments')) || {};

function updateAssignmentList() {
    const assignmentList = document.getElementById('assignment-list');
    assignmentList.innerHTML = '<h3>Your Assignments</h3>';
    
    for (let assignmentName in assignments) {
        const assignmentItem = document.createElement('div');
        assignmentItem.className = 'assignment-item';
        assignmentItem.textContent = assignmentName;
        assignmentItem.onclick = () => loadAssignment(assignmentName);
        assignmentList.appendChild(assignmentItem);
    }
}

function createAssignment() {
    const assignmentName = prompt("Enter the name for the new assignment:");
    if (assignmentName && !assignments[assignmentName]) {
        assignments[assignmentName] = {};
        localStorage.setItem('assignments', JSON.stringify(assignments));
        updateAssignmentList();
        loadAssignment(assignmentName);
    } else if (assignments[assignmentName]) {
        alert("An assignment with this name already exists.");
    }
}

function loadAssignment(assignmentName) {
    currentAssignment = assignmentName;
    document.getElementById('current-assignment').textContent = `Current Assignment: ${assignmentName}`;
    document.getElementById('checker-form').style.display = 'block';
    document.getElementById('results').innerHTML = '';
}

function submitCode() {
    if (!currentAssignment) {
        alert("Please select or create an assignment first.");
        return;
    }

    const name = document.getElementById('name').value.trim();
    const code = document.getElementById('code').value.trim();
    const resultsDiv = document.getElementById('results');
    const errorMessageDiv = document.getElementById('error-message');
    const loader = document.getElementById('loader');

    errorMessageDiv.innerHTML = '';
    resultsDiv.innerHTML = '';

    if (!name || !code) {
        errorMessageDiv.innerHTML = 'Please fill in both fields.';
        return;
    }

    if (assignments[currentAssignment][name]) {
        errorMessageDiv.innerHTML = 'This name has already been used in this assignment. Please use a different name.';
        return;
    }

    loader.style.display = 'block';

    setTimeout(() => {
        assignments[currentAssignment][name] = code;
        localStorage.setItem('assignments', JSON.stringify(assignments));

        document.getElementById('name').value = '';
        document.getElementById('code').value = '';

        checkPlagiarism(name, code);
        loader.style.display = 'none';
    }, 1000);
}

function checkPlagiarism(name, code) {
    const resultsDiv = document.getElementById('results');
    const resultList = [];
    const matchPercentages = [];

    for (let [submittedName, submittedCode] of Object.entries(assignments[currentAssignment])) {
        if (submittedName !== name) {
            const matchPercentage = calculateLCSPercentage(code, submittedCode);
            if (matchPercentage > 0) {
                matchPercentages.push({ name: submittedName, percentage: matchPercentage });
            }
        }
    }

    if (matchPercentages.length > 0) {
        matchPercentages.forEach(result => {
            resultList.push(`<div class="result">Plagiarism detected with name: ${result.name}. Match: ${result.percentage.toFixed(2)}%</div>`);
        });
    } else {
        resultList.push('<div class="result">No plagiarism detected.</div>');
    }

    resultsDiv.innerHTML = resultList.join('');
}

function calculateLCSPercentage(code1, code2) {
    const lcsLength = longestCommonSubsequenceLength(code1, code2);
    const maxLength = Math.max(code1.length, code2.length);
    return (lcsLength / maxLength) * 100;
}

function longestCommonSubsequenceLength(a, b) {
    const dp = Array(a.length + 1).fill().map(() => Array(b.length + 1).fill(0));

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[a.length][b.length];
}

// Initialize the assignment list when the page loads
updateAssignmentList();