import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";

import { DndProvider } from "react-dnd";
import { MultiBackend } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";

import GuestHomePage from "./pages/GuestHomePage.js";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import NotFound from "./pages/NotFound.js";

import Dashboard from "./pages/Protected/Dashboard.js";
import GameSetup from "./pages/Protected/GameSetup.js";

import "./styles/global/global.scss";

import ProtectedRoute from "./globalComponents/routes/ProtectedRoute.js";
import AuthenticationRoute from "./globalComponents/routes/AuthenticationRoute.js";
import Play from "./pages/Protected/Play.js";
import PassAndPlay from "./pages/Protected/PassAndPlay.js";

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
