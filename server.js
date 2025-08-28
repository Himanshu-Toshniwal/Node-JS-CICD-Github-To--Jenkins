// server.js - Complete Node.js Weather App
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// API Routes
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🌤 Advanced Weather App</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                background: linear-gradient(135deg, #0f0c29 0%, #302b63 35%, #24243e 100%); 
                min-height: 100vh; 
                color: white;
                padding: 20px;
                animation: gradientShift 12s ease infinite;
            }
            
            @keyframes gradientShift {
                0% { background: linear-gradient(135deg, #0f0c29 0%, #302b63 35%, #24243e 100%); }
                25% { background: linear-gradient(135deg, #141e30 0%, #243b55 35%, #0f3460 100%); }
                50% { background: linear-gradient(135deg, #2c3e50 0%, #34495e 35%, #2c3e50 100%); }
                75% { background: linear-gradient(135deg, #232526 0%, #414345 35%, #232526 100%); }
                100% { background: linear-gradient(135deg, #0f0c29 0%, #302b63 35%, #24243e 100%); }
            }
            
            @keyframes sunnyShift {
                0% { background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 50%, #fd79a8 100%); }
                25% { background: linear-gradient(135deg, #fdcb6e 0%, #e17055 50%, #ff7675 100%); }
                50% { background: linear-gradient(135deg, #f39c12 0%, #e74c3c 50%, #e91e63 100%); }
                75% { background: linear-gradient(135deg, #f1c40f 0%, #e67e22 50%, #e74c3c 100%); }
                100% { background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 50%, #fd79a8 100%); }
            }
            
            @keyframes cloudyShift {
                0% { background: linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #00cec9 100%); }
                25% { background: linear-gradient(135deg, #81ecec 0%, #74b9ff 50%, #a29bfe 100%); }
                50% { background: linear-gradient(135deg, #00b894 0%, #00cec9 50%, #74b9ff 100%); }
                75% { background: linear-gradient(135deg, #55a3ff 0%, #003d82 50%, #74b9ff 100%); }
                100% { background: linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #00cec9 100%); }
            }
            
            @keyframes rainyShift {
                0% { background: linear-gradient(135deg, #636e72 0%, #2d3436 50%, #74b9ff 100%); }
                25% { background: linear-gradient(135deg, #2d3436 0%, #636e72 50%, #0984e3 100%); }
                50% { background: linear-gradient(135deg, #74b9ff 0%, #2d3436 50%, #636e72 100%); }
                75% { background: linear-gradient(135deg, #0984e3 0%, #74b9ff 50%, #2d3436 100%); }
                100% { background: linear-gradient(135deg, #636e72 0%, #2d3436 50%, #74b9ff 100%); }
            }
            
            @keyframes snowyShift {
                0% { background: linear-gradient(135deg, #ddd6fe 0%, #8b5cf6 50%, #a29bfe 100%); }
                25% { background: linear-gradient(135deg, #e17055 0%, #fd79a8 50%, #ddd6fe 100%); }
                50% { background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 50%, #fd79a8 100%); }
                75% { background: linear-gradient(135deg, #fd79a8 0%, #a29bfe 50%, #8b5cf6 100%); }
                100% { background: linear-gradient(135deg, #ddd6fe 0%, #8b5cf6 50%, #a29bfe 100%); }
            }
            
            .sunny { animation: sunnyShift 6s ease-in-out infinite; }
            .cloudy { animation: cloudyShift 7s ease-in-out infinite; }
            .rainy { animation: rainyShift 5s ease-in-out infinite; }
            .snowy { animation: snowyShift 8s ease-in-out infinite; }
            .clear { animation: cloudyShift 7s ease-in-out infinite; }
            .thunderstorm { animation: rainyShift 4s ease-in-out infinite; }
            .mist { animation: cloudyShift 9s ease-in-out infinite; }
            
            .container { max-width: 1200px; margin: 0 auto; }
            
            .header { text-align: center; margin-bottom: 40px; }
            .header h1 { 
                font-size: 3rem; 
                margin-bottom: 10px; 
                text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.52); 
                background: linear-gradient(45deg, #00d4ff, #090979, #00d4ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: textShine 3s ease-in-out infinite alternate;
            }
            
            @keyframes textShine {
                0% { background: linear-gradient(45deg, #00d4ff, #090979, #00d4ff); }
                100% { background: linear-gradient(45deg, #ff006e, #8338ec, #3a86ff); }
            }
            
            .search-section { 
                background: linear-gradient(145deg, rgba(0,212,255,0.15), rgba(9,9,121,0.1)); 
                padding: 30px; 
                border-radius: 25px; 
                backdrop-filter: blur(20px); 
                margin-bottom: 30px;
                text-align: center;
                border: 1px solid rgba(0,212,255,0.3);
                box-shadow: 0 8px 32px rgba(0,212,255,0.2);
            }
            
            .search-input { 
                width: 60%; 
                padding: 15px 20px; 
                border: 2px solid rgba(255,255,255,0.3); 
                border-radius: 30px; 
                font-size: 1.1rem; 
                margin-right: 10px;
                outline: none;
                background: rgba(255,255,255,0.9);
                color: #333;
                transition: all 0.3s ease;
            }
            
            .search-input:focus {
                border-color: #00d4ff;
                box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
                transform: translateY(-2px);
            }
            
            .search-btn, .location-btn { 
                padding: 15px 25px; 
                background: linear-gradient(45deg, #00d4ff, #090979); 
                color: white; 
                border: none; 
                border-radius: 30px; 
                font-size: 1.1rem; 
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
                margin: 5px;
            }
            
            .search-btn:hover, .location-btn:hover { 
                background: linear-gradient(45deg, #ff006e, #8338ec); 
                transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(255, 0, 110, 0.6);
            }
            
            .filter-section {
                margin-top: 20px;
                text-align: center;
            }
            
            .filter-btn {
                padding: 8px 15px;
                background: linear-gradient(45deg, rgba(0,212,255,0.2), rgba(9,9,121,0.1));
                color: white;
                border: 1px solid rgba(0,212,255,0.3);
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                margin: 5px;
            }
            
            .filter-btn:hover, .filter-btn.active {
                background: linear-gradient(45deg, #00d4ff, #090979);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,212,255,0.4);
            }
            
            .cards-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 30px;
                margin-top: 30px;
            }
            
            .weather-card { 
                background: linear-gradient(145deg, rgba(0,212,255,0.15), rgba(9,9,121,0.1)); 
                padding: 40px; 
                border-radius: 25px; 
                backdrop-filter: blur(25px); 
                text-align: center;
                border: 1px solid rgba(0,212,255,0.3);
                box-shadow: 0 8px 32px rgba(0,212,255,0.2);
                animation: slideUp 0.6s ease;
                transition: all 0.3s ease;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            
            .weather-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s;
            }
            
            .weather-card:hover::before {
                left: 100%;
            }
            
            .weather-card:hover {
                transform: translateY(-10px) scale(1.02);
                box-shadow: 0 20px 50px rgba(0,212,255,0.4);
            }
            
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .card-title {
                font-size: 1.3rem;
                font-weight: bold;
                margin-bottom: 20px;
                color: #00d4ff;
            }
            
            .weather-icon { font-size: 5rem; margin-bottom: 20px; }
            
            .temperature { 
                font-size: 4rem; 
                font-weight: bold; 
                margin-bottom: 10px; 
                background: linear-gradient(45deg, #00d4ff, #ffffff, #00d4ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-shadow: 0 2px 10px rgba(0,212,255,0.5);
                animation: tempGlow 2s ease-in-out infinite alternate;
            }
            
            @keyframes tempGlow {
                0% { filter: drop-shadow(0 0 10px rgba(0,212,255,0.5)); }
                100% { filter: drop-shadow(0 0 20px rgba(255,0,110,0.7)); }
            }
            
            .description { font-size: 1.5rem; margin-bottom: 30px; text-transform: capitalize; }
            
            .location-info {
                background: linear-gradient(145deg, rgba(0,212,255,0.1), rgba(9,9,121,0.05));
                padding: 15px;
                border-radius: 15px;
                margin-bottom: 20px;
                border: 1px solid rgba(0,212,255,0.2);
                backdrop-filter: blur(10px);
            }
            
            .weather-details { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
                gap: 15px; 
                margin-top: 30px;
            }
            
            .detail-item { 
                background: linear-gradient(145deg, rgba(0,212,255,0.15), rgba(9,9,121,0.05)); 
                padding: 15px; 
                border-radius: 15px; 
                text-align: center;
                border: 1px solid rgba(0,212,255,0.2);
                backdrop-filter: blur(15px);
                transition: all 0.3s ease;
            }
            
            .detail-item:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 25px rgba(0,212,255,0.3);
                background: linear-gradient(145deg, rgba(255,0,110,0.2), rgba(131,56,236,0.1));
                border-color: rgba(255,0,110,0.4);
            }
            
            .detail-value { font-size: 1.3rem; font-weight: bold; margin-bottom: 5px; }
            .detail-label { font-size: 0.9rem; opacity: 0.8; }
            
            .loading { 
                text-align: center; 
                font-size: 1.2rem; 
                background: linear-gradient(145deg, rgba(0,212,255,0.2), rgba(9,9,121,0.1));
                padding: 20px;
                border-radius: 15px;
                border: 1px solid rgba(0,212,255,0.3);
                backdrop-filter: blur(15px);
            }
            
            .error { 
                text-align: center; 
                color: #ff006e; 
                font-size: 1.1rem; 
                background: linear-gradient(145deg, rgba(255,0,110,0.2), rgba(255,0,110,0.1));
                padding: 20px;
                border-radius: 15px;
                border: 1px solid rgba(255,0,110,0.4);
                backdrop-filter: blur(15px);
            }
            
            .forecast { margin-top: 30px; }
            .forecast-title { font-size: 1.5rem; margin-bottom: 20px; text-align: center; color: #00d4ff; }
            
            .forecast-items { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); 
                gap: 15px;
            }
            
            .forecast-item { 
                background: linear-gradient(145deg, rgba(0,212,255,0.15), rgba(9,9,121,0.05)); 
                padding: 15px; 
                border-radius: 15px; 
                text-align: center;
                border: 1px solid rgba(0,212,255,0.2);
                backdrop-filter: blur(15px);
                transition: all 0.3s ease;
            }
            
            .forecast-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(0,212,255,0.3);
                background: linear-gradient(145deg, rgba(255,0,110,0.2), rgba(131,56,236,0.1));
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌤 Advanced Weather App</h1>
                <p>Real-time Weather with Location Detection & Forecasts</p>
            </div>
            
            <div class="search-section">
                <input type="text" class="search-input" placeholder="Enter city name (e.g: Mumbai, Delhi, London)" id="cityInput">
                <button class="search-btn" onclick="getWeather()">🔍 Search Weather</button>
                <button class="location-btn" onclick="getCurrentLocation()">📍 My Location</button>
                
                <div class="filter-section">
                    <div style="margin-bottom: 15px; font-size: 1.1rem; color: #00d4ff;">🌡 Weather Filters</div>
                    <button class="filter-btn active" onclick="filterWeather('all')">🌍 All</button>
                    <button class="filter-btn" onclick="filterWeather('sunny')">☀ Sunny</button>
                    <button class="filter-btn" onclick="filterWeather('rainy')">🌧 Rainy</button>
                    <button class="filter-btn" onclick="filterWeather('cloudy')">☁ Cloudy</button>
                    <button class="filter-btn" onclick="filterWeather('clear')">🌤 Clear</button>
                </div>
            </div>
            
            <div class="loading" id="loading" style="display: none;">
                <p>⏳ Loading weather data...</p>
            </div>
            
            <div class="error" id="error" style="display: none;">
                <p>❌ Unable to fetch weather data. Please try again.</p>
            </div>
            
            <div class="cards-container" id="weatherCards">
                <!-- Weather cards will be populated here -->
            </div>
        </div>
        
        <script>
            let weatherData = null;
            
            function getWeatherIcon(weatherCode, isDay = true) {
                const icons = {
                    '01d': '☀', '01n': '🌙',
                    '02d': '⛅', '02n': '☁',
                    '03d': '☁', '03n': '☁',
                    '04d': '☁', '04n': '☁',
                    '09d': '🌧', '09n': '🌧',
                    '10d': '🌦', '10n': '🌧',
                    '11d': '⛈', '11n': '⛈',
                    '13d': '❄', '13n': '❄',
                    '50d': '🌫', '50n': '🌫'
                };
                return icons[weatherCode] || getWeatherIconByCondition(weatherCode);
            }
            
            function getWeatherIconByCondition(condition) {
                const icons = {
                    'clear': '☀',
                    'clouds': '☁',
                    'rain': '🌧',
                    'drizzle': '🌦',
                    'thunderstorm': '⛈',
                    'snow': '❄',
                    'mist': '🌫',
                    'fog': '🌫',
                    'haze': '🌫'
                };
                return icons[condition.toLowerCase()] || '🌤';
            }
            
            function formatTime(timestamp, timezone) {
                const date = new Date((timestamp + timezone) * 1000);
                return date.toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
            
            function updateBackgroundColor(condition) {
                const body = document.body;
                body.className = '';
                
                const conditions = {
                    'clear': 'sunny',
                    'clouds': 'cloudy',
                    'rain': 'rainy',
                    'drizzle': 'rainy',
                    'thunderstorm': 'rainy',
                    'snow': 'snowy',
                    'mist': 'cloudy',
                    'fog': 'cloudy',
                    'haze': 'cloudy'
                };
                
                body.classList.add(conditions[condition.toLowerCase()] || 'cloudy');
            }
            
            async function getWeather() {
                const city = document.getElementById('cityInput').value.trim();
                if (!city) {
                    alert('Please enter a city name');
                    return;
                }
                
                showLoading();
                
                try {
                    const response = await fetch(\`/api/weather?city=\${encodeURIComponent(city)}\`);
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to fetch weather data');
                    }
                    
                    weatherData = await response.json();
                    displayWeather(weatherData);
                    updateBackgroundColor(weatherData.current.weather[0].main);
                    
                } catch (error) {
                    showError();
                    console.error('Weather fetch error:', error);
                    alert(error.message);
                }
            }
            
            async function getCurrentLocation() {
                if (!navigator.geolocation) {
                    alert('Geolocation is not supported by this browser.');
                    return;
                }
                
                showLoading();
                
                const options = {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0
                };
                
                let bestPosition = null;
                let attempts = 0;
                const maxAttempts = 3;
                
                const getLocationAttempt = () => {
                    return new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                console.log(\`Location attempt \${attempts + 1}:\`, {
                                    lat: position.coords.latitude,
                                    lon: position.coords.longitude,
                                    accuracy: position.coords.accuracy
                                });
                                
                                if (!bestPosition || position.coords.accuracy < bestPosition.coords.accuracy) {
                                    bestPosition = position;
                                }
                                resolve(position);
                            },
                            (error) => reject(error),
                            options
                        );
                    });
                };
                
                try {
                    for (attempts = 0; attempts < maxAttempts; attempts++) {
                        try {
                            await getLocationAttempt();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        } catch (error) {
                            console.log(\`Location attempt \${attempts + 1} failed:\`, error);
                        }
                    }
                    
                    if (!bestPosition) {
                        throw new Error('Could not get location');
                    }
                    
                    const lat = bestPosition.coords.latitude;
                    const lon = bestPosition.coords.longitude;
                    const accuracy = bestPosition.coords.accuracy;
                    
                    console.log('Best location found:', { lat, lon, accuracy });
                    
                    alert(\`Your exact GPS coordinates:\\nLatitude: \${lat}\\nLongitude: \${lon}\\nAccuracy: ±\${Math.round(accuracy)}m\\n\\nChecking weather for nearest location...\`);
                    
                    try {
                        const response = await fetch(\`/api/weather?lat=\${lat}&lon=\${lon}\`);
                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.error || 'Failed to fetch weather data');
                        }
                        
                        weatherData = await response.json();
                        weatherData.locationAccuracy = accuracy;
                        weatherData.userLat = lat;
                        weatherData.userLon = lon;
                        
                        displayWeather(weatherData);
                        updateBackgroundColor(weatherData.current.weather[0].main);
                        
                    } catch (error) {
                        showError();
                        console.error('Weather fetch error:', error);
                        alert(error.message);
                    }
                } catch (error) {
                    showError();
                    console.error('Location error:', error);
                    let errorMsg = 'Unable to get your location. ';
                    if (error.code) {
                        switch(error.code) {
                            case 1:
                                errorMsg += 'Please allow location access and try again.';
                                break;
                            case 2:
                                errorMsg += 'Location information unavailable. Please try searching for your city instead.';
                                break;
                            case 3:
                                errorMsg += 'Location request timed out. Please try again.';
                                break;
                            default:
                                errorMsg += 'Please try searching for your city instead.';
                        }
                    } else {
                        errorMsg += 'Please try searching for your city instead.';
                    }
                    alert(errorMsg);
                }
            }
            
            function displayWeather(data) {
                const container = document.getElementById('weatherCards');
                container.innerHTML = '';
                
                // Current Weather Card
                const currentCard = createWeatherCard(data.current, data.uv, data.locationAccuracy);
                container.appendChild(currentCard);
                
                // Forecast Card
                if (data.forecast && data.forecast.list) {
                    const forecastCard = createForecastCard(data.forecast);
                    container.appendChild(forecastCard);
                }
                
                hideLoading();
            }
            
            function createWeatherCard(current, uvData, accuracy) {
                const card = document.createElement('div');
                card.className = 'weather-card';
                
                const currentTime = new Date().toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                card.innerHTML = \`
                    <div class="card-title">📍 Current Weather</div>
                    <div class="weather-icon">\${getWeatherIcon(current.weather[0].icon)}</div>
                    <div class="temperature">\${Math.round(current.main.temp)}°C</div>
                    <div class="description">\${current.weather[0].description}</div>
                    
                    <div class="location-info">
                        <div style="font-size: 1.3rem; margin-bottom: 10px;">📍 \${current.name}, \${current.sys.country}</div>
                        <div style="font-size: 1.1rem; opacity: 0.9; margin-bottom: 10px;">🕐 \${currentTime}</div>
                        <div style="font-size: 0.9rem; opacity: 0.7; margin-bottom: 5px;">📱 Your GPS: \${weatherData && weatherData.userLat ? weatherData.userLat.toFixed(6) : 'N/A'}, \${weatherData && weatherData.userLon ? weatherData.userLon.toFixed(6) : 'N/A'}</div>
                        <div style="font-size: 0.9rem; opacity: 0.7; margin-bottom: 5px;">🌡 Weather Station: \${current.coord.lat.toFixed(6)}, \${current.coord.lon.toFixed(6)}</div>
                        \${accuracy ? \`<div style="font-size: 0.8rem; opacity: 0.6;">📡 GPS Accuracy: ±\${Math.round(accuracy)}m</div>\` : ''}
                        <div style="font-size: 0.8rem; opacity: 0.6; margin-top: 5px;">🔄 Updated: \${new Date().toLocaleTimeString()}</div>
                        <div style="font-size: 0.8rem; opacity: 0.5; margin-top: 5px; font-style: italic;">Note: Weather data from nearest station (\${current.name})</div>
                    </div>
                    
                    <div class="weather-details">
                        <div class="detail-item">
                            <div class="detail-value">\${Math.round(current.main.feels_like)}°C</div>
                            <div class="detail-label">Feels Like</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-value">\${current.main.humidity}%</div>
                            <div class="detail-label">Humidity</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-value">\${Math.round(current.wind.speed * 3.6)} km/h</div>
                            <div class="detail-label">Wind Speed</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-value">\${current.main.pressure} hPa</div>
                            <div class="detail-label">Pressure</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-value">\${(current.visibility / 1000).toFixed(1)} km</div>
                            <div class="detail-label">Visibility</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-value">\${uvData ? uvData.toFixed(1) : 'N/A'}</div>
                            <div class="detail-label">UV Index</div>
                        </div>
                    </div>
                \`;
                
                return card;
            }
            
            function createForecastCard(forecastData) {
                const card = document.createElement('div');
                card.className = 'weather-card';
                
                let forecastHTML = '<div class="card-title">📅 5-Day Forecast</div><div class="forecast-items">';
                
                const dailyForecasts = {};
                forecastData.list.forEach(item => {
                    const date = new Date(item.dt * 1000).toDateString();
                    if (!dailyForecasts[date]) {
                        dailyForecasts[date] = item;
                    }
                });
                
                Object.values(dailyForecasts).slice(0, 5).forEach(item => {
                    forecastHTML += \`
                        <div class="forecast-item">
                            <div style="font-size: 2rem; margin-bottom: 10px;">\${getWeatherIcon(item.weather[0].icon)}</div>
                            <div style="font-weight: bold;">\${new Date(item.dt * 1000).toLocaleDateString('en-US', {weekday: 'short'})}</div>
                            <div style="margin: 5px 0;">\${Math.round(item.main.temp_max)}°/\${Math.round(item.main.temp_min)}°</div>
                            <div style="font-size: 0.9rem; opacity: 0.8;">\${item.weather[0].description}</div>
                        </div>
                    \`;
                });
                
                forecastHTML += '</div>';
                card.innerHTML = forecastHTML;
                
                return card;
            }
            
            function filterWeather(type) {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                event.target.classList.add('active');
                
                if (weatherData && weatherData.forecast) {
                    const container = document.getElementById('weatherCards');
                    const forecastCard = container.children[1];
                    if (forecastCard) {
                        const filteredForecast = filterForecastData(weatherData.forecast, type);
                        const newForecastCard = createFilteredForecastCard(filteredForecast, type);
                        container.replaceChild(newForecastCard, forecastCard);
                    }
                }
            }
            
            function filterForecastData(forecastData, filter) {
                if (filter === 'all') return forecastData;
                
                const filtered = {
                    ...forecastData,
                    list: forecastData.list.filter(item => {
                        const weather = item.weather[0].main.toLowerCase();
                        const description = item.weather[0].description.toLowerCase();
                        
                        switch(filter) {
                            case 'sunny':
                                return weather === 'clear' || description.includes('sun');
                            case 'rainy':
                                return weather === 'rain' || description.includes('rain');
                            case 'cloudy':
                                return weather === 'clouds' || description.includes('cloud');
                            case 'clear':
                                return weather === 'clear';
                            default:
                                return true;
                        }
                    })
                };
                
                return filtered;
            }
            
            function createFilteredForecastCard(forecastData, filter) {
                const card = document.createElement('div');
                card.className = 'weather-card';
                
                let forecastHTML = \`<div class="card-title">📅 \${filter === 'all' ? '5-Day' : filter.charAt(0).toUpperCase() + filter.slice(1)} Forecast</div><div class="forecast-items">\`;
                
                if (forecastData.list.length === 0) {
                    forecastHTML += '<p style="text-align: center; opacity: 0.7; grid-column: 1/-1;">No weather data matches the selected filter</p>';
                } else {
                    const dailyForecasts = {};
                    forecastData.list.forEach(item => {
                        const date = new Date(item.dt * 1000).toDateString();
                        if (!dailyForecasts[date]) {
                            dailyForecasts[date] = item;
                        }
                    });
                    
                    Object.values(dailyForecasts).slice(0, 5).forEach(item => {
                        forecastHTML += \`
                            <div class="forecast-item">
                                <div style="font-size: 2rem; margin-bottom: 10px;">\${getWeatherIcon(item.weather[0].icon)}</div>
                                <div style="font-weight: bold;">\${new Date(item.dt * 1000).toLocaleDateString('en-US', {weekday: 'short'})}</div>
                                <div style="margin: 5px 0;">\${Math.round(item.main.temp_max)}°/\${Math.round(item.main.temp_min)}°</div>
                                <div style="font-size: 0.9rem; opacity: 0.8;">\${item.weather[0].description}</div>
                            </div>
                        \`;
                    });
                }
                
                forecastHTML += '</div>';
                card.innerHTML = forecastHTML;
                
                return card;
            }
            
            function showLoading() {
                document.getElementById('loading').style.display = 'block';
                document.getElementById('error').style.display = 'none';
                document.getElementById('weatherCards').innerHTML = '';
            }
            
            function hideLoading() {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('error').style.display = 'none';
            }
            
            function showError() {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('error').style.display = 'block';
                document.getElementById('weatherCards').innerHTML = '';
            }
            
            // Enter key support
            document.getElementById('cityInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    getWeather();
                }
            });
            
            // Auto-detect location on page load (optional)
            window.addEventListener('load', function() {
                console.log('🌤 Advanced Weather App loaded successfully!');
            });
        </script>
    </body>
    </html>
  `);
});

// Weather API endpoint
app.get('/api/weather', async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    const API_KEY = process.env.OPENWEATHER_API_KEY || 'your_api_key';  // your api key
    
    let weatherUrl, forecastUrl, uvUrl;
    
    if (city) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    } else if (lat && lon) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    } else {
      return res.status(400).json({ error: 'Either city or lat/lon parameters are required' });
    }
    
    // Fetch weather data
    const [weatherResponse, forecastResponse] = await Promise.all([
      axios.get(weatherUrl),
      axios.get(forecastUrl)
    ]);
    
    let uvData = null;
    if (uvUrl) {
      try {
        const uvResponse = await axios.get(uvUrl);
        uvData = uvResponse.data.value;
      } catch (uvError) {
        console.log("UV data not available");
      }
    }
    
    const weatherData = {
      current: weatherResponse.data,
      forecast: forecastResponse.data,
      uv: uvData
    };
    
    res.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error.message);
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'City not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🌤 Weather app server running on http://localhost:${PORT}`);
});
