import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";

import { DndProvider } from "react-dnd";
import { MultiBackend } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";

import GuestHomePage from "./pages/GuestHomePage.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import NotFound from "./pages/NotFound.tsx";

import Dashboard from "./pages/protected/Dashboard.tsx";
import GameSetup from "./pages/protected/GameSetup.tsx";

import "./styles/global/global.scss";

import ProtectedRoute from "./globalComponents/routes/ProtectedRoute.tsx";
import AuthenticationRoute from "./globalComponents/routes/AuthenticationRoute.tsx";
import Play from "./pages/protected/Play.tsx";
import PassAndPlay from "./pages/protected/PassAndPlay.tsx";

function Logout() {
    localStorage.clear();
    return <Navigate to="/login" />;
}

function App() {
    return (
        <>
            <BrowserRouter>
                <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                    <Routes>
                        <Route path="/" element={<GuestHomePage />} />
                        <Route
                            path="/login"
                            element={
                                <AuthenticationRoute>
                                    <Login />
                                </AuthenticationRoute>
                            }
                        />

                        <Route
                            path="/signup"
                            element={
                                <AuthenticationRoute>
                                    <Signup />
                                </AuthenticationRoute>
                            }
                        />

                        <Route path="/logout" element={<Logout />} />

                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/game-setup"
                            element={
                                <ProtectedRoute>
                                    <GameSetup />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/play"
                            element={
                                <ProtectedRoute>
                                    <Play />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/pass-and-play"
                            element={
                                <ProtectedRoute>
                                    <PassAndPlay />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </DndProvider>
            </BrowserRouter>
        </>
    );
}

export default App;
