def get_starting_index(current_page: int, items_per_page: int):
    if current_page == 1:
        return 1
    else:
        return (current_page - 1) * items_per_page

def get_ending_index(current_page, items_per_page, num_items: int):
    remaining_items = num_items % items_per_page

    return (((current_page - 1) * items_per_page) + remaining_items) - 1

def get_index_display_range(current_page: int, items_per_page: int, num_items: int):
    starting_index = get_starting_index(current_page, items_per_page)
    ending_index = get_ending_index(current_page, items_per_page, num_items)

    return (starting_index, ending_index)    