import { StateSetterFunction } from "../../../types/general";
import "../../../styles/features/gameHistory/page-navigation.scss";

type PageNavigationProps = {
	setPage: StateSetterFunction<number>;
	currentPage: number;
	totalPages: number;
};

function PageNavigation({
	setPage,
	currentPage,
	totalPages,
}: PageNavigationProps) {
	function nextPage() {
		setPage((prevPage) => (prevPage < totalPages ? prevPage++ : prevPage));
	}

	function previousPage() {
		setPage((prevPage) => (prevPage > 1 ? prevPage-- : prevPage));
	}

	function isPrevPageButtonVisible() {
		return currentPage > 1;
	}

	function isNextPageButtonVisible() {
		return currentPage < totalPages;
	}

	function getPrePageButtonIsHiddenClass() {
		return !isPrevPageButtonVisible() ? "hidden" : "";
	}

	function getNextPageButtonIsHiddenClass() {
		return !isNextPageButtonVisible() ? "hidden" : "";
	}

	return (
		<div className="page-navigation-container">
			<div
				role="button"
				className={`prev-page-button-container ${getPrePageButtonIsHiddenClass()}`}
			>
				<img
					src="/left-arrow.svg"
					className="prev-page-icon"
					alt="Icon for navigating to previous page"
				/>
			</div>
            
			<p className="page-indicator">
				{currentPage}/{totalPages}
			</p>

			<div
				role="button"
				className={`next-page-button-container ${getNextPageButtonIsHiddenClass()}`}
			>
				<img
					src="/right-arrow.svg"
					className="next-page-icon"
					alt="Icon for navigating to next page"
				/>
			</div>
		</div>
	);
}

export default PageNavigation;
