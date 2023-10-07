import React from 'react'
import jwtFetch from '../../store/jwt'
const Landing = () => {
    let today = new Date().toLocaleDateString()
const generateImage = async() => {
    const response = await jwtFetch("https://api.nasa.gov/planetary/apod")

}


  return (
    <>
    <div>
        {today} 
        <img ></img>>
        Today's Image
    </div>

    </>
  )
}

export default Landing