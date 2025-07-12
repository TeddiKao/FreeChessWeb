import "@sharedStyles/DashboardNavbar/links/sub-link.scss";

interface SubLinkProps {
    linkName: string;
    linkPath: string;
    linkIcon: string;
}

function SubLink({ linkIcon, linkPath, linkName }: SubLinkProps) {
    return (
        <div className="sub-link-container">
            <img className="sub-link-icon" alt="link icon" src={linkIcon} />
            <a href={linkPath} className="sub-link-name">{linkName}</a>
        </div>
    )
}

export default SubLink;