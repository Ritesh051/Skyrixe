import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const isLogged = true;
    return isLogged ? <Outlet/> : <Navigate to="/" />;
}

export default PrivateRoute