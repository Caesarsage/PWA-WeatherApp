'use strict'

const searchBar = document.getElementById('search');
const findBtn = document.querySelector('.btn');
const city = document.querySelector('.city');
const date = document.querySelector('.date');
const temp = document.querySelector('.temp');
const weatherV = document.querySelector('.weather');
const timeZone = document.querySelector('.timezone');
const day = document.querySelector('.day');
const erroMessage = document.querySelector('.error');
const details = document.querySelector('.details');
const precipitation = document.querySelector('.pre');
const hum = document.querySelector('.hum');
const wind = document.querySelector('.wind');

let iconValue = {
  CLEAR: 'clear sky',
  FEW_CLOUD: 'few cloud',
  SCATTERED_CLOUDS: 'scattered clouds',
  BROKEN_CLOUDS: 'broken clouds',
  SHOWER_RAIN: 'shower rain',
  RAIN : 'rain',
  THUNDERSTORM : 'thunderstorm',
  SNOW : 'snow',
  MIST: 'mist'
}


let counter = 0 ;

const api = {
  key: '8ff7422f47efdacccce3e0c8dac5bbed',
  base: 'https://api.openweathermap.org/data/2.5/',
  key2: 'bbeb2ada24fec4',
  base2: 'https://us1.locationiq.com/v1/search.php?'
}



searchBar.addEventListener('keypress', setQuery, false);

findBtn.addEventListener('click', ()=>{
  getLonLat(searchBar.value);
}, false);

function setQuery(event) {
  if (event.keyCode === 13) {    
    getLonLat(searchBar.value);
  }
}

function getLonLat(query) {
  fetch(`${api.base2}key=${api.key2}&q=${query}&format=json`)
    .then( forecast =>{
      return forecast.json();
    })
    .then(
      getForecast,
      erroMessage.style.display = 'none',
      city.innerText = query
    ).catch( err => {
      console.log(err),
      erroMessage.innerText = 'Sorry an error occur!!!, try again',
      city.style.display = 'none'
    }
  )
}

function getForecast(forecast) {
  const lat = forecast[0].lat;
  const lon = forecast[0].lon;
  console.log( ' ' + lat +' ' + lon);
  getResults(lat,lon)

}

function getResults(lat,lon){
  // api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
  fetch(`${api.base}onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely&appid=${api.key}`)
    .then(weather => {
       return weather.json();
    })
    .then(
      displayResults
    ).catch( err=>{
      console.log(err) 
    });
}

function displayResults(weather){
  console.log(weather);

  let now = new Date();

  day.innerText = dayBuilder(now);
  date.innerText = dateBuilder(now);

  temp.innerHTML = `
    ${Math.round(weather.current.temp).toFixed()}<span> &deg;c </span>
  `;

  weatherV.innerText = weather.current.weather[0].main;
  details.innerText = weather.current.weather[0].description;

  timeZone.innerText = weather.timezone;
  wind.innerText = `
    ${weather.current.wind_speed}mph
  `;
  hum.innerText = `${weather.current.humidity*100}%`;
  precipitation.innerText =`${weather.current.dew_point*100} %`;


  let icon = weather.current.weather[0].icon;
  
  document.getElementById('weatherIcon').src = getICON(icon)

 
  dailyAndHourlyForecast(weather);
 
}

function dailyAndHourlyForecast(weatherF) {
  console.log(weatherF);
}

function getICON(icon) {
  switch (icon) {
    case iconValue.CLEAR:
      return 'images/sunnyDay.png'
    case iconValue.SCATTERED_CLOUDS:
    case iconValue.BROKEN_CLOUDS:
      return 'images/CloudyMoon.png'
    case iconValue.SNOW:
      return 'images/Snow.png'
    case iconValue.THUNDERSTORM:
    case iconValue.RAIN:
      return 'images/Rain.png'
    case iconValue.FEW_CLOUD:
      return 'images/CloudyMoon.png'
    // case iconValue.CLEAR:
    //   return 'image/sunnyDay.png'
    //   break;
    default:
     return 'images/Rain.png'
  }
}

function dayBuilder(now) {
  let days = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
    , "Saturday"
  ];
  let day = days[now.getDay()];
  return `${day}`
}

function dateBuilder(now) {
  let months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];

  let date = now.getDate();
  let month = months[now.getMonth()];
  let year = now.getFullYear();

  return `${date} ${month} ${year}`;
}

function openCity(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += "active";
}