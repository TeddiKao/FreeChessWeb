import "@sharedStyles/layout/flyout-menu.scss";
import { BaseWrapperProps } from "@/shared/types/wrapper.types";

interface FlyoutMenuProps extends BaseWrapperProps {
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