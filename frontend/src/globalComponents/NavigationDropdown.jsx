import "../styles/navigation-dropdown.css"

function NavigationDropdown({ navigationLinks, isVisible, dropdownRef }) {
    if (!isVisible) {
        return;
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
        <div ref={dropdownRef} className="navigation-dropdown-container">{generateLinks()}</div>
    );
}

export default NavigationDropdown;