import json
import time
import random

from asyncio import create_task, sleep

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from .models import WaitingPlayer
from gameplay.models import ChessGame

from urllib.parse import parse_qs


class MatchmakingConsumer(AsyncWebsocketConsumer):
    async def decide_player_color(self):
        if random.choice([True, False]):
            return "white", "black"
        else:
            return "black", "white"

    @database_sync_to_async
    def remove_player_from_queue(self, player_object):
        player_object.delete()

    @database_sync_to_async
    def get_player_in_queue(self, player):
        try:
            player_in_queue = WaitingPlayer.objects.get(user=player)
        except WaitingPlayer.DoesNotExist:
            player_in_queue = None

        return player_in_queue

    @database_sync_to_async
    def create_waiting_player(self, user_model):
        WaitingPlayer.objects.create(
            user=user_model, base_time=self.base_time, increment_time=self.increment)

    @database_sync_to_async
    def set_matched_player(self, player_to_set, matched_player):
        player_to_set.matched_user = matched_player
        player_to_set.save()

    @database_sync_to_async
    def is_player_matched(self, player_to_check):
        return getattr(player_to_check, "matched_user")

    @database_sync_to_async
    def get_first_matching_player(self):
        same_time_control_users = WaitingPlayer.objects.filter(
            base_time=self.base_time, increment_time=self.increment)

        return same_time_control_users.exclude(user=self.scope["user"]).first()

    @database_sync_to_async
    def get_matched_user(self, user_to_check):
        try:
            return WaitingPlayer.objects.get(matched_user=user_to_check)
        except WaitingPlayer.DoesNotExist:
            return None

    @database_sync_to_async
    def get_user_model_from_waiting_player(self, waiting_player: WaitingPlayer):
        return waiting_player.user

    @database_sync_to_async
    def get_waiting_player_model_from_user(self, user_model):
        waiting_player_model = WaitingPlayer.objects.get(user=user_model)

        return waiting_player_model

    @database_sync_to_async
    def create_chess_game(self, white_player, black_player):
        chess_game = ChessGame.objects.create(
            white_player=white_player,
            black_player=black_player,
            white_player_clock=self.base_time,
            black_player_clock=self.base_time,
            white_player_increment=self.increment,
            black_player_increment=self.increment
        )

        chess_game.save()

        return chess_game.id

    async def match_player(self):
        player_to_match = self.scope["user"]
        match_found = False
        was_added_to_queue = False

        while not match_found:
            player_in_queue: WaitingPlayer | None = await self.get_player_in_queue(player_to_match)
            matched_user: WaitingPlayer | None = await self.get_matched_user(player_to_match)

            if player_in_queue:
                if await player_in_queue.has_player_been_matched():
                    assigned_game_id = player_in_queue.assigned_game_id
                    assigned_color = player_in_queue.assigned_color

                    player_in_queue_user_model = await self.get_user_model_from_waiting_player(player_in_queue)
                    player_match = await self.get_matched_user(player_in_queue_user_model)
                    player_match_user_model = await self.get_user_model_from_waiting_player(player_match)

                    white_player = player_in_queue_user_model if assigned_color and assigned_color.lower() == "white" else player_match_user_model
                    black_player = player_in_queue_user_model if assigned_color and assigned_color.lower() == "black" else player_match_user_model

                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "player_matched",
                            "match_found": True,
                            "white_player": white_player.username,
                            "black_player": black_player.username,
                            "game_id": assigned_game_id,
                        }
                    )

                    await self.remove_player_from_queue(player_in_queue)

                    break

            if matched_user:
                if await matched_user.has_player_been_matched():
                    matched_player_user_model = await self.get_user_model_from_waiting_player(matched_user)
                    matched_player_user_id = matched_player_user_model.id

                    player_match = await self.get_matched_user(matched_player_user_model)
                    player_match_user_model = await self.get_user_model_from_waiting_player(player_match)

                    assigned_game_id = matched_user.assigned_game_id
                    assigned_color = matched_user.assigned_color

                    white_player = matched_player_user_model if assigned_color and assigned_color.lower() == "white" else player_match_user_model
                    black_player = matched_player_user_model if assigned_color and assigned_color.lower() == "black" else player_match_user_model

                    await self.channel_layer.group_send(
                        f"user_{matched_player_user_id}",
                        {
                            "type": "player_matched",
                            "match_found": True,
                            "white_player": white_player.username,
                            "black_player": black_player.username,
                            "game_id": assigned_game_id,
                        }
                    )

                    await self.remove_player_from_queue(matched_user)

                    break

            if not matched_user and not player_in_queue and was_added_to_queue:
                break

            player_in_queue_matched = None

            if player_in_queue:
                player_in_queue_matched = await player_in_queue.has_player_been_matched()

            matched_player_matched = None

            if matched_user:
                matched_player_matched = await matched_user.has_player_been_matched()

            if matched_user and not player_in_queue_matched and not matched_player_matched:
                matched_player_color, player_to_match_color = await self.decide_player_color()

                matched_player_user_model = await self.get_user_model_from_waiting_player(matched_user)

                white_player = matched_player_user_model if matched_player_color == "white" else player_to_match
                black_player = matched_player_user_model if matched_player_color == "black" else player_to_match

                game_id = await self.create_chess_game(white_player, black_player)
                
                await player_in_queue.update_has_player_been_matched(True)
                await matched_user.update_has_player_been_matched(True)

                await player_in_queue.update_player_assigned_color(player_to_match_color)
                await matched_user.update_player_assigned_color(matched_player_color)

                await player_in_queue.update_player_assigned_game_id(game_id)
                await matched_user.update_player_assigned_game_id(game_id)

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "player_matched",
                        "match_found": True,
                        "white_player": white_player.username,
                        "black_player": black_player.username,
                        "game_id": game_id,
                    }
                )

                await self.channel_layer.group_send(
                    f"user_{matched_player_user_model.id}",
                    {
                        "type": "player_matched",
                        "match_found": True,
                        "white_player": white_player.username,
                        "black_player": black_player.username,
                        "game_id": game_id,
                    }
                )

                await self.remove_player_from_queue(matched_user)
                
                if player_in_queue:
                    await self.remove_player_from_queue(player_in_queue)

                await self.channel_layer.group_discard(
                    f"user_{matched_player_user_model.id}",
                    self.channel_name
                )

                match_found = True
                

                break

            if not player_in_queue:
                matched_player: WaitingPlayer | None = await self.get_first_matching_player()

                await self.create_waiting_player(player_to_match)
                was_added_to_queue = True

                if matched_player:
                    
                    waiting_player_to_match: WaitingPlayer = await self.get_player_in_queue(player_to_match)

                    await self.set_matched_player(matched_player, player_to_match)
                    await self.set_matched_player(waiting_player_to_match, await self.get_user_model_from_waiting_player(matched_player))

                else:
                    await self.send(json.dumps({
                        "type": "finding_match",
                        "match_found": False,
                        "white_player": None,
                        "black_player": None
                    }))
            else:
                await self.send(json.dumps({
                    "type": "finding_match",
                    "match_found": False,
                    "white_player": None,
                    "black_player": None
                }))

            
            await sleep(0.5)

        

    async def connect(self):
        user = self.scope["user"]

        query_string: bytes = self.scope.get("query_string", b"")
        decoded_query_string: str = query_string.decode()
        parsed_query_string = parse_qs(decoded_query_string)

        base_time = parsed_query_string["baseTime"][0]
        increment = parsed_query_string["increment"][0]

        self.base_time = int(base_time)
        self.increment = int(increment)
        self.match_player_task = create_task(self.match_player())

        

        self.room_group_name = f"user_{user.id}"
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        

        await self.send(json.dumps({
            "type": "connection_established",
            "message": "Connection established",
        }))

    async def disconnect(self, code):
        try:
            wating_player_model = await self.get_waiting_player_model_from_user(self.scope["user"])
        except WaitingPlayer.DoesNotExist:
            pass
        else:
            await self.remove_player_from_queue(wating_player_model)

        if self.match_player_task:
            self.match_player_task.cancel()
            
            

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):

        parsed_data = json.loads(text_data)

        if parsed_data["type"] == "cancel_matchmaking":
            try:
                waiting_player_model = await self.get_waiting_player_model_from_user(self.scope["user"])
            except WaitingPlayer.DoesNotExist:
                pass
            else:
                await self.remove_player_from_queue(waiting_player_model)

            self.match_player_task.cancel()
            self.match_player_task = None

            await self.send(json.dumps({
                "type": "matchmaking_cancelled_successfully",
                "message": "Matchmaking cancelled successfully"
            }))

            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

            await self.close()

    async def player_matched(self, event):
        await self.send(json.dumps({
            "type": "match_found",
            "match_found": event["match_found"],
            "white_player": event["white_player"],
            "black_player": event["black_player"],
            "game_id": event["game_id"]
        }))

        
