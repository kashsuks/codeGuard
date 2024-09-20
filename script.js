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

function adjustMainContentHeight() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content-wrapper');
    const footer = document.querySelector('.footer');
    
    const windowHeight = window.innerHeight;
    const sidebarHeight = sidebar.offsetHeight;
    const footerHeight = footer.offsetHeight;
    
    mainContent.style.minHeight = `${Math.max(sidebarHeight, windowHeight - footerHeight)}px`;
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
