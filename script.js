const submissions = {};

function submitCode() {
    const name = document.getElementById('name').value.trim();
    const code = document.getElementById('code').value.trim();
    const resultsDiv = document.getElementById('results');

    if (!name || !code) {
        alert('Please fill in both fields.');
        return;
    }

    if (submissions[name]) {
        alert('This name has already been used. Please use a different name.');
        return;
    }

    submissions[name] = code;
    checkPlagiarism(name, code);
}

function checkPlagiarism(name, code) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const resultList = [];
    const matchPercentages = [];

    for (let [submittedName, submittedCode] of Object.entries(submissions)) {
        if (submittedName !== name) {
            const matchPercentage = calculateMatchPercentage(code, submittedCode);
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
        resultsDiv.innerHTML = '<div class="result">No plagiarism detected.</div>';
    }
}

function calculateMatchPercentage(code1, code2) {
    const code1Tokens = tokenize(code1);
    const code2Tokens = tokenize(code2);

    const intersection = code1Tokens.filter(token => code2Tokens.includes(token));
    const union = new Set([...code1Tokens, ...code2Tokens]);

    const matchPercentage = (intersection.length / union.size) * 100;
    return matchPercentage;
}

function tokenize(code) {
    return code
        .toLowerCase()
        .split(/\s+/)
        .filter(token => token.length > 0);
}
