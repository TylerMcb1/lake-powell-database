import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import LakePowell from './pages/reservoirs/lakePowell';
import UpperGreen from './pages/basins/upperGreen';

interface RouteType {
    path: string;
    element: JSX.Element;
};

const routes: RouteType[] = [
    { path: '/', element: <Home /> },
    { path: '/reservoirs/lakepowell', element: <LakePowell />},
    { path: '/basins/uppergreen', element: <UpperGreen />}
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
