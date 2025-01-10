import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom"

import GuestHomePage from "./pages/GuestHomePage.jsx"
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import NotFound from "./pages/NotFound.jsx"

import Dashboard from "./pages/Protected/Dashboard.jsx"
import Play from "./pages/Protected/Play.jsx"

import "./styles/global.css"

import ProtectedRoute from "./globalComponents/ProtectedRoute.jsx"
import AuthenticationRoute from "./globalComponents/AuthenticationRoute.jsx"

function Logout() {
	localStorage.clear()
	return <Navigate to="/login"/>
}

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<GuestHomePage/>}/>
					<Route path="/login" element={
						<AuthenticationRoute>
							<Login/>
						</AuthenticationRoute>
					}/>

					<Route path="/signup" element={
						<AuthenticationRoute>
							<Signup/>
						</AuthenticationRoute>
					}/>

					<Route path="/logout" element={<Logout/>}/>

					<Route path="/home" element={
						<ProtectedRoute>
							<Dashboard/>
						</ProtectedRoute>
					}/>

					<Route path="/play" element={
						<ProtectedRoute>
							<Play/>
						</ProtectedRoute>
					}/>

					<Route path="*" element={<NotFound/>}/>
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default App
