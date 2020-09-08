'use strict'
import { api } from "./api";

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
  CLEAR: 'day-sunny',
  FEW_CLOUD: 'day-cloud',
  SCATTERED_CLOUDS: 'night-alt-clouds',
  BROKEN_CLOUDS: 'day-clouds',
  SHOWER_RAIN: 'shower rain',
  RAIN : 'day-rain',
  THUNDERSTORM : 'day-thunderstorm',
  SNOW : 'snow',
  MIST: 'fog'
}

let counter = 0 ;

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

 
  dailyForecast(weather);
  const daily = document.getElementById('dailyForecast').dailyForecast(weather.hourly);
  const weekly =  document.getElementById('weeklyForecast').hourlyForecast(weather.daily);

}

//LOCAL STORAGE


function dailyForecast(fcData) {
  let resultHTML = `<tr>
    <th>Day</th>
      <th>Humidity</th>
      <th>Weather</th>
      <th>Temperature</th>
      <th>Wind speed</th>
  </tr>`

  rowCount = fcData.length;
  if (rowCount > 8) {
    rowCount = 8;
  }

  for (let i = 0; i < rowCount.length; i++) {
    let ts = new Date(fcData[i]);
    
  }

  let hours = ts.getHours();
  if (hours > 0 && hours<= 12 ) {
    timeValue = -- + hours;
  } else {
    
  }

  return resultHTML;
}

function hourlyForecast(fcData) {
  
}

function getICON(icon) {
  switch (icon) {
    case iconValue.CLEAR:
      return 'assets/images/sunnyDay.png'
    case iconValue.SCATTERED_CLOUDS:
    case iconValue.BROKEN_CLOUDS:
      return 'assets/images/CloudyMoon.png'
    case iconValue.SNOW:
      return 'assets/images/Snow.png'
    case iconValue.THUNDERSTORM:
    case iconValue.RAIN:
      return 'assets/images/Rain.png'
    case iconValue.FEW_CLOUD:
      return 'assets/images/CloudyMoon.png'
    // case iconValue.CLEAR:
    //   return 'image/sunnyDay.png'
    //   break;
    default:
     return 'assets/images/Rain.png'
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