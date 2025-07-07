interface SubLinkProps {
    linkName: string;
    linkPath: string;
    linkIcon: string;
}

function SubLink({ linkIcon, linkPath, linkName }: SubLinkProps) {
    return (
        <div className="sub-link-container">
            <img className="link-icon" alt="link icon" src={linkIcon} />
            <a href={linkPath} className="link-name">{linkName}</a>
        </div>
    )
}

export default SubLink;