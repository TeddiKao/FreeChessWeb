import "../../../../../styles/DashboardNavbar/links/main-link.scss";

interface MainLinkProps {
    linkName: string;
    linkPath?: string;
    linkIcon: string;
    subLinks?: Array<{ name: string; path: string; icon: string }>;
}

function MainLink({ linkName, linkPath, linkIcon, subLinks }: MainLinkProps) {
    return (
        <div className="main-link-container">
            <img className="main-link-icon" alt="Link icon" src={linkIcon} />
        </div>
    );
}

export default MainLink;
