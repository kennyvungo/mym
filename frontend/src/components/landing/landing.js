import React from 'react'
import jwtFetch from '../../store/jwt'
import { useEffect,useState } from 'react'
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
    const handleClick = async(e) =>{
        e.preventDefault();
        fetchData()
    }
  return (
    <>
    <div>
        {today} 
        Today's Image
        {data ? <img src={data.url}></img> : <> </>
    }
    </div>

    </>
  )
}

export default Landing