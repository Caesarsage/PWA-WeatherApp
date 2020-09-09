'use strict'
// import { api } from "./api";

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

const api ={
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
    ).catch( err => {
      console.log(err)
    }
  )
}

function getForecast(forecast) {
  const lat = forecast[0].lat;
  const lon = forecast[0].lon;
  const displayName = forecast[0].display_name;
  console.log( ' ' + lat +' ' + lon);
  getResults(lat,lon, displayName)

}

function getResults(lat,lon, displayName){
  // api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
  fetch(`${api.base}onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely&appid=${api.key}`)
    .then(weather => {
       return weather.json();
    })
    .then(
      displayResults,
      city.innerText = displayName
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
  // precipitation.innerText =`${weather.current.dew_point*100} %`;


  let icon = weather.current.weather[0].icon;
  
  document.getElementById('weatherIcon').src = getICON(icon)

  // Render the forecasts tabs
  document.getElementById('hourlyForecast').innerHTML = hourlyForecast(weather.hourly);
  document.getElementById('dailyForecast').innerHTML = dailyForecast(weather.daily);

}

//LOCAL STORAGE

// get hourly forecast
function hourlyForecast(fcData) {
  let resultHTML = `<tr>
    <th>Time</th>
      <th>Conditions</th>
      <th>Temp</th>
      <th>Humidity</th>
  </tr>`;

  let rowCount = fcData.length;
  // if (rowCount > 8) {
  //   rowCount = 8;
  // }

  for (let i = 0; i < rowCount; i++) {
    let ts = new Date(fcData[i].dt * 1000);
    let summary = "";
    let tempHigh = 0;
    let timeValue;

    let hours = ts.getHours();

    if (hours > 0 && hours <= 12) {
      timeValue = "" + hours;
    } else if (hours > 12) {
      timeValue = "" + (hours - 12);
    } else if(hours === 0) {
      timeValue = "12";
    }

    timeValue += (hours > 12) ? " PM" : " AM"; //get AM/PM

    summary = `${fcData[i].weather[0].description}
     <img src="https://openweathermap.org/img/wn/${fcData[i].weather[0].icon}.png" > 
    `;
    tempHigh = `${Math.round(fcData[i].temp)}&deg`;
    let humidity = `${Math.round(fcData[i].humidity)}%`;

    resultHTML += renderRow(timeValue, summary, tempHigh, humidity);
  
  }

  return resultHTML;
}

function dailyForecast(fcData) {
  let resultHTML = `<tr>
    <th>Day</th>
      <th>Conditions</th>
      <th>Hi</th>
      <th>Lo</th>
  </tr>`;

  let rowCount = fcData.length;
  // if (rowCount > 8) {
  //   rowCount = 8;
  // }

  for (let i = 0; i < rowCount; i++) {
    let ts = new Date(fcData[i].dt * 1000);

    let dayTime = dayBuilder(ts);
    let summary = `${fcData[i].weather[0].description}
     <img src="https://openweathermap.org/img/wn/${fcData[i].weather[0].icon}.png" > 
    `;
    let tempHigh = `${Math.round(fcData[i].temp.max)}&deg`;
    let tempLow =  `${Math.round(fcData[i].temp.min)}&deg`;

    resultHTML += renderRow(dayTime,summary,tempHigh, tempLow);
  }

  return resultHTML;

}

function renderRow(dayTime,summary,tempHigh, colVal4) {
  return `<tr><td>${dayTime}</td><td>${summary} 
  </td><td>${tempHigh}</td><td>${colVal4}</td></tr>`
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