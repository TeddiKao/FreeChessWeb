import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import { DndProvider } from "react-dnd";
import { MultiBackend } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";

import "@appStyles/global.scss";
import Login from "@auth/pages/Login";
import Signup from "@auth/pages/Signup";
import GameHistory from "@gameHistory/pages/GameHistory";
import PlayBot from "@gameplay/bot/pages/PlayBot";
import SelectBot from "@gameplay/bot/pages/SelectBot";
import Play from "@gameplay/multiplayer/pages/Play";
import PassAndPlay from "@gameplay/passAndPlay/pages/PassAndPlay";
import ViewGame from "@gameReplay/pages/ViewGame";
import GameSetup from "@gameSetup/pages/GameSetup";
import HomePage from "@pages/public/Home/HomePage";
import NotFoundPage from "@pages/public/NotFound/NotFoundPage";
import Dashboard from "@pages/protected/Dashboard/DashboardPage";
import TempRoute from "@pages/helpers/TempRoute";
import ChallengeWebsocketProvider from "@appProviders/ChallengeWebsocketProvider";
import AuthenticationRoute from "@appRouting/AuthenticationRoute";
import ProtectedRoute from "@appRouting/ProtectedRoute";
import useAccessToken from "@/features/auth/hooks/useAccessToken";
import useRefreshToken from "@/features/auth/hooks/useRefreshToken";

interface LogoutRouteProps {
	removeAccessToken: () => void;
	removeRefreshToken: () => void;
}

function Logout({ removeAccessToken, removeRefreshToken }: LogoutRouteProps) {
	removeAccessToken();
	removeRefreshToken();
	
	return <Navigate to="/login" />;
}

function App() {
	const { removeAccessToken } = useAccessToken();
	const { removeRefreshToken } = useRefreshToken();

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

							<Route path="/logout" element={<Logout removeAccessToken={removeAccessToken} removeRefreshToken={removeRefreshToken} />} />

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
