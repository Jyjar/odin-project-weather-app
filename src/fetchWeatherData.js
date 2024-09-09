async function fetchWeatherData(location, unit) {
    let response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unit}&key=5USHJQP8DXN5TKAVQQXHLGF66&contentType=json`)
    let weatherData = await response.json();
    console.log(weatherData);
    return weatherData;
}


export { fetchWeatherData };