document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '21d84f78111268d85d43e9f8241ba969'; 
    const locationInput = document.getElementById('locationInput');
    const updateWeatherBtn = document.getElementById('updateWeatherBtn');
    const clearWeatherBtn = document.getElementById('clearWeatherBtn');
    const locationElement = document.getElementById('location');
    const currentTemperatureElement = document.getElementById('current-temperature');
    const currentDescriptionElement = document.getElementById('current-description');
    const precipitationElement = document.getElementById('precipitation');
    const humidityElement = document.getElementById('humidity');
    const airPressureElement = document.getElementById('air-pressure');
    const windElement = document.getElementById('wind');
    const visibilityElement = document.getElementById('visibility');
    const sunriseElement = document.getElementById('sunrise');
    const sunsetElement = document.getElementById('sunset');
    const hourlyGraphContainer = document.getElementById('hourly-graph');
    const dailyForecastContainer = document.getElementById('daily-forecast');

    function updateWeather() {
        const city = locationInput.value.trim();

        if (city === '') {
            alert('Please enter a city name.');
            return;
        }

        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        // Fetch current weather
        fetch(currentWeatherUrl)
            .then(response => response.json())
            .then(data => {
                const location = data.name + ', ' + data.sys.country;
                const currentTemperature = data.main.temp + '°C';
                const currentDescription = data.weather[0].description;
                const precipitation = `Precipitation: ${data.rain ? data.rain['1h'] : 0} mm`; // Rain in the last 1 hour
                const humidity = `Humidity: ${data.main.humidity}%`;
                const airPressure = `Air Pressure: ${data.main.pressure} hPa`;
                const wind = `Wind: ${data.wind.speed} m/s`;
                const visibility = `Visibility: ${data.visibility / 1000} km`;
                const sunrise = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
                const sunset = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;
                const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

                locationElement.textContent = location;
                currentTemperatureElement.textContent = currentTemperature;
                currentDescriptionElement.textContent = currentDescription;
                precipitationElement.textContent = precipitation;
                humidityElement.textContent = humidity;
                airPressureElement.textContent = airPressure;
                windElement.textContent = wind;
                visibilityElement.textContent = visibility;
                sunriseElement.textContent = sunrise;
                sunsetElement.textContent = sunset;

                // Display weather icon
                const iconImg = document.createElement('img');
                iconImg.src = weatherIcon;
                iconImg.alt = currentDescription;
                iconImg.classList.add('weather-icon');
                locationElement.appendChild(iconImg);
            })
            .catch(error => console.error('Error fetching current weather data:', error));

        // Fetch weather forecast
        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                hourlyGraphContainer.innerHTML = ''; // Clear previous hourly forecast
                dailyForecastContainer.innerHTML = ''; // Clear previous daily forecast

                // Filter hourly forecast for the current day
                const currentDate = new Date();
                const currentDay = currentDate.getDate();
                const hourlyForecastData = data.list.filter(entry => {
                    const entryDate = new Date(entry.dt * 1000);
                    return entryDate.getDate() === currentDay;
                });

                hourlyForecastData.forEach(hourlyForecast => {
                    const hour = new Date(hourlyForecast.dt * 1000).getHours();
                    const temperature = hourlyForecast.main.temp;
                    const icon = hourlyForecast.weather[0].icon;
                    const humidity = `Humidity: ${hourlyForecast.main.humidity}%`;

                    const hourlyForecastItem = document.createElement('div');
                    hourlyForecastItem.classList.add('hourly-forecast-item');

                    hourlyForecastItem.innerHTML = `
                        <div>${hour}:00</div>
                        <div>${temperature}°C</div>
                        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${hourlyForecast.weather[0].description}" class="weather-icon">
                        <div>${humidity}</div>
                    `;

                    hourlyGraphContainer.appendChild(hourlyForecastItem);
                });

                // Filter daily forecast for the next 7 days
                const dailyForecastData = data.list.filter(entry => entry.dt_txt.includes('12:00:00')); // Select only one entry per day (12:00 PM)

                dailyForecastData.slice(1, 8).forEach(dailyForecast => {
                    const date = new Date(dailyForecast.dt * 1000);
                    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const temperature = dailyForecast.main.temp;
                    const icon = dailyForecast.weather[0].icon;

                    const dailyForecastItem = document.createElement('div');
                    dailyForecastItem.classList.add('hourly-forecast-item');

                    dailyForecastItem.innerHTML = `
                        <div>${day}</div>
                        <div>${temperature}°C</div>
                        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${dailyForecast.weather[0].description}" class="weather-icon">
                    `;

                    dailyForecastContainer.appendChild(dailyForecastItem);
                });
            })
            .catch(error => console.error('Error fetching weather forecast:', error));
    }

    function clearWeather() {
        locationInput.value = '';
        locationElement.textContent = '';
        currentTemperatureElement.textContent = '';
        currentDescriptionElement.textContent = '';
        precipitationElement.textContent = '';
        humidityElement.textContent = '';
        airPressureElement.textContent = '';
        windElement.textContent = '';
        visibilityElement.textContent = '';
        sunriseElement.textContent = '';
        sunsetElement.textContent = '';
        hourlyGraphContainer.innerHTML = '';
        dailyForecastContainer.innerHTML = '';
    }

    // Add event listeners for the button clicks
    updateWeatherBtn.addEventListener('click', updateWeather);
    clearWeatherBtn.addEventListener('click', clearWeather);
});
