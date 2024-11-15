import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavigateType {
    name: string;
    path: string;
    submenu?: NavigateType[];
};

const pages: NavigateType[] = [
    { name: 'Home', path: '/' },
    { name: 'Reservoir Data', path: '', submenu: [
        { name: 'Lake Powell', path: '/reservoirs/lakepowell' },
        { name: 'Lake Mead', path: '/reservoirs/lakemead' },
        { name: 'Lake Mohave', path: '/reservoirs/lakemohave' },
        { name: 'Lake Havasu', path: '/reservoirs/lakehavasu' },
    ]},
    { name: 'Basin Data', path: '/basins', submenu: [
        { name: 'Overview', path: '/basins/overview' },
        { name: 'Upper Green', path: '/basins/uppergreen' },
        { name: 'Lower Green', path: '/basins/lowergreen' },
    ]},
    { name: 'About', path: '/about/' },
];

const Navbar: React.FC = () => {
    const [reservoirDataOpen, setReservoirDataOpen] = useState(false);
    const [basinDataOpen, setBasinDataOpen] = useState(false);

    const handleSubMenuChange = (option: string) => {
        if (option === 'Reservoir Data') {
            setBasinDataOpen(false);
            setReservoirDataOpen(!reservoirDataOpen);
        } else if (option === 'Basin Data') {
            setReservoirDataOpen(false);
            setBasinDataOpen(!basinDataOpen);
        }
    };

    return (
        <nav 
            className='flex relative z-20 items-center w-full h-16 bg-gradient-to-r 
            from-gray to-primary rounded-b-lg text-title font-sans shadow-xl px-6'
        >
            <label>Colorado River Data</label>
            <ul className='flex items-center space-x-10 ml-auto'>
                {pages.map((page, index) => (
                    <li key={index}>
                        {(page.name === 'Home' || page.name === 'About') ? (
                            <Link 
                                key={page.name}
                                to={page.path}
                                className='hover:text-dark_gray'
                            >
                                {page.name}
                            </Link>
                        ) : (
                            <>
                                <label
                                    className='hover:text-dark_gray relative cursor-pointer'
                                    onClick={() => handleSubMenuChange(page.name)}
                                >
                                    {page.name}
                                </label>
                                {((page.name === 'Reservoir Data' && reservoirDataOpen) || 
                                (page.name === 'Basin Data' && basinDataOpen)) && (
                                    <div
                                        className='absolute w-48 bg-gray rounded-lg
                                        text-subtitle shadow-xl space-y-3 p-5'
                                    >
                                        {page.submenu?.map((subpage, index) => (
                                            <div key={subpage.name} className='border-b-2 last:border-0'>
                                                <Link
                                                    to={subpage.path}
                                                    className={`pb-2 block hover:text-dark_gray ${(page.submenu && 
                                                    index === page.submenu?.length - 1) ? 'pb-0' : ''}`}
                                                >
                                                    {subpage.name}
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;