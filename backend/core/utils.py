from django.db.models import Model, Field
from deepdiff import DeepDiff

def to_dict(model_instance: Model, exclude_fields: list[str] = None):
	exclude_fields = exclude_fields or []

	model_fields: list[Field] = model_instance._meta.fields
	model_data: dict = {}

	for field in model_fields:
		if field.name in exclude_fields:
			continue

		field_name = field.name
		field_value = getattr(model_instance, field_name)

		model_data[field_name] = field_value

	return model_data

def compare_dictionaries(dict1: dict, dict2: dict):
	print(DeepDiff(dict1, dict2))

	return len(DeepDiff(dict1, dict2)) == 0