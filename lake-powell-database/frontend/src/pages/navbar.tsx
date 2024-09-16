import React from 'react';
import { Link } from 'react-router-dom';

interface NavigateType {
    name: string;
    path: string;
    // sublist: null;
};

// interface SubType {
//     name: string;
//     path: string;
// };

const pages: NavigateType[] = [
    {name: 'Home', path: '/'},
    {name: 'Reservoir Data', path: '/reservoirs/lakepowell'},
    {name: 'Basin Data', path: '/basins'},
    {name: 'About', path: '/about/'},
];

const Navbar: React.FC = () => {
    return (
        <nav>
            <ul>
                {pages.map((page, index) => (
                    <li key={index}>
                        <Link to={page.path}>{page.name}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;