import { StateSetterFunction } from "../../../types/general";
import "../../../styles/features/gameHistory/page-navigation.scss";

type PageNavigationProps = {
    setPage: StateSetterFunction<number>;
    currentPage: number;
    totalPages: number;
}

function PageNavigation({ setPage, currentPage, totalPages }: PageNavigationProps) {
    function nextPage() {
        setPage((prevPage) => prevPage < totalPages ? prevPage ++ : prevPage);
    }


    function previousPage() {
        setPage((prevPage) => prevPage > 1 ? prevPage -- : prevPage)
    }
    
    return (
        <div className="page-navigation-container">
            <p className="page-indicator">{currentPage}/{totalPages}</p>
        </div>
    )
}

export default PageNavigation;