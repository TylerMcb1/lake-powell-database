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
        <nav 
            className='flex items-center w-full h-16 flex bg-gradient-to-r from-gray to-primary 
            rounded-b-lg text-title font-sans px-6'
        >
            <label>Colorado River Data</label>
            <ul className='flex items-center space-x-10 ml-auto'>
                {pages.map((page, index) => (
                    <li key={index}>
                        <Link 
                            to={page.path}
                            className='hover:text-dark_gray'
                        >
                            {page.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;