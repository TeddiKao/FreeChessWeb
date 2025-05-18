import { ceil } from "lodash";

function getTotalPages(numItems: number, itemsPerPage: number) {
    if (numItems === 0) {
        return 1;
    }

    return ceil(numItems / itemsPerPage);
}

export { getTotalPages }