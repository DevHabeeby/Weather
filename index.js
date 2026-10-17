const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");


searchBtn.addEventListener("click", function () {

  const city = cityInput.value.trim();

  if (city === "") {
    alert("Please enter a city name");
    return;
  }

  getWeather(city);

});


async function getWeather(city) {

  try {

    // 1. Find the city
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      alert("City not found");
      return;
    }

    // Get information about the city
    const location = geoData.results[0];

    const latitude = location.latitude;
    const longitude = location.longitude;

    // 2. Get the weather using latitude and longitude
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
    );

    const weatherData = await weatherResponse.json();

    // 3. Get current weather
    const current = weatherData.current;

    // 4. Display the information
    cityName.textContent = `${location.name}, ${location.country}`;

    temperature.textContent = `${Math.round(current.temperature_2m)}°C`;

    humidity.textContent = `${current.relative_humidity_2m}%`;

    wind.textContent = `${current.wind_speed_10m} km/h`;

    description.textContent = getWeatherDescription(
      current.weather_code
    );

    weatherIcon.textContent = getWeatherIcon(
      current.weather_code
    );

  } catch (error) {

    console.log(error);
    alert("Something went wrong. Check your internet connection.");

  }

}


// Weather description
function getWeatherDescription(code) {

  if (code === 0) {
    return "Clear sky";
  }

  if (code === 1 || code === 2 || code === 3) {
    return "Partly cloudy";
  }

  if (code === 45 || code === 48) {
    return "Foggy";
  }

  if (code >= 51 && code <= 57) {
    return "Drizzle";
  }

  if (code >= 61 && code <= 67) {
    return "Rainy";
  }

  if (code >= 71 && code <= 77) {
    return "Snowy";
  }

  if (code >= 80 && code <= 82) {
    return "Rain showers";
  }

  if (code >= 95) {
    return "Thunderstorm";
  }

  return "Unknown weather";
}


// Weather emoji
function getWeatherIcon(code) {

  if (code === 0) {
    return "☀️";
  }

  if (code === 1 || code === 2) {
    return "🌤️";
  }

  if (code === 3) {
    return "☁️";
  }

  if (code === 45 || code === 48) {
    return "🌫️";
  }

  if (code >= 51 && code <= 67) {
    return "🌧️";
  }

  if (code >= 71 && code <= 77) {
    return "❄️";
  }

  if (code >= 80 && code <= 82) {
    return "🌦️";
  }

  if (code >= 95) {
    return "⛈️";
  }

  return "🌤️";
}