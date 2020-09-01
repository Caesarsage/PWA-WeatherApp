'use strict'

const searchBar = document.getElementById('search');
const findBtn = document.querySelector('.btn');
const city = document.querySelector('.city');
const date = document.querySelector('.date');
const temp = document.querySelector('.temp');
const weatherV = document.querySelector('.weather');
const tempRange = document.querySelector('.temp-range');
const day = document.querySelector('.day');

let counter = 0 ;

const api = {
  key: '8ff7422f47efdacccce3e0c8dac5bbed',
  base: 'https://api.openweathermap.org/data/2.5/'
}

searchBar.addEventListener('keypress', setQuery, false);
findBtn.addEventListener('click', ()=>{
  getResults(searchBar.value)
}, false);

function setQuery(event) {
  if (event.keyCode === 13) {
    getResults(searchBar.value);
  }
}

function getResults(query){
  // api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
  fetch(`${api.base}weather?q=${query}&appid=${api.key}`)
    .then(weather => {
       return weather.json();
    })
    .then(
      displayResults
    ).catch( err=>{
      switch (err.ONE) {
        case value:
          alert()
          break;
        case value:
          alert()
          break;
        case value:
          alert()
          break;
        default:
          break;
      }
    });
}

function displayResults(weather){
  console.log(weather);
  city.innerText = `${weather.name}, ${weather.sys.country}`

  let now = new Date();

  day.innerText = dayBuilder(now);
  date.innerText = dateBuilder(now);

  temp.innerHTML = `
      ${Math.round(weather.main.temp).toFixed()}<span> c </span>
    `;

  weatherV.innerText = weather.weather[0].main;

  tempRange.innerText =`${weather.main.temp_min}c / ${weather.main.temp_max}c`;
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