const fetchWeather = () => {
  const apiKey = '0a36f8dbf27ba5c8aaf43d0a8efe9940';
  const city = 'Stockholm,Sweden';

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`)
    .then(response => response.json())
    .then(json => {
      const temperature = Math.round(json.main.temp);
      const weatherCondition = json.weather[0].main.toLowerCase();
      const sunrise = new Date(json.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const sunset = new Date(json.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const cityName = json.name;

      document.querySelector('.temperature').textContent = `${weatherCondition} | ${temperature}°`;
      document.querySelectorAll('.sun-times')[0].textContent = `sunrise: ${sunrise}`;
      document.querySelectorAll('.sun-times')[1].textContent = `sunset: ${sunset}`;
      updateMessageAndIcon(weatherCondition, cityName);
    })
    .catch(error => console.error('Error fetching current weather data:', error));

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const forecastContainer = document.querySelector('.week-forecast');
      forecastContainer.innerHTML = '';

      const dailyForecast = {};
      data.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString('en-EN', { weekday: 'short' });

        if (!dailyForecast[day]) {
          dailyForecast[day] = [];
        }

        dailyForecast[day].push({
          temp: forecast.main.temp,
          condition: forecast.weather[0].main.toLowerCase(),
        });
      });

      Object.keys(dailyForecast).slice(0, 5).forEach(day => {
        const dayData = dailyForecast[day];
        const avgTemp = Math.round(dayData.reduce((sum, entry) => sum + entry.temp, 0) / dayData.length);

        const weatherCondition = dayData[0].condition;
        let iconSrc = '';
        if (weatherCondition === 'rain' || weatherCondition === 'drizzle') {
          iconSrc = 'assets/noun_Umbrella_2030530.svg';
        } else if (weatherCondition === 'clear') {
          iconSrc = 'assets/noun_Sunglasses_2055147.png';
        } else if (weatherCondition === 'clouds') {
          iconSrc = 'assets/noun_Cloud_1188486.png';
        } else if (weatherCondition === 'snow') {
          iconSrc = 'assets/snow-vector-icon-png_261816.jpg';
        }

        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.innerHTML = `
          <span class="day-name">${day.toLowerCase()}</span>
          <img src="${iconSrc}" alt="${weatherCondition} icon" class="weather-icon">
          <span class="temperature">${avgTemp}°</span>
        `;
        forecastContainer.appendChild(dayElement);
      });
    })
    .catch(error => console.error('Error fetching weekly forecast data:', error));
};

const updateMessageAndIcon = (weatherCondition, cityName) => {
  const messageElement = document.querySelector('.message p');
  const umbrellaIcon = document.querySelector('.umbrella');
  const sunglassesIcon = document.querySelector('.sunglasses');
  const cloudIcon = document.querySelector('.cloud');
  const snowflakeIcon = document.querySelector('.snowflake');

  umbrellaIcon.style.display = 'none';
  sunglassesIcon.style.display = 'none';
  cloudIcon.style.display = 'none';
  snowflakeIcon.style.display = 'none';

  if (weatherCondition === 'rain' || weatherCondition === 'drizzle') {
    messageElement.innerHTML = `Don’t forget your umbrella. <br> It’s wet in <strong>${cityName}</strong> today.`;
    umbrellaIcon.style.display = 'block';
  } else if (weatherCondition === 'clear') {
    messageElement.innerHTML = `It’s clear and sunny in <strong>${cityName}</strong> today.`;
    sunglassesIcon.style.display = 'block';
  } else if (weatherCondition === 'clouds') {
    messageElement.innerHTML = `It’s cloudy in <strong>${cityName}</strong> today.`;
    cloudIcon.style.display = 'block';
  } else if (weatherCondition === 'snow') {
    messageElement.innerHTML = `It’s snowing in <strong>${cityName}</strong> today.`;
    snowflakeIcon.style.display = 'block';
  }
};

document.addEventListener('DOMContentLoaded', fetchWeather);
