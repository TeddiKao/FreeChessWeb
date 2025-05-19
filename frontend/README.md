# FreeChess #

A simple, completely free chess application with multiplayer and game history functionality

**Access the website [here](https://free-chess.vercel.app)**

## Features ##

- Pass and play 
- Multiplayer 
- Game history viewing and game replaying
- Bot playing (against Stockfish)
- Basic settings configuration (auto-queening and showing legal moves)

## Getting started ##

### Prerequisites ###

- **Node.js** >= 18
- **Python** >= 3.10
- **SQLite** for development

### Local development setup ###

**Step 1:** Fork and clone the repository and cd to project directory
```bash
git clone "https://github.com/TeddiKao/FreeChessWeb.git"
cd FreeChessWeb
```

**Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

**Backend Setup**
1. Activate virtual environment and install dependencies
```bash
py -m venv env
```

On Windows:
```bash
env\Scripts\activate
```

On Linux/MacOS:
```bash
source env/bin/activate
```

2. Navigate to project directory  
```bash
cd backend
```

3. Install dependencies:  
**IMPORTANT: Ensure that you are in the "backend" directory**
```bash
pip install -r requirements.txt
```

4. Run the server:  
On Windows
```bash
py manage.py runserver
```

On Linux/MacOS
```bash
python3 manage.py runserver
```

When testing, ensure that the server is running

## Environment Variables ##
This project requires environment variables to run properly

Use the provided env.example file in the repository for reference

Your .env file should be something like this

```env
SECRET_KEY = "your-secret-key-here"
DEBUG = True
DATABASE_URL = "your-database-url-here" # If using PostgreSQL
DATABASE_PASSWORD = "your-database-password-here" # If using PostgreSQL
```

To generate a secret key, run:
```python
from django.core.management.utils import get_random_secret_key

print(get_random_secret_key())
```