# CodeGuard - A Web-Based Plagiarism Detection Tool

![CodeGuard Logo](images/codeguard-logo.svg)

[![Version](https://img.shields.io/badge/version-1.0-blue)](https://github.com/kashyapsukshavasi/CodeGuard)
[![License](https://img.shields.io/github/license/kashyapsukshavasi/CodeGuard)](https://github.com/kashyapsukshavasi/CodeGuard/blob/main/LICENSE)
[![Issues](https://img.shields.io/github/issues/kashyapsukshavasi/CodeGuard)](https://github.com/kashyapsukshavasi/CodeGuard/issues)
[![Contributors](https://img.shields.io/github/contributors/kashyapsukshavasi/CodeGuard)](https://github.com/kashyapsukshavasi/CodeGuard/graphs/contributors)

## Introduction

**CodeGuard** is a fully web-based application designed to help developers and educators detect plagiarism in programming assignments and projects. Built with a front-end-only architecture using modern web technologies, CodeGuard allows users to upload their code and receive real-time results on potential matches, helping ensure academic integrity and originality.

## Features

- **Real-Time Plagiarism Detection**: Quickly checks submitted code against a database of prior submissions.
- **Interactive User Interface**: Built with smooth animations, transitions, and an intuitive layout.
- **Percentage Match Results**: Displays the percentage of similarity between the submitted code and other projects.
- **Customizable Layout**: Features a clean, responsive design optimized for both desktop and mobile devices.
- **Lightweight & Fast**: No backend server needed. All the logic is handled client-side, ensuring quick responses.
  
## How It Works

1. **Upload Code**: Submit the code you want to check for plagiarism via a simple drag-and-drop interface or file upload.
2. **Receive Results**: The application compares the code against previous submissions and provides a similarity score.
3. **View Details**: Explore detailed reports that highlight matched sections and provide the percentage of similarity.

## Technologies Used

- **React** for building dynamic user interfaces.
- **Axios** for managing HTTP requests to external services.
- **HTML5** and **CSS3** for structuring and styling the web app.
- **JavaScript (ES6+)** for implementing the core functionality.
- **Web Animations API** for smooth transitions and effects.

## Installation

You can clone this repository to get started with **CodeGuard**:

```bash
git clone https://github.com/kashyapsukshavasi/CodeGuard.git
cd CodeGuard
npm install
npm start
