import React, { useState, useEffect } from 'react';

const Weather = () => {
  // State variables for managing city, weather data, loading, and error
  const [city, setCity] = useState(''); // City name entered by user
  const [weatherData, setWeatherData] = useState(null); // Weather data from API
  const [loading, setLoading] = useState(false); // Loading state while fetching
  const [error, setError] = useState(''); // Error message if API fails
  const [searchCity, setSearchCity] = useState(''); // City to search for

  // API key - Replace with your own OpenWeatherMap API key
  const API_KEY = 'YOUR_API_KEY_HERE';

  // Function to fetch weather data
  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) return; // Don't fetch if city is empty

    setLoading(true); // Set loading to true
    setError(''); // Clear previous errors
    setWeatherData(null); // Clear previous data

    try {
      // Construct API URL
      const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('City not found or API error');
      }

      const data = await response.json();
      setWeatherData(data); // Set weather data
      setCity(cityName); // Update city state
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data'); // Set error message
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    fetchWeather(searchCity); // Fetch weather for entered city
  };

  // useEffect to fetch default weather on component mount (optional)
  useEffect(() => {
    // You can set a default city here, e.g., fetchWeather('London');
  }, []);

  return (
    <div className="weather-app">
      <h1>Weather App</h1>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Enter city name"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {/* Loading Indicator */}
      {loading && <div className="loading">Loading...</div>}

      {/* Error Message */}
      {error && <div className="error">{error}</div>}

      {/* Weather Display */}
      {weatherData && (
        <div className="weather-card">
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          <div className="weather-main">
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
              className="weather-icon"
            />
            <div className="temperature">
              <span className="temp">{Math.round(weatherData.main.temp)}°C</span>
              <span className="condition">{weatherData.weather[0].description}</span>
            </div>
          </div>
          <div className="weather-details">
            <div className="detail">
              <span className="label">Humidity:</span>
              <span className="value">{weatherData.main.humidity}%</span>
            </div>
            <div className="detail">
              <span className="label">Wind Speed:</span>
              <span className="value">{weatherData.wind.speed} m/s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;