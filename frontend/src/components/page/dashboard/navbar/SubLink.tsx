import { useNavigate } from "react-router-dom";
import "../../../../styles/components/dashboard/navbar/sub-link.scss";

type SubLinkProps = {
    name: string,
    path: string,
    icon: string
}

function SubLink({ name, path, icon }: SubLinkProps) {
    const navigate = useNavigate();
    function handleSubLinkNavigation() {
        navigate(path);
    }

    return (
        <div onClick={handleSubLinkNavigation} className="dashboard-navbar-sublink-container">
            <img className="dashboard-navbar-sublink-icon" src={icon} />
            <p className="dashboard-navbar-sublink-name">{name}</p>
        </div>
    )
}

export default SubLink;