import random

def decide_bot_game_color():
	if random.choice([True, False]):
		return {
			"white": "human",
			"black": "bot",
		}
	else:
		return {
			"white": "bot",
			"black": "human",
		}