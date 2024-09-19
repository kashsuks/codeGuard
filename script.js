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
    const codeLengths = [];

    for (let [submittedName, submittedCode] of Object.entries(submissions)) {
        if (submittedName !== name) {
            const matchPercentage = calculateMatchPercentage(code, submittedCode);
            if (matchPercentage > 0) {
                resultList.push(`<div class="result">Plagiarism detected with name: ${submittedName}. Match: ${matchPercentage.toFixed(2)}%</div>`);
            }
        }
    }

    if (resultList.length > 0) {
        resultsDiv.innerHTML = resultList.join('');
    } else {
        resultsDiv.innerHTML = '<div class="result">No plagiarism detected.</div>';
    }
}

function calculateMatchPercentage(code1, code2) {
    if (!code1 || !code2) return 0;

    const code1Words = code1.split(/\s+/).length;
    const code2Words = code2.split(/\s+/).length;
    const commonWords = code1.split(/\s+/).filter(word => code2.includes(word)).length;

    // Simple percentage calculation based on word occurrence
    return (commonWords / Math.max(code1Words, code2Words)) * 100;
}
