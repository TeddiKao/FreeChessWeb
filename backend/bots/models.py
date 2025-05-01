from django.contrib.auth import get_user_model
from django.db import models

from gameplay.utils.fen_parser import get_default_position_list, get_starting_position_structured_fen, get_starting_structured_board_placement, get_starting_structured_castling_rights

from core.constants import EMPTY_LIST, EMPTY_DICT

class BotGame(models.Model):
    human_player = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    bot = models.CharField(max_length=150, null=False, blank=False)
    white_player = models.CharField(max_length=5, null=False, blank=False) # Human or bot
    black_player = models.CharField(max_length=5, null=False, blank=False) # Human or bot

    structured_board_placement = models.JSONField(null=False, blank=False, default=get_starting_structured_board_placement)
    structured_castling_rights = models.JSONField(null=False, blank=False, default=get_starting_structured_castling_rights)
    en_passant_target_square = models.IntegerField(null=True, blank=True)
    current_move_number = models.IntegerField(null=False, blank=False, default=1)
    current_player_turn = models.CharField(max_length=5, null=False, blank=False, default="white")
    halfmove_clock = models.IntegerField(null=False, blank=False, default=0)

    game_winner = models.CharField(max_length=5, null=True, blank=True) # Human or bot
    game_ended = models.BooleanField(null=False, blank=False, default=False)
    game_ended_cause = models.CharField(max_length=50, null=True, blank=True)

    white_player_clock = models.DecimalField(max_digits=7, decimal_places=1, null=True, blank=True)
    black_player_clock = models.DecimalField(max_digits=7, decimal_places=1, null=True, blank=True)
    white_player_increment = models.IntegerField(null=False, blank=False, default=0)
    black_player_increment = models.IntegerField(null=False, blank=False, default=0)

    position_list = models.JSONField(null=False, blank=False, default=get_default_position_list)
    move_list = models.JSONField(null=False, blank=False, default=EMPTY_LIST)

    captured_white_material = models.JSONField(null=False, blank=False, default=EMPTY_DICT)
    captured_black_material = models.JSONField(null=False, blank=False, default=EMPTY_DICT)

    def get_player_color(self):
        if self.white_player == "human":
            return "White"
        else:
            return "Black"

    def get_full_structured_fen(self):
        return {
            "board_placement": self.structured_board_placement,
            "castling_rights": self.structured_castling_rights,
            "en_passant_target_square": self.en_passant_target_square,
            "halfmove_clock": self.halfmove_clock,
            "fullmove_number": self.current_move_number
        }
    
    def update_full_structured_fen(self, new_structured_fen):
        self.structured_board_placement = new_structured_fen["board_placement"]
        self.structured_castling_rights = new_structured_fen["castling_rights"]
        self.en_passant_target_square = new_structured_fen["en_passant_target_square"]
        self.halfmove_clock = new_structured_fen["halfmove_clock"]
        self.current_move_number = new_structured_fen["fullmove_number"]

        self.save()

    def update_position_list(self, new_position_list):
        self.position_list = new_position_list

        self.save()

    def update_move_list(self, new_move_list):
        self.move_list = new_move_list

        self.save()