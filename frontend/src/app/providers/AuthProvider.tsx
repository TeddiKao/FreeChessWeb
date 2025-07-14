import { BaseWrapperProps } from "@/shared/types/wrapper.types";
import { createContext } from "react";
import useAccessToken from "@features/auth/hooks/useAccessToken";
import useRefreshToken from "@features/auth/hooks/useRefreshToken";

interface AuthProviderProps extends BaseWrapperProps {}

interface AuthProviderContextType {
    access: {
        accessToken: string | null;
        updateAccessToken: (accessToken: string) => void;
        removeAccessToken: () => void;
    },
    refresh: {
        refreshToken: string | null;
        updateRefreshToken: (refreshToken: string) => void;
        removeRefreshToken: () => void;
    }
}

const AuthProviderContext = createContext<AuthProviderContextType | undefined>(undefined);

function AuthProvider({ children }: AuthProviderProps) {
    const { accessToken, updateAccessToken, removeAccessToken } = useAccessToken();
    const { refreshToken, updateRefreshToken, removeRefreshToken } = useRefreshToken();

    return (
        <AuthProviderContext.Provider value={{
            access: {
                accessToken,
                updateAccessToken,
                removeAccessToken,
            },
            refresh: {
                refreshToken,
                updateRefreshToken,
                removeRefreshToken,
            },
        }}>
            {children}
        </AuthProviderContext.Provider>
    );   
}

export default AuthProvider;
export { AuthProviderContext }