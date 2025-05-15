import React from 'react'
import heroBanner from '../../../../assests/StudentLanding/heroBanner.jpg';

const StudentHero = () => {
  return (
    <div className='relative bg-black/60'>
        <img src={heroBanner} 
        className='-z-10 absolute w-full h-full'
        />
        <div className='px-20'>
            <h1 className='pt-20 pb-40 text-white text-5xl font-bold'>
                Organization Name
            </h1>
        </div>
    </div>
  )
}

export default StudentHero