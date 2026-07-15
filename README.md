# Foodky 🍽️

Foodky is a **Food Preservation Guide** web app that helps you find shelf life, storage methods, and preservation tips for 100+ dishes and ingredients.

<p align="center">
  <img src="https://github.com/user-attachments/assets/d1dd2c46-5217-4a97-9fb5-b932f5d7e269" alt="Foodky Home Page" width="80%">
</p>

## Features

-  **Live search** with autocomplete — find any food instantly
-  **Shelf life info** — room temperature, refrigerated, frozen
-  **Preservative methods** & optimal storage temperature
-  **Category browsing** — browse 30+ food categories
-  **Pro tips** — storage and reheating recommendations
-  **Dark theme** — modern, responsive UI

<p align="center">
  <img src="https://github.com/user-attachments/assets/479046e7-f565-4234-a38b-4cbe33c00b9d" alt="Foodky Search Results" width="80%">
</p>

## Tech Stack

| Layer       | Technology |
|-------------|------------|
| Backend     | Python + Flask |
| Frontend    | Vanilla JavaScript + CSS |
| Data        | JSON (100 food items) |
| Styling     | Pure CSS (dark theme) |

## Getting Started

### Prerequisites

- Python **3.8+**
- `pip` (Python package manager)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/esnnishanth/cse23132.git
cd cse23132

# 2. Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the app
python app.py
```

### Usage

Open **http://127.0.0.1:5000** in your browser.

- **Search** — type a food name (2+ characters) for autocomplete suggestions
- **Browse** — click a category card to explore foods in that category
- **View details** — click any food card or autocomplete result to open the detail modal
- **Popular tags** — click the randomly selected popular food tags for quick info

<p align="center">
  <img src="https://github.com/user-attachments/assets/58db9ae7-48b3-4fd3-afb4-93e93fa5f67a" alt="Foodky Detail Modal" width="80%">
</p>

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Renders the main page |
| GET | `/api/search?q=<query>` | Search foods by name (returns JSON) |
| GET | `/api/food/<id>` | Get details for a specific food (returns JSON) |
| GET | `/api/category/<category>` | Get all foods in a category (returns JSON) |
| GET | `/api/categories` | List all categories (returns JSON) |

## Project Structure

```
foodky/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── data/
│   └── foods.json         # Food database (100 items)
├── static/
│   ├── css/
│   │   └── style.css      # Stylesheet
│   └── js/
│       └── main.js        # Frontend JavaScript
└── templates/
    └── index.html         # Main page template
```

## License

MIT
