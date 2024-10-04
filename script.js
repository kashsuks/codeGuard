let currentAssignment = null;
let assignments = JSON.parse(localStorage.getItem('assignments')) || {};
let assignmentToDelete = null;

// DOM Elements
const assignmentList = document.getElementById('assignment-list');
const createAssignmentBtn = document.getElementById('create-assignment-btn');
const createAssignmentForm = document.getElementById('create-assignment-form');
const newAssignmentNameInput = document.getElementById('new-assignment-name');
const submitNewAssignmentBtn = document.getElementById('submit-new-assignment');
const cancelNewAssignmentBtn = document.getElementById('cancel-new-assignment');
const deleteConfirmationModal = document.getElementById('delete-confirmation');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const checkerForm = document.getElementById('checker-form');
const currentAssignmentTitle = document.getElementById('current-assignment');
const nameInput = document.getElementById('name');
const codeInput = document.getElementById('code');
const errorMessage = document.getElementById('error-message');
const resultsDiv = document.getElementById('results');
const loader = document.getElementById('loader');

// Sidebar navigation - show sections when corresponding links are clicked
document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        // Hide all sections
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));

        // Show the selected section
        const targetPage = this.getAttribute('href');
        document.querySelector(targetPage).classList.add('active');

        // Highlight the active link in the sidebar
        document.querySelectorAll('.sidebar nav a').forEach(navLink => navLink.classList.remove('active'));
        this.classList.add('active');
    });
});

// Theme selection
const themeSelect = document.getElementById('theme-select');
themeSelect.addEventListener('change', () => {
    const selectedTheme = themeSelect.value;
    applyTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
});

function applyTheme(theme) {
    document.body.className = theme;
    updateThemeColors(theme);
}

function updateThemeColors(theme) {
    const root = document.documentElement;
    switch (theme) {
        case 'ocean-breeze':
            root.style.setProperty('--background-color', '#dff9fb');
            root.style.setProperty('--text-color', '#130f40');
            root.style.setProperty('--sidebar-background', '#130f40');
            root.style.setProperty('--active-link-background', '#535c68');
            root.style.setProperty('--button-background', '#0984e3');
            root.style.setProperty('--button-hover', '#74b9ff');
            break;
        case 'sunset-horizon':
            root.style.setProperty('--background-color', '#ffeaa7');
            root.style.setProperty('--text-color', '#2d3436');
            root.style.setProperty('--sidebar-background', '#e17055');
            root.style.setProperty('--active-link-background', '#d63031');
            root.style.setProperty('--button-background', '#fd79a8');
            root.style.setProperty('--button-hover', '#ff7675');
            break;
        default:
            root.style.setProperty('--background-color', '#f8f9fa');
            root.style.setProperty('--text-color', '#333');
            root.style.setProperty('--sidebar-background', '#2c3e50');
            root.style.setProperty('--active-link-background', '#34495e');
            root.style.setProperty('--button-background', '#007bff');
            root.style.setProperty('--button-hover', '#0056b3');
    }
}

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
    if (savedTheme) {
        applyTheme(savedTheme);
        themeSelect.value = savedTheme;
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
    assignmentList.innerHTML = '<h3>Your Assignments</h3>';
    
    if (Object.keys(assignments).length === 0) {
        assignmentList.innerHTML += '<p>No assignments yet. Create one to get started!</p>';
    } else {
        for (let assignmentName in assignments) {
            const assignmentItem = document.createElement('div');
            assignmentItem.className = 'assignment-item';
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = assignmentName;
            nameSpan.onclick = () => loadAssignment(assignmentName);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-danger';
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                showDeleteConfirmation(assignmentName);
            };
            
            assignmentItem.appendChild(nameSpan);
            assignmentItem.appendChild(deleteBtn);
            assignmentList.appendChild(assignmentItem);
        }
    }
}

createAssignmentBtn.addEventListener('click', showCreateAssignmentForm);
submitNewAssignmentBtn.addEventListener('click', createAssignment);
cancelNewAssignmentBtn.addEventListener('click', hideCreateAssignmentForm);
confirmDeleteBtn.addEventListener('click', deleteAssignment);
cancelDeleteBtn.addEventListener('click', hideDeleteConfirmation);

