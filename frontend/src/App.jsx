import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import GuestHomePage from "./pages/GuestHomePage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import NotFound from "./pages/NotFound.jsx";

import Dashboard from "./pages/Protected/Dashboard.jsx";
import GameSetup from "./pages/Protected/GameSetup.jsx";

import "./styles/global.css";

import ProtectedRoute from "./globalComponents/routes/ProtectedRoute.jsx";
import AuthenticationRoute from "./globalComponents/routes/AuthenticationRoute.jsx";
import Play from "./pages/Protected/Play.jsx";

function Logout() {
    localStorage.clear();
    return <Navigate to="/login" />;
}

function App() {
    return (
        <>
            <BrowserRouter>
                <DndProvider backend={HTML5Backend}>
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
                            path="/select-time-control"
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

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </DndProvider>
            </BrowserRouter>
        </>
    );
}

export default App;
