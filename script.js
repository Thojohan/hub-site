"use strict";

const pagetopText = document.querySelector(".pagetop-text");
const weatherContainer = document.querySelector(".top-right-bottom");
const sideBarLinks = document.querySelectorAll(".link-container");
const mainWindow = document.querySelector(".main-section");
const time = document.querySelector(".time-formated");
let current;
const locale = navigator.language;
const getPosition = navigator.geolocation.getCurrentPosition(success, error);

const weatherCodes = [
  { weatherCode: [0], picture: "sun.svg" },
  {
    weatherCode: [1, 2],
    picture: "cloud-sun.svg",
  },
  {
    weatherCode: [3],
    picture: "cloud.svg",
  },
  {
    weatherCode: [45, 48],
    picture: "cloud-fog-2.svg",
  },
  {
    weatherCode: [51, 53, 55, 56, 57],
    picture: "drizzle.svg",
  },
  {
    weatherCode: [61, 63, 65, 66, 67],
    picture: "rain.svg",
  },
  {
    weatherCode: [71, 73, 75, 77, 85, 86],
    picture: "cloud-snow.svg",
  },
  {
    weatherCode: [80, 81, 82],
    picture: "cloud-rain.svg",
  },
  {
    weatherCode: [95],
    picture: "cloud-lightning.svg",
  },
  { weatherCode: [96, 99], picture: "lightning.svg" },
];

// Get weather data and insert weather HTML

async function getWeather(lat, long) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,apparent_temperature,weathercode&current_weather=true&timezone=auto`
  )
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(`Could not get weather data (${response.status})`);
      }
      return response.json();
    })
    .then((data) => {
      const jsonData = data;
      const currentWeatherCode =
        jsonData.hourly.weathercode[`${current.getHours()}`];
      const [weatherSymbol] = weatherCodes.filter((code) => {
        const object = code.weatherCode.some(
          (symbol) => symbol === currentWeatherCode
        );
        if (object === true) return object;
      });

      weatherContainer.insertAdjacentHTML(
        "afterbegin",
        `<span>${jsonData.hourly.temperature_2m[current.getHours()]}${
          jsonData.hourly_units.temperature_2m
        } (føles som ${
          jsonData.hourly.apparent_temperature[current.getHours()]
        }${
          jsonData.hourly_units.apparent_temperature
        })</span><img class="weather-logo" src=${weatherSymbol.picture}></img>`
      );
    })
    .catch((error) => {
      console.log(error);
      weatherContainer.insertAdjacentHTML(
        "afterbegin",
        `<span>${error}</span>`
      );
    });
}

async function getNews() {
  const newsResponse = await fetch(
   "https://saurav.tech/NewsAPI/top-headlines/category/general/us.json"
  )
    .then((response) => {
      console.log(response);
      if (response.status !== 200) {
        throw new Error(`Could not fetch news update (${response.status})`);
      }
      return response.json();
    })
    .then((data) => {
      const jsonNews = data;
      jsonNews.articles.forEach((article, index) => {
        console.log(article);
        pagetopText.insertAdjacentHTML(
          "afterbegin",
          `<span"><span class="title">${article.author}:</span> ${article.title}.  </span>  `
        );
        if (index === jsonNews.articles.length - 1) {
          pagetopText.classList.add("animated-slide");
          const animated = document.querySelector(".animated-slide");
          animated.style.animationDuration = `${
            jsonNews.articles.length * 15
          }s`;
        }
      });
    })
    .catch((error) => {
      console.log(error);
      pagetopText.insertAdjacentHTML(
        "afterbegin",
        `<span">Breaking news  Breaking news  Breaking news  Breaking news  Breaking news  Breaking news  Breaking news  Breaking news  Breaking news  Breaking news  Breaking news  Breaking news  Breaking news Breaking news Breaking news  Breaking news Breaking news</span>`
      );
    });
}

getNews();

// Position success & failture

function success(position) {
  const [latitude, longitude] = [
    position.coords.latitude,
    position.coords.longitude,
  ];

  getWeather(latitude, longitude);
}

function error() {
  alert(
    "Can't retrieve your position, displaying weather for website home city (Oslo, Norway)"
  );
  getWeather(59.911491, 10.757933);
}

// Time function

const timeFunction = function () {
  const currenttime = new Date();
  current = currenttime;
  const timeFormated = new Intl.DateTimeFormat(`${locale}`, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(currenttime);
  time.innerHTML = `${timeFormated[0].toUpperCase()}${timeFormated.slice(1)}`;
};

// Call intervall timer and time function
setInterval(() => timeFunction(), 60000);
timeFunction();

// Pause animation

function pauseAnimation() {
  pagetopText.classList.toggle("paused");
}

// Open pages in main window

function openPage(event) {
  const link = event.target.closest(".link-container").dataset.link;
  mainWindow.src = `${link}`;
}

// Add eventlisteners

pagetopText.addEventListener("click", pauseAnimation);
sideBarLinks.forEach((container) =>
  container.addEventListener("click", openPage)
);
