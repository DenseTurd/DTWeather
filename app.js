window.addEventListener('load', () => {
    const APIkey = 'NaughtyDontLook!';
    let lon;
    let lat;
    let temperatureDescription = document.querySelector('.temperature-description');
    let temperatureDegree = document.querySelector('.temperature-degree');
    let locationTimezone = document.querySelector('.location-timezone');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            console.log(position);
            lon = position.coords.longitude;
            lat = position.coords.latitude;
            console.log(lat, lon);
            const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIkey}`;
        
            fetch(api)
            .then(response => {
                return response.json(); 
            })
            .then(data => {
                console.log(data);
                const { temp, dew_point, feels_like } = data.current;
                console.log(`Temp: ${temp}, Feels like: ${feels_like}, Dew point: ${dew_point}`);
            
                const description = data.current.weather[0].description;
                console.log(description);

                const timezone = data.timezone;

                temperatureDegree.textContent = (temp - 273.15).toFixed(1);
                temperatureDescription.textContent = description;
                locationTimezone.textContent = timezone;
            })
        });
    } else {
        console.log('Geolocation no workey')
    }
});