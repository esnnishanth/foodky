import json
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

with open('data/foods.json', 'r', encoding='utf-8') as f:
    FOOD_DATA = json.load(f)

@app.route('/')
def home():
    categories = sorted(set(f['category'] for f in FOOD_DATA))
    return render_template('index.html', categories=categories)

@app.route('/api/search')
def search():
    query = request.args.get('q', '').lower().strip()
    if not query:
        return jsonify([])
    results = []
    for food in FOOD_DATA:
        if query in food['name'].lower():
            results.append(food)
    results = sorted(results, key=lambda x: x['name'])
    return jsonify(results[:20])

@app.route('/api/food/<int:food_id>')
def food_detail(food_id):
    food = next((f for f in FOOD_DATA if f['id'] == food_id), None)
    if food:
        return jsonify(food)
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/category/<category>')
def category_foods(category):
    results = [f for f in FOOD_DATA if f['category'] == category]
    return jsonify(sorted(results, key=lambda x: x['name']))

@app.route('/api/categories')
def get_categories():
    categories = sorted(set(f['category'] for f in FOOD_DATA))
    return jsonify(categories)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
