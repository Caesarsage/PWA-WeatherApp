'use strict'

const mobile = document.querySelector('.mobile-icon');
const navLinks = document.querySelector('.primary-nav');

//controlling navbar toggle 
mobile.addEventListener('click', ()=>{
  if (navLinks.classList.contains('show-links')) {
    navLinks.classList.remove('show-links');
    mobile.style.backgroundImage = "url('../assets/images/icon-hamburger.svg')"
  }else{
    navLinks.classList.add('show-links');
    mobile.style.backgroundImage = "url('../assets/images/icon-close.svg')"
  }
});