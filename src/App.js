import { useState } from 'react'
import React from 'react'
import axios from 'axios'

function App() {

  const [data,setData]=useState({})
  const[location,setLocation]=useState('')

const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=4d5bf164f0550d0fd3c314a5847d9ec3&units=metric`

const searchLocation=(event)=>{

  if(event.key==='Enter'){
    axios.get(url).then((Response) => {
      setData(Response.data)
      console.log(Response.data)
    })
    setLocation('')
  }
  
}

  return (
    <div className="app">
    <div className="search">
      <input value={location}
      onChange={event =>setLocation(event.target.value)}
      onKeyDown={searchLocation}
      placeholder='Enter location' type='text'>
      </input>

    </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1 className='bold'>{data.main.temp.toFixed()}°C</h1> : null}

            {data.weather ? <h1>{<img src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`}
            alt="weather icon" height="110px" />}</h1> : null}
            
          </div>
          <div className="description">
          {data.weather ?<p>{data.weather[0].main}</p> : null}
          </div>
        </div>
      
        <div className="bottom">
          <div className="feels">
            {data.main ? <p className="bold">{data.main.feels_like.toFixed()}°C</p> : null}
            <p>Feels Like</p>
    
          </div>
          <div className="humidity">
            {data.main ? <p className="bold">{data.main.humidity}</p> : null}
            <p>Humidity</p>

          </div>
          <div className="wind">
            {data.main ? <p className="bold">{data.wind.speed}MPH</p>: null}
            <p>Wind Speed</p>
          </div>
        </div>  
      </div> 
      
    </div>
  );

}
export default App;

