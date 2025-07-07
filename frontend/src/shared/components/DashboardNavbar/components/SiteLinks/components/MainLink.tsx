interface MainLinkProps {
    linkName: string;
    linkPath: string;
    linkIcon: string;
    subLinks?: Array<{ name: string; path: string; icon: string }>;
}

function MainLink({ linkName, linkPath, linkIcon, subLinks }: MainLinkProps) {
    return (
        <div className="main-link-container">
        
        </div>
    );
}

