import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import About from './pages/about';

// Reservoir Pages
import LakePowell from './pages/reservoirs/lakePowell';
import LakeMead from './pages/reservoirs/lakeMead';
import LakeMohave from './pages/reservoirs/lakeMohave';
import LakeHavasu from './pages/reservoirs/lakeHavasu';

// Basin Pages
import UpperGreen from './pages/basins/upperGreen';
import LowerGreen from './pages/basins/lowerGreen';
import WhiteYampa from './pages/basins/whiteYampa';
import ColoradoHeadwaters from './pages/basins/coloradoHeadwaters';
import Dolores from './pages/basins/dolores';
import Gunnison from './pages/basins/gunnison';
import DirtyDevil from './pages/basins/dirtyDevil';
import LowerSanJuan from './pages/basins/lowerSanJuan';
import UpperSanJuan from './pages/basins/upperSanJuan';

interface RouteType {
    path: string;
    element: JSX.Element;
};

const routes: RouteType[] = [
    { path: '/', element: <Home /> },
    { path: '/about', element: <About /> },
    { path: '/reservoirs/lakepowell', element: <LakePowell /> },
    { path: '/reservoirs/lakemead', element: <LakeMead /> },
    { path: '/reservoirs/lakemohave', element: <LakeMohave /> },
    { path: '/reservoirs/lakehavasu', element: <LakeHavasu /> },
    { path: '/basins/uppergreen', element: <UpperGreen /> },
    { path: '/basins/lowergreen', element: <LowerGreen /> },
    { path: '/basins/whiteyampa', element: <WhiteYampa /> },
    { path: '/basins/coloradoheadwaters', element: <ColoradoHeadwaters /> },
    { path: '/basins/upperdolores', element: <Dolores /> },
    { path: '/basins/gunnison', element: <Gunnison /> },
    { path: '/basins/dirtydevil', element: <DirtyDevil /> },
    { path: '/basins/lowersanjuan', element: <LowerSanJuan /> },
    { path: '/basins/uppersanjuan', element: <UpperSanJuan /> },
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
