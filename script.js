let assignments = JSON.parse(localStorage.getItem('assignments')) || {};
let currentAssignment = null;
let assignmentToDelete = null;
let loader = document.getElementById('loader');

// Font size adjustment
const fontSizeSlider = document.getElementById('font-size-slider');
const fontSizeValue = document.getElementById('font-size-value');

fontSizeSlider.addEventListener('input', () => {
    const fontSize = fontSizeSlider.value;
    document.documentElement.style.fontSize = `${fontSize}px`;
    fontSizeValue.textContent = `${fontSize}px`;
    localStorage.setItem('fontSize', fontSize);
});

// Clear all memory
const clearMemoryBtn = document.getElementById('clear-memory');

clearMemoryBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all memory? This action cannot be undone.')) {
        localStorage.clear();
        assignments = {};
        updateAssignmentList();
        alert('All memory has been cleared.');
    }
});

// Load saved settings
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        fontSizeSlider.value = savedFontSize;
        document.documentElement.style.fontSize = `${savedFontSize}px`;
        fontSizeValue.textContent = `${savedFontSize}px`;
    }

    updateAssignmentList();
});

function updateAssignmentList() {
    const assignmentList = document.getElementById('assignment-list');
    assignmentList.innerHTML = '<h3>Your Assignments</h3>';
    
    for (let assignmentName in assignments) {
        const assignmentItem = document.createElement('div');
        assignmentItem.className = 'assignment-item';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = assignmentName;
        nameSpan.onclick = () => loadAssignment(assignmentName);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            showDeleteConfirmation(assignmentName);
        };
        
        assignmentItem.appendChild(nameSpan);
        assignmentItem.appendChild(deleteBtn);
        assignmentList.appendChild(assignmentItem);
    }
}

function showCreateAssignmentForm() {
    document.getElementById('create-assignment-form').style.display = 'block';
}

function hideCreateAssignmentForm() {
    document.getElementById('create-assignment-form').style.display = 'none';
    document.getElementById('new-assignment-name').value = '';
}

function createAssignment() {
    const assignmentName = document.getElementById('new-assignment-name').value.trim();
    if (assignmentName && !assignments[assignmentName]) {
        assignments[assignmentName] = {};
        localStorage.setItem('assignments', JSON.stringify(assignments));
        updateAssignmentList();
        loadAssignment(assignmentName);
        hideCreateAssignmentForm();
    } else if (assignments[assignmentName]) {
        alert("An assignment with this name already exists.");
    } else {
        alert("Please enter a valid assignment name.");
    }
}

function showDeleteConfirmation(assignmentName) {
    assignmentToDelete = assignmentName;
    document.getElementById('delete-confirmation').style.display = 'block';
}

function hideDeleteConfirmation() {
    document.getElementById('delete-confirmation').style.display = 'none';
    assignmentToDelete = null;
}

function deleteAssignment() {
    if (assignmentToDelete) {
        delete assignments[assignmentToDelete];
        localStorage.setItem('assignments', JSON.stringify(assignments));
        updateAssignmentList();
        if (currentAssignment === assignmentToDelete) {
            currentAssignment = null;
            document.getElementById('checker-form').style.display = 'none';
            document.getElementById('results').innerHTML = '';
        }
        hideDeleteConfirmation();
    }
}

function loadAssignment(assignmentName) {
    currentAssignment = assignmentName;
    document.getElementById('current-assignment').textContent = `Current Assignment: ${assignmentName}`;
    document.getElementById('checker-form').style.display = 'block';
    document.getElementById('results').innerHTML = '';
}

function submitCode() {
    const name = document.getElementById('name').value.trim();
    const code = document.getElementById('code').value.trim();
    const resultsDiv = document.getElementById('results');
    const errorMessageDiv = document.getElementById('error-message');

    errorMessageDiv.innerHTML = '';
    resultsDiv.innerHTML = '';
    errorMessageDiv.innerHTML = '';
    resultsDiv.innerHTML = '';

    if (!name || !code) {
        errorMessageDiv.textContent = "Please enter your name and code.";
        return;
    }

    if (assignments[currentAssignment][name]) {
        errorMessageDiv.textContent = 'This name has already been used. Please use a different name.';
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
    const comparisonDiv = document.getElementById('comparison');
    const resultList = [];
    const matchPercentages = [];

    comparisonDiv.innerHTML = '<div class="code-container"><div id="original-code" class="code-box"></div><div id="changed-code" class="code-box"></div></div>';

    comparisonDiv.innerHTML = '<div class="code-container"><div id="original-code" class="code-box"></div><div id="changed-code" class="code-box"></div></div>';

    for (let [submittedName, submittedCode] of Object.entries(assignments[currentAssignment])) {
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

// Event Listeners
document.getElementById('create-assignment-btn').addEventListener('click', showCreateAssignmentForm);
document.getElementById('submit-new-assignment').addEventListener('click', createAssignment);
document.getElementById('cancel-new-assignment').addEventListener('click', hideCreateAssignmentForm);
document.getElementById('confirm-delete').addEventListener('click', deleteAssignment);
document.getElementById('cancel-delete').addEventListener('click', hideDeleteConfirmation);

// Call the function on load and resize
window.addEventListener('load', adjustMainContentHeight);
window.addEventListener('resize', adjustMainContentHeight);
