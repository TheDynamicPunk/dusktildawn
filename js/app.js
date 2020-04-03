window.addEventListener('load', () => {
    let api = '';
    let long, lat;
    let locationTimezone = document.querySelector('.location-timezone');    
    let temperatureDegree = document.querySelector('.temperature-degree');    
    let temperatureDescritpion = document.querySelector('.temperature-description');    
    let temperatureSpan = document.querySelector('.temperature-section .symbol');
    let temperatureDegreeCelsius = document.querySelector('.temperature-degree-celsius');
    let temperatureSpanCelsius = document.querySelector('.symbol-celsius');
    let spinner = document.querySelector('.spinner');
    let intial = 0;

    const tl = new TimelineMax();

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(position => {
            
            long = position.coords.longitude;
            lat = position.coords.latitude;

            //To break the CORS policy that this API forces to us to follow
            
            const proxy1 = `https://cors-anywhere.herokuapp.com/`;

            api = `${proxy1}https://api.darksky.net/forecast/${config.key}/${lat},${long}`;
            
            fetchData(api);
        }, showError);
    } else {
        document.querySelector('.error h1').textContent = 'Geolocation Not Supportted';
        document.querySelector('.error p').textContent = 'This browser does not support Geolocation. Please try updating the browser or using Chrome or Firefox.';
    }

    function fetchData(api) {
        fetch(api).then(response => {
            return response.json();
        }).then(data => {

            document.querySelector('.loader').style.display = 'none';
            let {temperature, summary, icon} = data.currently;
            temperature = parseFloat(temperature).toPrecision(3);

            //Set DOM Elements here
            setMood(icon);
            
            temperatureDegree.textContent = temperature;
            temperatureDescritpion.innerHTML = 'Summary: ' + summary;
            locationTimezone.textContent = data.timezone;
            temperatureSpan.innerHTML = '&#176;F';
            setIcons(icon, document.querySelector('.icon'));



            //Temperature in Celsius
            let celsius = ((temperature - 32) * 5/9).toPrecision(3);
            temperatureDegreeCelsius.textContent = celsius;
            temperatureSpanCelsius.innerHTML = '&#176;C';

            if(intial == 0)
            {
                tl.fromTo(document.body, 1, {y: "-10%", opacity: "0"}, {y: "0%", opacity: "1"});
                intial++;
            }
        })
    }

    function setIcons(icon, iconID) {
        const skycons = new Skycons({color: 'white'});
        
        const currentIcon = icon.replace(/-/g, '_').toUpperCase();
        skycons.play();
        
        return skycons.set(iconID, Skycons[currentIcon])
    }

    function setMood(mood) {

        switch (mood) {
            case 'clear-day': 
                document.body.style.backgroundImage = 'linear-gradient(to right bottom, #e9d245, #eeb928, #f39e0e, #f58002, #f65f0f)';
                break;

            case 'cloudy':
            case 'partly-cloudy-day': 
                document.body.style.backgroundImage = 'linear-gradient(rgb(47, 150, 163), rgb(48, 62, 143))';
                break;

            case 'clear-night':
            case 'partly-cloudy-night': 
                document.body.style.backgroundImage = 'linear-gradient(to top, #020444, #1a1c64, #323285, #494aa8, #5f64cd)';
                break;
            
            case 'snow':
            case 'sleet':
            case 'fog': 
                document.body.style.backgroundImage = 'linear-gradient(to right bottom, #aeaeae, #8f8f8f, #717171, #545454, #393939)';
                break;

            case 'wind':
                document.body.style.backgroundImage = 'linear-gradient(to right bottom, #66f267, #4abd4c, #2f8b32, #155b1a, #013001)';
                break;
        
            default:
                break;
        }
    }

    setInterval(() => {
        
        // console.log("Auto refreshed!");

        tl.to(spinner, 2, {opacity: "1"});
        fetchData(api);
        tl.to(spinner, 2, {opacity: "0"});

    }, 30000);
});

function showError(error) {

    document.querySelector('.loader').style.display = 'none';
    
    switch (error.code) {

        case error.PERMISSION_DENIED: 
            document.querySelector('.error h1').textContent = "Enable Location";
            document.querySelector('.error p').textContent = "Please enable location in your browser to automatically fetch your local weather conditions! Don't worry your data is safe with us!";
            break;
        
        case error.POSITION_UNAVAILABLE:
            document.querySelector('.error h1').textContent = "Location Unavailable";
            document.querySelector('.error p').textContent = "Apologies but we could not locate you at this time. Please try again later.";
            break;
        
        case error.TIMEOUT:
            document.querySelector('.error h1').textContent = "Location request timed out";
            document.querySelector('.error p').textContent = "Please refresh the page and try again.";
            break;
        
        case error.UNKNOWN_ERROR:
            document.querySelector('.error h1').textContent = "Unknown error occured";
            break;
    }

    document.querySelector('.error').classList.replace('hide', 'show');
}