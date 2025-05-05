from django.db.models import Model, Field, ForeignKey
from django.contrib.auth import get_user_model

from deepdiff import DeepDiff

import random

def is_user_related_foreign_key(field: Field):
	is_foreign_key = isinstance(field, ForeignKey)

	try:
		is_user_related = field.remote_field.model == get_user_model()
	except AttributeError:
		is_user_related = False

	return is_foreign_key and is_user_related

def serialize_excluding_fields(model_instance: Model, exclude_fields: list[str] = None):
	exclude_fields = exclude_fields or []

	model_fields: list[Field] = model_instance._meta.fields
	model_data: dict = {}

	for field in model_fields:
		if field.name in exclude_fields:
			continue

		field_name = field.name
		if is_user_related_foreign_key(field):
			field_value = getattr(model_instance, field_name).username
		else:
			field_value = getattr(model_instance, field_name)

		model_data[field_name] = field_value

	return model_data

def serialize_including_fields(model_instance: Model, include_fields: list[str]):
	model_fields: list[Field] = model_instance._meta.fields
	model_data = {}

	for field in model_fields:
		if field.name not in include_fields:
			continue

		field_name = field.name
		if is_user_related_foreign_key(field):
			print(field_name)
		
			if getattr(model_instance, field_name):
				field_value = getattr(model_instance, field_name).username
			else:
				field_value = None
		else:
			field_value = getattr(model_instance, field_name)

		model_data[field_name] = field_value

	return model_data


def serialize_models_excluding_fields(model_list: list[Model], exclude_fields: list[str] = None):
	serialized_model_list = []	
	
	for model in model_list:
		serialized_model = serialize_excluding_fields(model, exclude_fields)
		serialized_model_list.append(serialized_model)

	return serialized_model_list

def serialize_models_including_fields(model_list: list[Model], include_fields: list[str]):
	serialized_model_list = []	
	
	for model in model_list:
		serialized_model = serialize_including_fields(model, include_fields)
		serialized_model_list.append(serialized_model)

	return serialized_model_list

def compare_dictionaries(dict1: dict, dict2: dict):
	return len(DeepDiff(dict1, dict2)) == 0

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