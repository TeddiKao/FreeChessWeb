import { ReactNode } from "react";

interface FlyoutMenuProps {
    children: ReactNode;
}

function FlyoutMenu({ children }: FlyoutMenuProps) {
    return (
        <div className="flyout-menu">
            {children}
        </div>
    );

}

export default FlyoutMenu;