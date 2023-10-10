import React from 'react'
import jwtFetch from '../../store/jwt'
import { useEffect,useState } from 'react'
import './landing.css'
const fetchData = async () => {
    try{
        const response = await jwtFetch('/api/image',{
            headers: {
                "Content-Type": "application/json"
            }
        })
        const res = await response.json()
        return res
    }
    catch(error){
        console.error('Error fetching data',error);
    }
} 

const Landing = () => {
    const [data,setData] = useState(null);
    let today = new Date().toLocaleDateString()
    useEffect(() => {
        fetchData()
            .then(result => {
                setData(result)
            })
            .catch(error => {
                console.error("error")
            })
    },[])
  return (
    <>
    <div className='landing-container'>
        {today}  Today's Image
        {data ? 
        <div className='image-container'> 

        <img className='space-image' src={data.url} alt="astronomy photo"></img> 
            <div className='explanation'>
            {data.explanation}    
            </div>
        </div>
        
        : <> </>}
    </div>

    </>
  )
}

export default Landing