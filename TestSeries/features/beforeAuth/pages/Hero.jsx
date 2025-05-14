import React from 'react'
import shield from '../../../assests/Landing/Hero/Group23.svg';
import pen from '../../../assests/Landing/Hero/Pen.svg';
import trophy from '../../../assests/Landing/Hero/trophy.svg';
import man from '../../../assests/Landing/Hero/man.svg';
import planeButton from '../../../assests/Landing/Hero/planeButton.svg';
import planeLeft from '../../../assests/Landing/Hero/planeLeft.svg';
import planeRight from '../../../assests/Landing/Hero/planeRight.svg';

const chips = [
  {
    icon: shield,
    text: "Registered students 1000+"
  },
  {
    icon: pen,
    text: "Registered students 1000+"
  },
  {
    icon: trophy,
    text: "Registered students 1000+"
  },
  {
    icon: man,
    text: "Registered students 1000+"
  },
]

const Hero = () => {
  return (
    <div className='mt-34 relative mx-50'>
      <img 
      className='absolute left-0 top-0 w-2/12'
      src={planeLeft} alt='plane_left' />
      <img 
      className='absolute right-0 top-5/12 w-1/12'
      src={planeRight} alt='plane_right' />
      <h1 className='
      pt-10
      text-5xl font-bold
      text-center
      pb-5
      mx-40
      text-clip bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-purple-600 to-blue-800'>
        One Destination for Complete Exam Preparation
      </h1>
      <h2 className='
      text-blue-900 text-xl text-center
      font-semibold mt-14'>
        Get exam-ready with concepts, questions and study notes as per the latest pattern
      </h2>
      <div className='grid grid-cols-4 gap-8 mt-14 mx-32'>
        {
          chips.map((chip, idx) => (
            <div className='border-blue-900 border-2 rounded-xl py-4 px-4 flex justify-center' key={idx}>
              <img src={chip.icon} alt={chip.text}/>
              <span className='my-auto pl-5 text-blue-900 font-semibold'>{chip.text}</span>
            </div>
          ))
        }
      </div>
      <div className='w-full flex'>
        <button
        className='relative z-20 hover:cursor-pointer bg-indigo-800 rounded-full text-white py-4 px-10 mt-20 mx-auto'>
          <div className='flex'>
            <span className='pr-5 font-semibold text-xl '>
            Get Started For Free
            </span>
            <img src={planeButton} alt="send_btn"
            />
          </div>
        </button>
      </div>
    </div>
  )
}

export default Hero