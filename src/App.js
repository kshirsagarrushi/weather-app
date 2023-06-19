import { useState ,useEffect} from 'react'
import React from 'react'
import axios from 'axios'

// Constants for caching and throttling
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const REQUEST_LIMIT = 60; // Maximum requests per minute

function App() {

  const [data, setData] = useState({})
  const [location, setLocation] = useState('')
  const [error, setError] = useState(null)
  const [lastRequestTime, setLastRequestTime] = useState(null);
  const [requestCount, setRequestCount] = useState(0);

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=4d5bf164f0550d0fd3c314a5847d9ec3&units=metric`

  const fetchData = async () => {
  try {
    // Check if enough time has passed since the last request
    const currentTime = Date.now();
    if (lastRequestTime && currentTime - lastRequestTime < (60 * 1000) / REQUEST_LIMIT) {
      setError('API rate limit exceeded. Please try again later.');
      return;
    }

    // Check if data is available in cache
    const cachedData = localStorage.getItem(url);
    if (cachedData) {
      setData(JSON.parse(cachedData));
      return;
    }

    // Make API request and update cache
    const response = await axios.get(url);
    setData(response.data);
    localStorage.setItem(url, JSON.stringify(response.data));

    // Update last request time and request count
    setLastRequestTime(currentTime);
    setRequestCount(requestCount + 1);
  } catch (error) {
    setError('Weather data not found. Please try again.');
  }
};

useEffect(() => {
  if (requestCount > REQUEST_LIMIT) {
    setError('API rate limit exceeded. Please try again later.');
  }
}, [requestCount]);

const searchLocation = (event) => {
  if (event.key === 'Enter') {
    fetchData();
  }
};

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyDown={searchLocation}
          placeholder='Enter Location or PIN Code'
          type='text'
        />
      </div>

      <div className="bold error">
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1 className='bold'>{data.main.temp.toFixed()}°C</h1> : null}
            {data.weather ? (
              <h1>
                <img
                  src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`}
                  alt="weather icon"
                  height="110px"
                />
              </h1>
            ) : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
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
            {data.main ? <p className="bold">{data.wind.speed}MPH</p> : null}
            <p>Wind Speed</p>
          </div>
        </div>
      </div>
    </div>
  );

}
export default App;
