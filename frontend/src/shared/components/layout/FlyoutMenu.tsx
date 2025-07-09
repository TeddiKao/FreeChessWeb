import { ReactNode } from "react";

interface FlyoutMenuProps {
    children: ReactNode;
}

function FlyoutMenu({ children }: FlyoutMenuProps) {
    return (
        <div className="flyout-menu-container">
            {children}
        </div>
    );

}

export default FlyoutMenu;