function showCreateAssignmentForm() {
    createAssignmentForm.style.display = 'block';
}

function hideCreateAssignmentForm() {
    createAssignmentForm.style.display = 'none';
    newAssignmentNameInput.value = '';
}

function createAssignment() {
    const assignmentName = newAssignmentNameInput.value.trim();
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
    deleteConfirmationModal.style.display = 'block';
}

function hideDeleteConfirmation() {
    deleteConfirmationModal.style.display = 'none';
    assignmentToDelete = null;
}

function deleteAssignment() {
    if (assignmentToDelete) {
        delete assignments[assignmentToDelete];
        localStorage.setItem('assignments', JSON.stringify(assignments));
        updateAssignmentList();
        if (currentAssignment === assignmentToDelete) {
            currentAssignment = null;
            checkerForm.style.display = 'none';
            resultsDiv.innerHTML = '';
        }
        hideDeleteConfirmation();
    }
}

function loadAssignment(assignmentName) {
    currentAssignment = assignmentName;
    currentAssignmentTitle.textContent = `Current Assignment: ${assignmentName}`;
    checkerForm.style.display = 'block';
    resultsDiv.innerHTML = '';
}

function submitCode() {
    if (!currentAssignment) {
        alert("Please select or create an assignment first.");
        return;
    }

    const name = nameInput.value.trim();
    const code = codeInput.value.trim();

    errorMessage.innerHTML = '';
    resultsDiv.innerHTML = '';

    if (!name || !code) {
        errorMessage.innerHTML = 'Please fill in both fields.';
        return;
    }

    if (assignments[currentAssignment][name]) {
        errorMessage.innerHTML = 'This name has already been used in this assignment. Please use a different name.';
        return;
    }

    loader.style.display = 'block';

    setTimeout(() => {
        assignments[currentAssignment][name] = code;
        localStorage.setItem('assignments', JSON.stringify(assignments));

        nameInput.value = '';
        codeInput.value = '';

        checkPlagiarism(name, code);
        loader.style.display = 'none';
    }, 1000);
}

function checkPlagiarism(name, code) {
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
        resultsDiv.innerHTML = '<h3>Possible Matches:</h3>';
        matchPercentages.sort((a, b) => b.percentage - a.percentage);

        matchPercentages.forEach(match => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `<strong>${match.name}</strong> - ${match.percentage}% match 
                                    <button class="btn btn-primary" onclick="compareCodes('${name}', '${match.name}')">Compare</button>`;
            resultsDiv.appendChild(resultItem);
        });
    } else {
        resultsDiv.innerHTML = '<p>No matches found.</p>';
    }
}

function calculateLCSPercentage(code1, code2) {
    const len1 = code1.length;
    const len2 = code2.length;

    const dp = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (code1[i - 1] === code2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    const lcsLength = dp[len1][len2];
    const maxLen = Math.max(len1, len2);
    return Math.floor((lcsLength / maxLen) * 100);
}

function compareCodes(name1, name2) {
    const code1 = assignments[currentAssignment][name1];
    const code2 = assignments[currentAssignment][name2];

    const diff = createDiff(code1, code2);

    resultsDiv.innerHTML = `<h3>Comparison between ${name1} and ${name2}:</h3>`;
    resultsDiv.innerHTML += `<pre>${diff}</pre>`;
}

function createDiff(code1, code2) {
    const diff = [];

    const lines1 = code1.split('\n');
    const lines2 = code2.split('\n');

    let i = 0, j = 0;
    while (i < lines1.length && j < lines2.length) {
        if (lines1[i] === lines2[j]) {
            diff.push(` ${lines1[i]}`);
            i++;
            j++;
        } else if (lines1[i] !== lines2[j]) {
            diff.push(`- ${lines1[i]}`);
            diff.push(`+ ${lines2[j]}`);
            i++;
            j++;
        }
    }

    while (i < lines1.length) {
        diff.push(`- ${lines1[i]}`);
        i++;
    }

    while (j < lines2.length) {
        diff.push(`+ ${lines2[j]}`);
        j++;
    }

    return diff.join('\n');
}
