from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

# Load content from JSON
with open('static/data/content.json', 'r') as f:
    content = json.load(f)

# Load byte5 specific content
with open('static/data/byte5_content.json', 'r') as f:
    byte5_content = json.load(f)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/screen')
def screen():
    return render_template('screen.html')

@app.route('/byte5')
def byte5():
    return render_template('byte5.html')

@app.route('/presenter')
def presenter():
    return render_template('presenter.html')

@app.route('/api/content')
def get_content():
    return jsonify(content)

@app.route('/api/byte5-content')
def get_byte5_content():
    return jsonify(byte5_content)

if __name__ == '__main__':
    app.run(debug=True) 