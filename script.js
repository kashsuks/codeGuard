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

    for (let [submittedName, submittedCode] of Object.entries(submissions)) {
        if (submittedName !== name) {
            const isPlagiarized = code === submittedCode;
            if (isPlagiarized) {
                resultList.push(`<div class="result">Plagiarism detected with name: ${submittedName}</div>`);
            }
        }
    }

    if (resultList.length > 0) {
        resultsDiv.innerHTML = resultList.join('');
    } else {
        resultsDiv.innerHTML = '<div class="result">No plagiarism detected.</div>';
    }
}
