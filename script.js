
const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
// const locationButton = document.querySelector(".location-btn");
const locationButton = document.querySelector(".location-btn");

const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "f23bf57dcf99c0ebbbca3a3c1ca885c2";

const createWeatherCard = (city, weatherItem, index) => {

    if (index === 0) {
        return `<div class="details">
                    <h2>${city} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temp=${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind:${weatherItem.wind.speed}M/S</h4>
                    <h4>Humidity:${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="./images/1.png" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    } else {
        return `<li class="card">
                    <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
                    <img src="./images/1.png" alt="weather-icon">
                    <h4>Temp=${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind:${weatherItem.wind.speed}M/S</h4>
                    <h4>Humidity:${weatherItem.main.humidity}%</h4>
                </li>`;
    }
};

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then((res) => res.json())
        .then((data) => {
            const uniqueforecastDays = [];
            const fiveDaysForecast = data.list.filter((forecast) => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueforecastDays.includes(forecastDate)) {
                    uniqueforecastDays.push(forecastDate);
                    return true;
                }
                return false;
            });

            cityInput.value = "";
            currentWeatherDiv.innerHTML = "";
            weatherCardsDiv.innerHTML = "";

            fiveDaysForecast.forEach((weatherItem, index) => {
                if (index === 0) {
                    currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                } else {
                    weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                }
            });
        })
        .catch(() => {
            alert("An error occurred while fetching weather forecast");
        });
};

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL)
        .then((res) => res.json())
        .then((data) => {
            if (!data.length) return alert(`No coordinates found for ${cityName}`);
            const { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates");
        });
};

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

            fetch(REVERSE_GEOCODING_URL)
                .then((res) => res.json())
                .then((data) => {
                    const { name } = data[0];
                    getWeatherDetails(name, latitude, longitude);
                })
                .catch(() => {
                    alert("An error occurred while fetching the city");
                });
        },
        (error) => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            }
        }
    );
};

locationButton.addEventListener("click", getUserCoordinates);


searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", (e) => e.key === "Enter" && getCityCoordinates);


