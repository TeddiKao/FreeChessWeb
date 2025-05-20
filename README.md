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

#### Frontend Setup ####
```bash
cd frontend
npm install
npm run dev
```

#### Backend Setup ####
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

### Backend ###
Use the provided `backend-env-example.env` file in the root of the repository for reference

> ⚠️ **Important**: Ensure that your actual `.env` file is placed in the `backend` directory, in the same directory as the `manage.py` file

Your `.env` file should be something like this

```env
SECRET_KEY = "your-secret-key-here"
DEBUG = True
DATABASE_URL = "your-database-url-here" # If using PostgreSQL
DATABASE_PASSWORD = "your-database-password-here" # If using PostgreSQL

# Additional configurations
```

To generate a secret key, run:
```python
from django.core.management.utils import get_random_secret_key

print(get_random_secret_key())
```

### Frontend ###
Use the provided `frontend-env-example.env` file in the root of this repository 

> ⚠️ **Important**: Ensure that your actual `.env` file is placed in the `frontend` directory, in the same directory as the `src` folder

Your `.env` file should look something like this:
```env
WEBSOCKET_BASE_URL = "your-websocket-base-url-here"
VITE_API_BASE_URL = "your-api-base-url-here"
```

#### To check your API base URL #### 

1. Start your backend server as explained above by navigating into the appropriate directory and running `py manage.py runserver` for Windows or `python3 manage.py runserver` for Linux/MacOS

2. You should see something like:
```
System check identified no issues (0 silenced).
May 20, 2025 - 14:47:54
Django version 5.2, using settings 'backend.settings'
Starting ASGI/Daphne version 4.1.2 development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

Copy the URL shown (e.g. `http://127.0.0.1:8000`) and use it as the value for your `VITE_API_BASE_URL`
> ⚠️ **Important**: Ensure that you exclude the trailing slash (`/`) in the `.env` file to avoid issues