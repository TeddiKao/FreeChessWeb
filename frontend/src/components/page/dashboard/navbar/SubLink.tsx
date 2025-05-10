type SubLinkProps = {
    name: string,
    path: string,
    icon: string
}

function SubLink({ name, path, icon }: SubLinkProps) {
    return (
        <div className="dashboard-navbar-sublink-container">
            <img className="dashboard-navbar-sublink-icon" src={icon} />
            <a href={path} className="dashboard-navbar-sublink-name">{name}</a>
        </div>
    )
}

export default SubLink;