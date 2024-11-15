import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

// Arrow Icons
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface SlideshowImage {
    name: string;
    caption: string;
}

interface SlideshowProps {
    images: SlideshowImage[];
    interval?: number;
}

const Slideshow: React.FC<SlideshowProps> = ({ images, interval = 3000 }) => {
    return (
        <div className='relative rounded-lg overflow-hidden m-4'>
            <Slide 
                duration={interval}
                prevArrow={
                    <div className="absolute left-0 p-4 z-10">
                        <ArrowBackIosNewIcon 
                            className="text-white bg-gray-600 p-2 rounded-full" 
                            style={{ fontSize: '3rem' }}
                        />
                    </div>
                }
                nextArrow={
                    <div className="absolute right-0 p-4 z-10">
                        <ArrowForwardIosIcon 
                            className="text-white bg-gray-600 p-2 rounded-full" 
                            style={{ fontSize: '3rem' }}
                        />
                    </div>
                }
            >
                {images.map((image, index) => (
                    <div
                        key={index}
                        className='flex items-center justify-center h-[35em] md:h-[45em]'
                    >
                        <img src={image.name} alt={image.caption} className='w-full h-full object-cover'/>
                    </div>
                ))}
            </Slide>
        </div>
    );
};

export default Slideshow;