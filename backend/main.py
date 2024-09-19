from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import difflib
import os

app = Flask(__name__, static_folder='build', static_url_path='')

# Enable CORS for all routes
CORS(app)

# Basic storage for user-submitted code
submissions = {}

# Plagiarism checker function using difflib for simple code comparison
def check_plagiarism(new_code, stored_code):
    similarity = difflib.SequenceMatcher(None, new_code, stored_code).ratio()
    return similarity

@app.route('/submit_code', methods=['POST'])
def submit_code():
    data = request.get_json()
    student_name = data['student_name']
    code = data['code']
    
    # Store the submission
    if student_name not in submissions:
        submissions[student_name] = code
    else:
        return jsonify({"message": "Code already submitted"}), 400
    
    # Check for plagiarism against all existing submissions
    plagiarism_results = []
    for other_student, other_code in submissions.items():
        if other_student != student_name:
            similarity = check_plagiarism(code, other_code)
            plagiarism_results.append({
                "compared_with": other_student,
                "similarity": similarity
            })

    return jsonify({
        "message": "Code submitted successfully",
        "plagiarism_results": plagiarism_results
    }), 200

@app.route('/get_submissions', methods=['GET'])
def get_submissions():
    return jsonify(submissions), 200

# Serve the React frontend
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

# Serve all other routes from React
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
