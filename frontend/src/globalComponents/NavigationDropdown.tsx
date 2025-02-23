import "../styles/navigation-dropdown.css";

type NavigationLink = {
    linkName: string;
    linkPath: string;
};

type NavigationDropdownProps = {
    navigationLinks: Array<NavigationLink>;
    isVisible: boolean;
    dropdownRef: any;
};

function NavigationDropdown({
    navigationLinks,
    isVisible,
    dropdownRef,
}: NavigationDropdownProps) {
    if (!isVisible) {
        return;
    }

    function generateLinks() {
        return navigationLinks.map(
            ({ linkName, linkPath }: NavigationLink, linkIndex: number) => {
                return (
                    <a
                        className="navigation-dropdown-link"
                        key={linkIndex}
                        href={linkPath}
                    >
                        {linkName}
                    </a>
                );
            }
        );
    }

    return (
        <div ref={dropdownRef} className="navigation-dropdown-container">
            {generateLinks()}
        </div>
    );
}

export default NavigationDropdown;
