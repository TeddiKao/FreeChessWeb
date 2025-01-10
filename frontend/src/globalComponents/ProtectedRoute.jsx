import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

import useIsAuthenticated from "../hooks/useIsAuthenticated.jsx"

import { jwtDecode } from "jwt-decode"

import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import api from "../api.js"

function ProtectedRoute({ children }) {
	const isAuthenticated = useIsAuthenticated();

	if (isAuthenticated === null) {
		return <div>Loading ...</div>
	}

	return (
		isAuthenticated ? children : <Navigate to={"/login"}/>
	)
}

export default ProtectedRoute