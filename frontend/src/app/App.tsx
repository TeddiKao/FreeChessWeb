import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import { DndProvider } from "react-dnd";
import { MultiBackend } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";

import "./styles/global.scss";
import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";
import GameHistory from "../features/gameHistory/pages/GameHistory";
import PlayBot from "../features/gameplay/bot/pages/PlayBot";
import SelectBot from "../features/gameplay/bot/pages/SelectBot";
import Play from "../features/gameplay/multiplayer/pages/Play";
import PassAndPlay from "../features/gameplay/passAndPlay/pages/PassAndPlay";
import ViewGame from "../features/gameReplay/pages/ViewGame";
import GameSetup from "../features/gameSetup/pages/GameSetup";
import HomePage from "../pages/public/Home/HomePage";
import NotFoundPage from "../pages/public/NotFound/NotFoundPage";
import Dashboard from "../pages/protected/Dashboard/DashboardPage";
import TempRoute from "../pages/TempRoute";
import ChallengeWebsocketProvider from "./providers/ChallengeWebsocketProvider";
import AuthenticationRoute from "./routing/AuthenticationRoute";
import ProtectedRoute from "./routing/ProtectedRoute";

function Logout() {
	localStorage.clear();
	return <Navigate to="/login" />;
}

function App() {
	useEffect(() => {
		document.title = "FreeChess";
	}, []);

	return (
		<>
			<BrowserRouter>
				<ChallengeWebsocketProvider>
					<DndProvider backend={MultiBackend} options={HTML5toTouch}>
						<Routes>
							<Route path="/" element={<HomePage />} />
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

							<Route
								path="/select-bot"
								element={
									<ProtectedRoute>
										<SelectBot />
									</ProtectedRoute>
								}
							/>

							<Route
								path="/play-bot"
								element={
									<ProtectedRoute>
										<PlayBot />
									</ProtectedRoute>
								}
							/>

							<Route
								path="/game-history"
								element={
									<ProtectedRoute>
										<GameHistory />
									</ProtectedRoute>
								}
							/>

							<Route
								path="/:gameId/view"
								element={
									<ProtectedRoute>
										<ViewGame />
									</ProtectedRoute>
								}
							/>

							<Route path="/temp" element={<TempRoute />} />

							<Route path="*" element={<NotFoundPage />} />
						</Routes>
					</DndProvider>
				</ChallengeWebsocketProvider>
			</BrowserRouter>
		</>
	);
}

export default App;
