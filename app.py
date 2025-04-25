from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

# Load content from JSON
with open('static/data/content.json', 'r') as f:
    content = json.load(f)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/content')
def get_content():
    return jsonify(content)

if __name__ == '__main__':
    app.run(debug=True) 