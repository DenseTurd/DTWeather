/*
togglable units (C/F)
Put loadsa little extra data at the bottom; pressure etc
*/

window.addEventListener('load', () => {
    const APIkey = "NaughtyAPIKeyDon'tLook";
    let lon;
    let lat;
    let locationTimezone = document.querySelector('.location-timezone');
    let weatherDescription = document.querySelector('.weather-description');
    let temperatureSection = document.querySelector('.temperature');
    let temperatureVal = document.querySelector('.temperature-val');
    const temperatureSpan = document.querySelector('.temperature span');

    let feelsLikeVal = document.querySelector('.feels-like');
    let humidityVal = document.querySelector('.humidity');
    let pressureVal = document.querySelector('.pressure');

    let sunriseVal = document.querySelector('.sunrise');
    let sunsetVal = document.querySelector('.sunset');

    let windSpeedVal = document.querySelector('.wind-speed');
    let windDirVal = document.querySelector('.wind-dir');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {

            lon = position.coords.longitude;
            lat = position.coords.latitude;

            const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIkey}`;
        
            fetch(api)
            .then(response => {
                return response.json(); 
            })
            .then(data => {
                console.log(data);
                
                locationTimezone.textContent = data.timezone;
                
                setWeatherIcon(getWeatherType(data.current.weather[0].icon), document.querySelector(".icon"));
                
                weatherDescription.textContent = data.current.weather[0].description;
                
                const { temp, feels_like, humidity, pressure, sunrise, sunset, wind_speed, wind_deg } = data.current;

                sortTemperatures(temp, feels_like);

                humidityVal.textContent = "Humidity: " + humidity + "%";
                pressureVal.textContent = "Pressure: " + pressure + "hPa";
                
                sunriseVal.textContent = "Sunrise: " + UnixToGMT(sunrise);
                sunsetVal.textContent = "Sunset: " + UnixToGMT(sunset);

                windSpeedVal.textContent = "Wind speed: " + wind_speed + "m/s";
                windDirVal.textContent = "Wind direction: " + wind_deg;
            });
        });
    } else {
        console.log('Geolocation no workey');
    }

    function setWeatherIcon(weatherType, DOMIcon) {
        const skycons = new Skycons({color: "white"});
        skycons.play();
        return skycons.set(DOMIcon, Skycons[weatherType]);
    }

    function getWeatherType(icon) {
        if (icon === '01d') {
            return 'CLEAR_DAY';
        }        
        if (icon === '01n') {
            return 'CLEAR_NIGHT';
        }
        if (icon === '02d') {
            return 'PARTLY_CLOUDY_DAY';
        }
        if (icon === '02n') {
            return 'PARTLY_CLOUDY_NIGHT';
        }
        if (icon === '03d' || icon === '03n' || icon === '04d' || icon === '04n') {
            return 'CLOUDY';
        }
        if (icon === '09d' || icon === '09n' || icon === '10d' || icon === '10n' || icon === '11d' || icon === '11n') {
            return 'RAIN';
        } 
        if (icon === '13d' || icon === '13n') {
            return 'SNOW';
        }
        if (icon === '50d' || icon === '50n') {
            return 'FOG';
        }
        console.log("Couldn't find weather type");
    }

    function sortTemperatures(temp, feelsLike) {
        temperatureVal.textContent = kelvinToCelsius(temp);
        feelsLikeVal.textContent = "Feels like: " + kelvinToCelsius(feelsLike) + "C";

        temperatureSection.addEventListener("click", () => {
            if (temperatureSpan.textContent === 'F') {
                temperatureSpan.textContent = 'C';
                temperatureVal.textContent = kelvinToCelsius(temp);
                feelsLikeVal.textContent = "Feels like: " + kelvinToCelsius(feelsLike) + "C";
            } else {
                temperatureSpan.textContent = 'F';
                temperatureVal.textContent = kelvinToFahrenheit(temp);
                feelsLikeVal.textContent = "Feels like: " + kelvinToFahrenheit(feelsLike) + "F";
            }
        });
    }

    function UnixToGMT(UNIX) {
        let date = new Date(UNIX * 1000);
        let hours = "0" + date.getHours();
        let mins = "0" + date.getMinutes();
        let secs = "0" + date.getSeconds();

        let formattedTime = hours.substr(-2) + ":" + mins.substr(-2) + ":" + secs.substr(-2);
        return formattedTime
    }

    function kelvinToCelsius(kelvin) {
        return (kelvin - 273.15).toFixed(1);
    }

    function kelvinToFahrenheit(kelvin) {
        return ((kelvin - 273.15) * (9/5) + 32).toFixed(1);
    }
});