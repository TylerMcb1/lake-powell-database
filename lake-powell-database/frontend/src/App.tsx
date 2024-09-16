import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LakePowell from './pages/reservoirs/lakePowell';
import Navbar from './pages/navbar';

interface RouteType {
    path: string;
    element: JSX.Element;
};

const routes: RouteType[] = [
    { path: '/', element: <Navbar /> },
    { path: '/reservoirs/lakepowell', element: <LakePowell />},
    // Include error 404 page
];

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {routes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}
            </Routes>
        </Router>
    );
};

export default App;
