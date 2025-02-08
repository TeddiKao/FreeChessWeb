import "../styles/navigation-dropdown.css"

function NavigationDropdown({ navigationLinks, isVisible }) {
	if (!isVisible) {
		return null;
    }

    function generateLinks() {
        return navigationLinks.map(({ linkName, linkPath }, linkIndex) => {
            return (
                <a
                    className="navigation-dropdown-link"
                    key={linkIndex}
                    href={linkPath}
                >
                    {linkName}
                </a>
            );
        });
    }

    return (
        <div className="navigation-dropdown-container">{generateLinks()}</div>
    );
}
