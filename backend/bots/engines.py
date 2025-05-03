from stockfish import Stockfish

import os

def initialise_stockfish_instance() -> Stockfish:
    return Stockfish(path=os.environ.get("STOCKFISH_PATH"))