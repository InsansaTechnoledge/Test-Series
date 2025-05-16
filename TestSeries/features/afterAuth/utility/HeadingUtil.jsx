import React from 'react'

const HeadingUtil = ({heading , description}) => {
  return (
    <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold bg-blue-900 bg-clip-text text-transparent">
        {heading}
        </h1>
        {
            description  ?
            <p className="text-gray-600 mt-3">{description}</p>
            :
            ""
        }
  </div>
  )
}

export default HeadingUtil
