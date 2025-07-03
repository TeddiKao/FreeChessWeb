import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import { DndProvider } from "react-dnd";
import { MultiBackend } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";

import "./styles/global/global.scss";

import ProtectedRoute from "./features/auth/components/routes/ProtectedRoute.tsx";
import AuthenticationRoute from "./features/auth/components/routes/AuthenticationRoute.tsx";
import Play from "./features/gameplay/multiplayer/pages/Play.tsx";
import PassAndPlay from "./features/gameplay/passAndPlay/pages/PassAndPlay.tsx";
import TempRoute from "./pages/TempRoute.tsx";
import SelectBot from "./features/gameplay/bot/pages/SelectBot.tsx";
import PlayBot from "./features/gameplay/bot/pages/PlayBot.tsx";
import ViewGame from "./features/gameReplay/pages/ViewGame.tsx";
import ChallengeWebsocketProvider from "./features/challenge/ChallengeWebsocketProvider.tsx";
import Login from "./features/auth/pages/Login.tsx";
import GuestHomePage from "./pages/GuestHomePage/GuestHomePage.tsx";
import Signup from "./features/auth/pages/Signup.tsx";
import Dashboard from "./pages/protected/Dashboard/Dashboard.tsx";
import GameSetup from "./features/gameSetup/pages/GameSetup.tsx";
import NotFound from "./pages/NotFound.tsx";
import GameHistory from "./features/gameHistory/pages/GameHistory.tsx";

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

							<Route path="*" element={<NotFound />} />
						</Routes>
					</DndProvider>
				</ChallengeWebsocketProvider>
			</BrowserRouter>
		</>
	);
}

export default App;
