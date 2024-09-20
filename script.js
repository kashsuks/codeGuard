const submissions = {};

// Handle form submission
function submitCode() {
    const name = document.getElementById('name').value.trim();
    const code = document.getElementById('code').value.trim();
    const resultsDiv = document.getElementById('results');
    const errorMessageDiv = document.getElementById('error-message');

    errorMessageDiv.innerHTML = ''; // Clear previous errors
    resultsDiv.innerHTML = ''; // Clear previous results

    // Validate inputs
    if (!name || !code) {
        errorMessageDiv.innerHTML = 'Please fill in both fields.';
        return;
    }

    if (submissions[name]) {
        errorMessageDiv.innerHTML = 'This name has already been used. Please use a different name.';
        return;
    }

    // Store the code submission
    submissions[name] = code;

    // Clear the form after submission
    document.getElementById('name').value = '';
    document.getElementById('code').value = '';

    checkPlagiarism(name, code);
}

// Check for plagiarism
function checkPlagiarism(name, code) {
    const resultsDiv = document.getElementById('results');
    const resultList = [];
    const matchPercentages = [];

    for (let [submittedName, submittedCode] of Object.entries(submissions)) {
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

// Calculate LCS (Longest Common Subsequence) similarity percentage
function calculateLCSPercentage(code1, code2) {
    const lcsLength = longestCommonSubsequenceLength(code1, code2);
    const maxLength = Math.max(code1.length, code2.length);
    return (lcsLength / maxLength) * 100; // Percentage of similarity
}

// Helper function to calculate LCS length
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
