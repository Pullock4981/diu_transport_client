import React from 'react';
import LeafletMap from '../../Components/LeafMap';

const FindLocation = () => {
    return (
        <div>
            <h1 className='text-center text-3xl my-10'>
                Find your transport location here
            </h1>
            <div className=''>
                <LeafletMap></LeafletMap>
            </div>
            
        </div>
    );
};

export default FindLocation;