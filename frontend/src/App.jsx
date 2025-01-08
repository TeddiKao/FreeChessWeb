import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom"

import GuestHomePage from "./pages/GuestHomePage.jsx"
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"

import "./styles/global.css"
import NotFound from "./pages/NotFound.jsx"
import ProtectedRoute from "./globalComponents/ProtectedRoute.jsx"

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<GuestHomePage/>}/>
					<Route path="/login" element={<Login/>}/>
					<Route path="/signup" element={<Signup/>}/>

					<ProtectedRoute>
						<Route path="/home"/>
					</ProtectedRoute>

					<Route path="*" element={<NotFound/>}/>
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default App
