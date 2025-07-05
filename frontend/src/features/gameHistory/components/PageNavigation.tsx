import { StateSetterFunction } from "../../../shared/types/utility.types";
import "../styles/page-navigation.scss";

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
		setPage((prevPage) =>
			prevPage < totalPages ? prevPage + 1 : prevPage
		);
	}

	function previousPage() {
		setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
	}

	function isPrevPageButtonVisible() {
		return currentPage > 1;
	}

	function isNextPageButtonVisible() {
		return currentPage < totalPages;
	}

	function getPrevPageButtonIsHiddenClass() {
		return !isPrevPageButtonVisible() ? "hidden" : "";
	}

	function getNextPageButtonIsHiddenClass() {
		return !isNextPageButtonVisible() ? "hidden" : "";
	}

	return (
		<div className="page-navigation-container">
			<div
				role="button"
				onClick={previousPage}
				className={`prev-page-button-container ${getPrevPageButtonIsHiddenClass()}`}
			>
				<img
					src="/icons/pageNavigation/left-arrow.svg"
					className="prev-page-icon"
					alt="Icon for navigating to previous page"
				/>
			</div>

			<p className="page-indicator">
				{currentPage}/{totalPages}
			</p>

			<div
				role="button"
				onClick={nextPage}
				className={`next-page-button-container ${getNextPageButtonIsHiddenClass()}`}
			>
				<img
					src="/icons/pageNavigation/right-arrow.svg"
					className="next-page-icon"
					alt="Icon for navigating to next page"
				/>
			</div>
		</div>
	);
}

export default PageNavigation;
