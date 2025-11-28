// src/App.js
import React, { useEffect, useState } from "react";
import "./App.css";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

// Decide background theme based on weather type
function getWeatherClass(main) {
  if (!main) return "bg-default";
  const key = main.toLowerCase();

  if (key.includes("clear")) return "bg-clear";
  if (key.includes("cloud")) return "bg-clouds";
  if (key.includes("rain") || key.includes("drizzle"))
    return "bg-rain";
  if (key.includes("thunder")) return "bg-storm";
  if (key.includes("snow")) return "bg-snow";
  return "bg-default";
}

function App() {
  const [city, setCity] = useState("Delhi");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found ❌");
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather("Delhi");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) fetchWeather(city.trim());
  };

  const weatherMain = weather?.weather?.[0]?.main || "";
  const backgroundClass = getWeatherClass(weatherMain);

  return (
    <div className={`background ${backgroundClass}`}>
      {/* subtle animated blobs behind everything */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="glass-card">
        {/* Top strip */}
        <div className="top-bar">
          <span className="logo">SkyCast</span>
          <span className="tag">React × OpenWeather</span>
        </div>

        {/* Heading */}
        <h1 className="title">Weather Dashboard</h1>
        <p className="subtitle">
          Get instant weather for any city in the world 🌍
        </p>

        {/* Search */}
        <form className="search-box" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search city (e.g. Mumbai, London)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {loading && <p className="loading">Fetching weather...</p>}
        {error && <p className="error">{error}</p>}

        {/* Main weather content */}
        {weather && !loading && !error && (
          <div className="weather-section">
            <h2 className="city-name">
              {weather.name}, {weather.sys.country}
            </h2>

            <div className="hero-row">
              <div className="icon-wrap">
                <img
                  className="weather-icon"
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                  alt="Weather Icon"
                />
              </div>

              <div className="temp-block">
                <h1 className="temperature">
                  {Math.round(weather.main.temp)}°C
                </h1>
                <p className="description">
                  {weather.weather[0].description.toUpperCase()}
                </p>
                <span className="weather-pill">
                  {weatherMain || "CURRENT"}
                </span>
              </div>
            </div>

            {/* Detail cards */}
            <div className="details">
              <div className="detail-card">
                <span className="detail-label">Feels like</span>
                <span className="detail-value">
                  🌡 {Math.round(weather.main.feels_like)}°C
                </span>
              </div>
              <div className="detail-card">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">
                  💧 {weather.main.humidity}%
                </span>
              </div>
              <div className="detail-card">
                <span className="detail-label">Wind</span>
                <span className="detail-value">
                  💨 {weather.wind.speed} m/s
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="footer">
          <span>Made with ❤️ by Koushal</span>
          <span className="footer-dot">•</span>
          <span>MCA React API Project</span>
        </div>
      </div>
    </div>
  );
}

export default App;
