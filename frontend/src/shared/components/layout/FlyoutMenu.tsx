import { ReactNode } from "react";
import "../../styles/layout/flyout-menu.scss";

interface FlyoutMenuProps {
    children: ReactNode;
    gap?: number;
}

function FlyoutMenu({ children, gap }: FlyoutMenuProps) {
    const flyoutMenuStyles = {
        top: `50%`,
        left: `calc(100% + ${gap ?? 0}px)`,
    }
    
    return (
        <div style={flyoutMenuStyles} className="flyout-menu-container">
            {children}
        </div>
    );

}

export default FlyoutMenu;