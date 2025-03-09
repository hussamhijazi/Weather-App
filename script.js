const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const input = document.querySelector('.search-box input'); 
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

// Function to perform the search
const performSearch = () => {
    const APIKey = '';          //Type in your API Key
    const city = input.value;

    if (city === '') return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {

            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            // Set the date and time
            const dateTime = document.querySelector('.weather-box .date-time');

            // Get the timezone offset in seconds
            const timezoneOffset = json.timezone; // In seconds

            // Get the current time (UTC)
            const currentUTC = new Date().getTime();

            // Adjust the UTC time to local time using the timezone offset
            const localTime = new Date(currentUTC + timezoneOffset * 1000);

            // Format the local time
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };

            const formattedDateTime = localTime.toLocaleString('en-US', options);
            dateTime.textContent = formattedDateTime;

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const feelsLike = document.querySelector('.weather-details .feels-like span');
            const minTemp = document.querySelector('.weather-details .min-temp span');
            const maxTemp = document.querySelector('.weather-details .max-temp span');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            // Determine if it's day or night
            const currentTime = localTime.getTime();
            const sunrise = json.sys.sunrise * 1000; // Convert to milliseconds
            const sunset = json.sys.sunset * 1000;   // Convert to milliseconds
            const isDayTime = currentTime >= sunrise && currentTime < sunset;

            // Display the weather icon based on the weather condition and time
            // Weather logos got from https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
            switch (json.weather[0].description) {
                case 'clear sky':
                    image.src = isDayTime ? './images/01d.png' : 'images/01n.png' ;
                    break;

                case 'few clouds':
                    image.src = isDayTime ? './images/02d.png' : 'images/02n.png';
                    break;

                case 'scattered clouds':
                    image.src = isDayTime ? './images/03d.png' : 'images/03n.png';
                    break;

                case 'broken clouds':
                case 'overcast clouds':
                    image.src = isDayTime ? './images/04d.png' : 'images/04n.png';
                    break;

                case 'light rain':
                case 'moderate rain':
                case 'heavy intensity rain':
                case 'very heavy rain':
                case 'extreme rain':
                    image.src = isDayTime ? './images/10d.png' : 'images/10n.png';
                    break;

                case 'light intensity shower rain':
                case 'shower rain':
                case 'heavy intensity shower rain':
                case 'ragged shower rain':
                case 'light intensity drizzle':
                case 'drizzle':
                case 'heavy intensity drizzle':
                case 'light intensity drizzle rain':
                case 'drizzle rain':
                case 'heavy intensity drizzle rain':
                case 'shower rain and drizzle':
                case 'heavy shower rain and drizzle':
                case 'shower drizzle':
                    image.src = isDayTime ? './images/09d.png' : 'images/09n.png';
                    break;

                case 'thunderstorm with light rain':
                case 'thunderstorm with rain':
                case 'thunderstorm with heavy rain':
                case 'light thunderstorm':
                case 'thunderstorm':
                case 'heavy thunderstorm':
                case 'ragged thunderstorm':
                case 'thunderstorm with light drizzle':
                case 'thunderstorm with drizzle':
                case 'thunderstorm with heavy drizzle':
                    image.src = isDayTime ? './images/11d.png' : 'images/11n.png';
                    break;

                case 'light snow':
                case 'snow':
                case 'heavy snow':
                case 'sleet':
                case 'light shower sleet':
                case 'shower sleet':
                case 'light rain and snow':
                case 'rain and snow':
                case 'light shower snow':
                case 'shower snow':
                case 'heavy shower snow':
                case 'freezing rain':
                    image.src = isDayTime ? './images/13d.png' : 'images/13n.png';
                    break;

                case 'mist':
                case 'smoke':
                case 'haze':
                case 'sand/dust whirls':
                case 'fog':
                case 'sand':
                case 'dust':
                case 'volcanic ash':
                case 'squalls':
                case 'tornado':
                    image.src = isDayTime ? './images/50d.png' : 'images/50n.png';
                    break;

                default:
                    image.src = '';
            }



            // Display weather data
            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            feelsLike.innerHTML = `${parseInt(json.main.feels_like)}<span>°C</span>`;
            minTemp.innerHTML = `${parseInt(json.main.temp_min)}<span>°C</span>`;
            maxTemp.innerHTML = `${parseInt(json.main.temp_max)}<span>°C</span>`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)} Km/h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '700px';
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
};

// Add click event for search button
search.addEventListener('click', performSearch);

// Add keypress event for Enter key
input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        performSearch();
    }
});
