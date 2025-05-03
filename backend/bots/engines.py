from stockfish import Stockfish
from django.conf import settings

def initialise_stockfish_instance() -> Stockfish:
    return Stockfish(path=settings.STOCKFISH_PATH)