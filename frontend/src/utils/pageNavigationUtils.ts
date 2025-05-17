import { ceil } from "lodash";

function getTotalPages(numItems: number, itemsPerPage: number) {
    return ceil(numItems / itemsPerPage);
}

export { getTotalPages }