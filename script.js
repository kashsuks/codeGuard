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

// Sidebar navigation
document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.querySelector(this.getAttribute('href')).classList.add('active');
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
        // ... (add cases for other themes) ...
        default:
            // Default theme colors
            root.style.setProperty('--background-color', '#f8f9fa');
            root.style.setProperty('--text-color', '#333');
            root.style.setProperty('--sidebar-background', '#2c3e50');
            root.style.setProperty('--active-link-background', '#34495e');
            root.style.setProperty('--button-background', '#007bff');
            root.style.setProperty('--button-hover', '#0056b3');
    }
}

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
        // ... (add cases for other themes) ...
        default:
            // Default theme colors
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
        matchPercentages.forEach(result => {
            resultList.push(`<div class="result">
                <h4>Match found with: ${result.name}</h4>
                <p>Similarity: ${result.percentage.toFixed(2)}%</p>
            </div>`);
        });
    } else {
        resultList.push('<div class="result"><h4>No plagiarism detected.</h4></div>');
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

// Adjust main content height
function adjustMainContentHeight() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content-wrapper');
    const footer = document.querySelector('.footer');
    
    const windowHeight = window.innerHeight;
    const sidebarHeight = sidebar.offsetHeight;
    const footerHeight = footer.offsetHeight;
    
    mainContent.style.minHeight = `${Math.max(sidebarHeight, windowHeight - footerHeight)}px`;
}

window.addEventListener('load', adjustMainContentHeight);
window.addEventListener('resize', adjustMainContentHeight);