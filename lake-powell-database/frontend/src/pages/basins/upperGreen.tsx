import React, { useState, useEffect } from 'react';

// Element Import
import Navbar from '../elements/navbar';
import BasinCurrent from '../elements/basinCurrent';

// Fetch Strings
const TABLEFETCHSTRING = 'http://localhost:5050/upper-green/last-14-days';

const UpperGreen = () => {
    return (
        <div>
            <Navbar />
            <div className='m-4 grid grid-cols-1 gap-4 lg:grid-cols-2 md:mx-2 md:px-2'>
                <BasinCurrent 
                    fetchString={TABLEFETCHSTRING}
                    name='Upper Green Basin'
                />
            </div>
        </div>
    );
};

export default UpperGreen;