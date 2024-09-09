import "./styles.css";
import { fetchWeatherData } from "./fetchWeatherData.js";
import clearDay from "./weatherIcons/clear-day.png";
import clearNight from "./weatherIcons/clear-night.png";
import cloudy from "./weatherIcons/cloudy.png";
import partlyCloudyDay from "./weatherIcons/partly-cloudy-day.png";
import partlyCloudyNight from "./weatherIcons/partly-cloudy-night.png";
import rain from "./weatherIcons/rain.png";
import snow from "./weatherIcons/snow.png";
import sun from "./generalIcons/sunrise.png";
import temperature from "./generalIcons/temperature.png";
import umbrella from "./generalIcons/umbrella.png";
import uvIndexIcon from "./generalIcons/uv-index.png";
import wind from "./generalIcons/wind.png";

// Initial search parameters
let unit = "metric";
let location = "london";

function getDay(dateString) {
    const inputDate = new Date(dateString);
    const today = new Date();
  
    const diffTime = inputDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays === 0) {
      return "Today";
    }
    
    if (diffDays === 1) {
      return "Tomorrow";
    }
  
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(inputDate);
}

function formatDateToDayMonth(dateString) {
    const date = new Date(dateString);

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short'
    }).format(date);

    return formattedDate;
}

function getWeatherIcon(weather) {
    switch(weather) {
        case "clear-day":
            return clearDay;
        case "clear-night":
            return clearNight;
        case "cloudy":
            return cloudy;
        case "partly-cloudy-day":
            return partlyCloudyDay;
        case "partly-cloudy-night":
            return partlyCloudyNight;
        case "rain":
            return rain;
        case "snow":
            return snow;
    }
}

async function handleWeather(location, unit) {
    // clear weatherData before new search
    const allWeatherDay = document.querySelectorAll(".weatherDay");
    allWeatherDay.forEach((day) => {
        day.remove();
    })
    
    const weatherData = await fetchWeatherData(location, unit);

    let city = weatherData.resolvedAddress.split(", ")[0];
    let country = weatherData.resolvedAddress.split(", ")[2];
    let weatherDays = weatherData.days

    weatherDays.forEach((day) => {
        let weatherIcon = getWeatherIcon(day.icon);
        let weekDay = getDay(day.datetime);
        let date = formatDateToDayMonth(day.datetime);
        let maxTemp = day.tempmax;
        let minTemp = day.tempmin;
        let precip = day.precip;
        let windSpeed = day.windspeed;
        let windGust = day.windgust;
        let sunRise = day.sunrise.split(":").slice(0, 2).join(".");
        let sunSet = day.sunset.split(":").slice(0, 2).join(".");
        let uvIndex = day.uvindex;

        populateDay(weatherIcon, weekDay, date, maxTemp, minTemp, precip, windSpeed, windGust, sunRise, sunSet, uvIndex);
    });

    populateHeader(city, country);
}

const searchButton = document.querySelector("#searchButton");
const searchInput = document.querySelector("#search");

searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    location = searchInput.value;
    handleWeather(location, unit);
});

// Initial weather search
handleWeather(location, unit);

function populateHeader(city, country) {
    const cityElement = document.querySelector("#city");
    const countryElement = document.querySelector("#country");

    cityElement.textContent = city;
    countryElement.textContent = country;

}

const unitSwitchButton = document.querySelector("#unitSwitch");

unitSwitchButton.addEventListener("click", () => {
    // Toggle the unit between metric and US
    if (unit === "metric") {
        unit = "us";
        unitSwitchButton.textContent = "US Units";
    } else {
        unit = "metric";
        unitSwitchButton.textContent = "Metric Units";
    }
    
    handleWeather(location, unit);
});

const containerDiv = document.querySelector(".container");

function populateDay(weatherIcon, weekDay, date, maxTemp, minTemp, precip, windSpeed, windGust, sunRise, sunSet, uvIndex) {

    const temperatureUnit = unit === "metric" ? "°C" : "°F";
    const windSpeedUnit = unit === "metric" ? "m/s" : "mph";
    const precipUnit = unit === "metric" ? "mm" : "in";

    const weatherDayDiv = document.createElement("div");
    weatherDayDiv.className = "weatherDay";
    weatherDayDiv.innerHTML = 
    `
    <div class="day">
        <img src=${weatherIcon} class="weatherImg">
        <div class="dayDate">
            <h3>${weekDay}</h3>
            <h4>${date}</h4>
        </div>
    </div>
    <div class="temp">
        <img class="tempImg" src=${temperature}>
        <div class="tempData">
            <p class="maxTemp">${maxTemp} ${temperatureUnit}</p>
            <p class="minTemp">${minTemp} ${temperatureUnit}</p>
        </div>
    </div>
    <div class="rain">
        <img src=${umbrella} class="rainImg">
        <p class="precip">${precip} ${precipUnit}</p>
    </div>
    <div class="wind">
        <img src=${wind} class="windImg">
        <div class="windData">
            <p>${windSpeed} ${windSpeedUnit}</p>
            <p>${windGust} ${windSpeedUnit}</p>
        </div>
    </div>
    <div class="sunTime">
        <img src=${sun} class="sunRiseImg">
        <div class="sunTimeData">
            <p>${sunRise}</p>
            <p>${sunSet}</p>
        </div>
    </div>
    <div class="uvIndex">
        <img src=${uvIndexIcon} class="uvIndexImg">
        <p>${uvIndex}</p>
    </div>
    `;
    containerDiv.appendChild(weatherDayDiv);
}
