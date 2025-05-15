import json
import hashlib

def create_dict_hash(dict_to_hash: dict) -> str:
    str_dict = json.dumps(dict_to_hash, sort_keys=True)

    return hashlib.sha256(str_dict.encode()).hexdigest()

def are_dictionaries_equal(*dicts: dict) -> bool:
    if not dicts:
        return True

    target_dict = dicts[0]
    hashed_target_dict = create_dict_hash(target_dict)

    for dictionary in dicts[1:]:
        dict_hash = create_dict_hash(dictionary)

        if dict_hash != hashed_target_dict:
            return False

    return True