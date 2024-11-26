import React from 'react';

// Element Import
import Navbar from './elements/navbar';
import Textbox from './elements/textbox';

const About: React.FC = () => {
    return (
        <div>
            <Navbar />
            <Textbox>
                This website was created using publically available data on the 
                <a className='text-primary' href='https://www.usbr.gov/ColoradoRiverBasin/'> US Bureau of Reclamation Website</a>.
                <br /><br />

                Lake Powell Water Data was accessed from the 
                <a className='text-primary' href='https://www.usbr.gov/rsvrWater/HistoricalApp.html'> Upper Colorado River Basin Historical Historic Data Portal</a>.
                <br /><br />

                Lake Mead, Lake Mohave, and Lake Havasu Water data was accessed from the
                <a className='text-primary' href='https://www.usbr.gov/lc/region/g4000/riverops/webreports/accumweb.json'> Lower Colorado River Basin Web Report API</a>.
                <br /><br />

                Colorado River Basin Regional Data was obtained from the 
                <a className='text-primary' href='https://wcc.sc.egov.usda.gov/reportGenerator/'> USDA Air & Water Database Report Generator</a>.
                <br /><br />

                Weather Information and Sunrise/sunset times for each reservoir was accessed from the
                <a className='text-primary' href='https://www.weather.gov/documentation/services-web-api'> National Weather Serivce API </a>
                and the <a className='text-primary' href='https://sunrise-sunset.org/api'> Sunset-sunrise.org Sunset and Sunrise Times API</a>.
            </Textbox>
            <Textbox>
                Disclaimer and Usage Policy: The data presented on this website is sourced publicly from available government resources, including but not limited
                to the United States Bureau of Reclamation (USBR), which contains information generally in the public domain. While the original data is publicly available,
                the organization and presentation of data on this website, including any derived content, is the intellectual property of ColoradoRiverData.com. 
                <br /><br />
                
                Restrictions on Usage: The information and content contained on this website are for informational and non-commerical purposes only. 
                Unauthorized commerical usage of the information contained on this website and any content derived from it without prior written consent is strictly prohibited.
            </Textbox>
        </div>
    );
}

export default About;