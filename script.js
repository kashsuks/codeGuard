const submissions = {};

function submitCode() {
    const name = document.getElementById('name').value.trim();
    const code = document.getElementById('code').value.trim();
    const resultsDiv = document.getElementById('results');
    const errorMessageDiv = document.getElementById('error-message');

    errorMessageDiv.innerHTML = '';
    resultsDiv.innerHTML = '';

    if (!name || !code) {
        errorMessageDiv.innerHTML = 'Please fill in both fields.';
        return;
    }

    if (submissions[name]) {
        errorMessageDiv.innerHTML = 'This name has already been used. Please use a different name.';
        return;
    }

    submissions[name] = code;

    document.getElementById('name').value = '';
    document.getElementById('code').value = '';

    checkPlagiarism(name, code);
}

function checkPlagiarism(name, code) {
    const resultsDiv = document.getElementById('results');
    const comparisonDiv = document.getElementById('comparison');
    const resultList = [];
    const matchPercentages = [];

    comparisonDiv.innerHTML = '<div class="code-container"><div id="original-code" class="code-box"></div><div id="changed-code" class="code-box"></div></div>';

    for (let [submittedName, submittedCode] of Object.entries(submissions)) {
        if (submittedName !== name) {
            const matchPercentage = calculateLCSPercentage(code, submittedCode);
            if (matchPercentage > 0) {
                matchPercentages.push({ name: submittedName, percentage: matchPercentage, original: submittedCode });
            }
        }
    }

    if (matchPercentages.length > 0) {
        matchPercentages.forEach(result => {
            resultList.push(`
                <div class="result">
                    <span>Plagiarism detected with name: ${result.name}. Match: ${result.percentage.toFixed(2)}%</span>
                    <button onclick="compareCodes('${result.name}', '${name}')">Compare</button>
                </div>
            `);
        });
    } else {
        resultList.push('<div class="result">No plagiarism detected.</div>');
    }

    resultsDiv.innerHTML = resultList.join('');
}

function compareCodes(originalName, changedName) {
    const originalCodeDiv = document.getElementById('original-code');
    const changedCodeDiv = document.getElementById('changed-code');
    const originalCode = submissions[originalName];
    const changedCode = submissions[changedName];

    originalCodeDiv.innerHTML = `<h4>${originalName}</h4>`;
    changedCodeDiv.innerHTML = `<h4>${changedName}</h4>`;

    const diff = calculateDetailedDiff(originalCode, changedCode);
    
    originalCodeDiv.innerHTML += '<pre>' + diff.original + '</pre>';
    changedCodeDiv.innerHTML += '<pre>' + diff.changed + '</pre>';
}

function calculateDetailedDiff(oldStr, newStr) {
    const oldLines = oldStr.split('\n');
    const newLines = newStr.split('\n');
    let originalResult = '';
    let changedResult = '';

    for (let i = 0; i < Math.max(oldLines.length, newLines.length); i++) {
        const oldLine = oldLines[i] || '';
        const newLine = newLines[i] || '';
        
        if (oldLine === newLine) {
            originalResult += oldLine + '\n';
            changedResult += newLine + '\n';
        } else {
            const [oldHighlighted, newHighlighted] = highlightDifferences(oldLine, newLine);
            originalResult += `<span class="removed">${oldHighlighted}</span>\n`;
            changedResult += `<span class="added">${newHighlighted}</span>\n`;
        }
    }

    return { original: originalResult, changed: changedResult };
}

function highlightDifferences(oldLine, newLine) {
    const oldTokens = oldLine.split(/(\s+|[(){}[\],.])/);
    const newTokens = newLine.split(/(\s+|[(){}[\],.])/);
    let oldResult = '';
    let newResult = '';

    for (let i = 0; i < Math.max(oldTokens.length, newTokens.length); i++) {
        const oldToken = oldTokens[i] || '';
        const newToken = newTokens[i] || '';

        if (oldToken === newToken) {
            oldResult += oldToken;
            newResult += newToken;
        } else {
            oldResult += `<span style="background-color: #ffeef0;">${oldToken}</span>`;
            newResult += `<span style="background-color: #e6ffed;">${newToken}</span>`;
        }
    }

    return [oldResult, newResult];
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