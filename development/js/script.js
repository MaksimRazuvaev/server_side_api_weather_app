var searchInput = document.querySelector("#search-input");
var inputValue = document.querySelector("#input-row");
var listCyties = document.querySelector("#city-list");
var getWeatherCards  = document.getElementsByClassName("weatherForecast");
var apiKey = "f45ab30f7cc57d35b489f8e5ba62489e";


var currentDay = moment().format("L");

var storage = [];
 localStorage.setItem("cityName", JSON.stringify(storage));

// event listener for searh button
searchInput.addEventListener("click", function (event) {
    var element = event.target;

    if (element.matches("#searchBtn")) {
        var searchInputValue = inputValue.value;

        if (!searchInputValue) {
            console.error('Please enter City name');
            return;
        }
        saveCityLocalstorage(searchInputValue);
        displayCityList();
        getServerSideWeatherAPIs(searchInputValue);
        fillUp5DayDayForecast(searchInputValue);
    }
    else if(element.matches(".cityBtn")){
        for (i=0; i<6; i++) {
            var cityName = getWeatherCards[0].children[0];
            cityName.innerHTML = "";
            getWeatherCards[i].children[1].children[0].innerHTML = "";
            getWeatherCards[i].children[1].children[1].innerHTML = "";
            getWeatherCards[i].children[1].children[2].innerHTML = "";
        }
        var btnValue = element.textContent;
        getServerSideWeatherAPIs(btnValue);
    }

});

// Save City's name to the local storage
function saveCityLocalstorage(city){
    var namesList = localStorage.getItem("cityName");
    var cityList = JSON.parse(namesList);
    console.log(cityList + "print from localstorage");
    if(cityList.length == 0){
        storage.push(city);
        localStorage.setItem("cityName", JSON.stringify(storage));
    }else{
        listCyties.innerHTML = "";
        if(!storage.includes(city)){
            storage.push(city);
            localStorage.setItem("cityName", JSON.stringify(storage));
        }
        for(var i=0; i < storage.length; i++) {
            if(storage.includes(city)){
                i++;
            }else {
            // display city list buttons
            var newLi = document.createElement("li");
            var newBtn = document.createElement("button");

            listCyties.append(newLi);
            newLi.append(newBtn);
            newBtn.textContent = storage[i];
            }
        }
    }
}
// to display City List from local storage
function displayCityList(){
    var namesList = localStorage.getItem("cityName");
    var cityList = JSON.parse(namesList);
    for(var i=0; i < cityList.length; i++) {
        // display city list buttons
        var newLi = document.createElement("li");
        var newBtn = document.createElement("button");
        newBtn.classList.add("cityBtn");
        listCyties.append(newLi);
        newLi.append(newBtn);
        newBtn.textContent = cityList[i];
    }
}

// request city lat amd lot. This is key function to start request APIs
function getServerSideWeatherAPIs(cityName){
    var cityLatLonAPI = "https://api.openweathermap.org/geo/1.0/direct?limit=1&appid=f45ab30f7cc57d35b489f8e5ba62489e&q=";
    var currentWeatherAPI = "https://api.openweathermap.org/data/2.5/weather?&appid=f45ab30f7cc57d35b489f8e5ba62489e";
    var forecastWeatherAPI = "https://api.openweathermap.org/data/2.5/forecast?&appid=f45ab30f7cc57d35b489f8e5ba62489e&cnt=5";

    // to request city lat & lon server side API
    cityLatLonAPI = cityLatLonAPI + cityName;
    console.log(cityLatLonAPI);
    fetch(cityLatLonAPI)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (result) {
        console.log(result);
      // write query to page so user knows what they are viewing
      inputValue.textContent = result.name;

      if (result.length == 0) {
        console.log('No results found!');
        getWeatherCards[0].children[0].innerHTML = 'No city found, search again!';
      } else {
        var cityLat = "&lat=" + result[0].lat;
        var cityLon = "&lon=" + result[0].lon;
        currentWeatherAPI = currentWeatherAPI +  cityLat + cityLon;

        forecastWeatherAPI = forecastWeatherAPI +  cityLat + cityLon;

        getCurrentDayAPI(currentWeatherAPI);
        get5DayForecastAPI(forecastWeatherAPI);
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}

 // to get today forecast API request
 function getCurrentDayAPI(currentWeatherAPI) {
    fetch(currentWeatherAPI)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (result) {
      // write query to page so user knows what they are viewing
      if (result.length == 0) {
        console.log('No results found!');
        getWeatherCards.children(0).innerHTML = 'No forecast found, search again!';
      } else {
        fillUpCurrentDayForecast(result);
      }
    })
    .catch(function (error) {
      console.error(error);
    });
 }

  // to get 5-day forecast API request
  function get5DayForecastAPI(currentWeatherAPI) {
    fetch(currentWeatherAPI)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (result) {
      // write query to page so user knows what they are viewing
      if (result.length == 0) {
        console.log('No results found!');
        getWeatherCards.children(0).innerHTML = 'No forecast found, search again!';
      } else {
        fillUp5DayDayForecast(result);
      }
    })
    .catch(function (error) {
      console.error(error);
    });
 }

// Fill up current day weather forecast
function fillUpCurrentDayForecast(currentWeatherAPI){
    console.log(getWeatherCards[0].children);
    console.log(getWeatherCards[0].childNodes);

    var cityName = getWeatherCards[0].children[0];
    var cityTemp = getWeatherCards[0].children[1].children[0];
    var cityWind = getWeatherCards[0].children[1].children[1];
    var cityHumidity = getWeatherCards[0].children[1].children[2];

    cityName.innerHTML = currentWeatherAPI.name + " (" + currentDay + ")";

    var tempAPI = currentWeatherAPI.main.temp;
    tempAPI = ((tempAPI-273.15)*1.8)+32;
    tempAPI = tempAPI.toFixed(2);
    var tempToDisplay = tempAPI + " F";
    cityTemp.textContent = tempToDisplay;
    cityWind.innerHTML = currentWeatherAPI.wind.speed + " MPH";
    cityHumidity.innerHTML = currentWeatherAPI.main.humidity + " %";
}

// Fill up 5-day weather forecast
function fillUp5DayDayForecast(currentWeatherAPI){
    for (i=0; i<5; i++) {
        var cityName = getWeatherCards[i+1].children[0];
        var setDay = moment().add(i+1, 'days').format("L");
        cityName.innerHTML = "(" + setDay + ")";
        var tempAPI = currentWeatherAPI.list[i].main.temp;
        tempAPI = ((tempAPI-273.15)*1.8)+32;
        tempAPI = tempAPI.toFixed(2);
        var tempToDisplay = tempAPI + " F";
        getWeatherCards[i+1].children[1].children[0].innerHTML = tempToDisplay;
        getWeatherCards[i+1].children[1].children[1].innerHTML = currentWeatherAPI.list[i].wind.speed + " MPH";
        getWeatherCards[i+1].children[1].children[2].innerHTML = currentWeatherAPI.list[i].main.humidity;
    }
}