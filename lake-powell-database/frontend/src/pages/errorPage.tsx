import React from 'react';

// Element Import
import Navbar from './elements/navbar';
import Textbox from './elements/textbox';

const ErrorPage = () => {
    return (
        <div>
            <Navbar />
            <Textbox>
                <p className='text-title'>Error 404: Page Not Found</p>
                <br />
                Click <a className='text-primary' href='/'> here </a> to return home.
            </Textbox>
        </div>
    );
}

export default ErrorPage