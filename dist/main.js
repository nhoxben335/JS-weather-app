/*
    Project: World Weather App
    Developer: 
*/

let longitude = 0;
let latitude = 0;

(function(){
    window.addEventListener("load", ()=> {

        if(navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(position => {
                longitude = position.coords.longitude;
                latitude = position.coords.latitude;

                const weatherAPI = `https://pro.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=e50199458dc5a2419ab73ed5c193ef77&units=metric`;

                // Fetch the API from OpenWeather Map
                fetch(weatherAPI)
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {

                        console.log(data);

                        // City
                        document.querySelector("#city").innerText = data.name + ", " + data.sys.country;

                        // Date
                        var currentDate = new Date();
                        var dayIndex = currentDate.getDay();
                        var monthIndex = currentDate.getMonth();
                        document.querySelector("#date").innerText = convertDay(dayIndex) + " " + currentDate.getDate() + " " + convertMonth(monthIndex);

                        // Weather Icon
                        //document.querySelector("#temp_icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
                        document.querySelector("#temp_icon").src = `assets/icons/${data.weather[0].icon}.svg`;
                        
                        // Current Temperature
                        document.querySelector("#temp-value").innerText = parseInt(data.main.temp);
                        
                        // Weather Status
                        document.querySelector("#temp-status").innerText = data.weather[0].main;

                        // Max Temperature
                        document.querySelector("#temp-value-high").innerText = parseInt(data.main.temp_max);

                        // Min Temperature
                        document.querySelector("#temp-value-low").innerText = parseInt(data.main.temp_min);

                        // Wind Speed
                        document.querySelector("#wind-value").innerText = parseInt(data.wind.speed);

                        // Humidity
                        document.querySelector("#humidity-value").innerText = parseInt(data.main.humidity);

                        // Sunrise
                        let sunrise = data.sys.sunrise;
                        let convertSunrise = new Date(sunrise*1000);
                        document.querySelector("#sunrise-value").innerText = convertSunrise.getHours()+ ":" + convertSunrise.getMinutes();

                        // Sunset
                        let sunset = data.sys.sunset;
                        let convertSunset = new Date(sunset*1000);
                        document.querySelector("#sunset-value").innerText = convertSunset.getHours()+ ":" + convertSunset.getMinutes();

                        // Get hourly forecast for next few hours
                        getHourlyForecastByCity();
                    });
            });

        }

    });

    // Event listener for the textarea.
    const ele = document.getElementById('search');
    ele.addEventListener('keydown', function(e) {
        const keyCode = e.which || e.keyCode;
        if (keyCode === 13 && !e.shiftKey) {
            e.preventDefault();

            const cityWeatherAPI = `https://pro.openweathermap.org/data/2.5/weather?q=${document.querySelector("#search").value}&APPID=e50199458dc5a2419ab73ed5c193ef77&units=metric`;

            fetch(cityWeatherAPI)
            .then(response => {
                return response.json();
            })
            .then(data => {

                // City
                document.querySelector("#city").innerText = data.name + ", " + data.sys.country;

                // Date
                var currentDate = new Date();
                var dayIndex = currentDate.getDay();
                var monthIndex = currentDate.getMonth();
                document.querySelector("#date").innerText = convertDay(dayIndex) + " " + currentDate.getDate() + " " + convertMonth(monthIndex);

                // Weather Icon
                //document.querySelector("#temp_icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
                document.querySelector("#temp_icon").src = `assets/icons/${data.weather[0].icon}.svg`;
                
                // Current Temperature
                document.querySelector("#temp-value").innerText = parseInt(data.main.temp);
                
                // Weather Status
                document.querySelector("#temp-status").innerText = data.weather[0].main;

                // Max Temperature
                document.querySelector("#temp-value-high").innerText = parseInt(data.main.temp_max);

                // Min Temperature
                document.querySelector("#temp-value-low").innerText = parseInt(data.main.temp_min);

                // Wind Speed
                document.querySelector("#wind-value").innerText = parseInt(data.wind.speed);

                // Humidity
                document.querySelector("#humidity-value").innerText = parseInt(data.main.humidity);

                // Sunrise
                let sunrise = data.sys.sunrise;
                let convertSunrise = new Date(sunrise*1000);
                document.querySelector("#sunrise-value").innerText = convertSunrise.getHours()+ ":" + convertSunrise.getMinutes();

                // Sunset
                let sunset = data.sys.sunset;
                let convertSunset = new Date(sunset*1000);
                document.querySelector("#sunset-value").innerText = convertSunset.getHours()+ ":" + convertSunset.getMinutes();

                // Get hourly forecast for next few hours
                getHourlyForecast();
                document.querySelector("#search").value = "";
            });
        }
    });

    // Function to get hourly forecast.
    function getHourlyForecast() {
        const forecastAPI = `https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${document.querySelector("#search").value}&APPID=e50199458dc5a2419ab73ed5c193ef77&units=metric`;

        fetch(forecastAPI)
        .then(response => {
            return response.json();
        })
        .then(data => {

            // Map the required data.
            const mappedData = data.list.map(function (item) {
                return [item.dt_txt, item.main.temp, item.weather[0].icon];
            });

            // Filter the mapped data.
            var weatherDate = new Date();
            const filterData = mappedData.filter(function (item) {
                return item[0].includes(`${weatherDate.getFullYear()}-${monthValue(weatherDate)}-${dateValue(weatherDate)}`);
            });

            // Grid 1
            let index1 = 6;
            let timeString1 = filterData[index1][0];
            let formatTime1 = timeString1.substring(11, timeString1.length-3);
            document.querySelector("#time1").innerText = formatTime1;
            document.querySelector("#time1-temp-icon").src = `assets/icons/${filterData[index1][2]}.svg`
            document.querySelector("#time1-temp").innerText = parseInt(filterData[index1][1]);

            // Grid 2
            let index2 = 7;
            let timeString2 = filterData[index2][0];
            let formatTime2 = timeString2.substring(11, timeString2.length-3);
            document.querySelector("#time2").innerText = formatTime2;
            document.querySelector("#time2-temp-icon").src = `assets/icons/${filterData[index2][2]}.svg`
            document.querySelector("#time2-temp").innerText = parseInt(filterData[index2][1]);

            // Grid 3
            let index3 = 8;
            let timeString3 = filterData[index3][0];
            let formatTime3 = timeString3.substring(11, timeString3.length-3);
            document.querySelector("#time3").innerText = formatTime3;
            document.querySelector("#time3-temp-icon").src = `assets/icons/${filterData[index3][2]}.svg`
            document.querySelector("#time3-temp").innerText = parseInt(filterData[index3][1]);

            // Grid 4
            let index4 = 9;
            let timeString4 = filterData[index4][0];
            let formatTime4 = timeString4.substring(11, timeString4.length-3);
            document.querySelector("#time4").innerText = formatTime4;
            document.querySelector("#time4-temp-icon").src = `assets/icons/${filterData[index4][2]}.svg`
            document.querySelector("#time4-temp").innerText = parseInt(filterData[index4][1]);

            // Grid 5
            let index5 = 10;
            let timeString5 = filterData[index5][0];
            let formatTime5 = timeString5.substring(11, timeString5.length-3);
            document.querySelector("#time5").innerText = formatTime5;
            document.querySelector("#time5-temp-icon").src = `assets/icons/${filterData[index5][2]}.svg`
            document.querySelector("#time5-temp").innerText = parseInt(filterData[index5][1]);

            // Grid 6
            let index6 = 11;
            let timeString6 = filterData[index6][0];
            let formatTime6 = timeString6.substring(11, timeString6.length-3);
            document.querySelector("#time6").innerText = formatTime6;
            document.querySelector("#time6-temp-icon").src = `assets/icons/${filterData[index6][2]}.svg`
            document.querySelector("#time6-temp").innerText = parseInt(filterData[index6][1]);
        });
    }

    // Function to get hourly forecast.
    function getHourlyForecastByCity() {

        const forecastAPI = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${latitude}&lon=${longitude}&APPID=e50199458dc5a2419ab73ed5c193ef77&units=metric`;

        fetch(forecastAPI)
        .then(response => {
            return response.json();
        })
        .then(data => {

            console.log('hourly forecast');
            console.log(data);

            // Map the required data.
            const mappedData = data.list.map(function (item) {
                return [item.dt_txt, item.main.temp, item.weather[0].icon];
            });

            // Filter the mapped data.
            var weatherDate = new Date();
            console.log('date: ' + weatherDate.getDate());
            const filterData = mappedData.filter(function (item) {
                return item[0].includes(`${weatherDate.getFullYear()}-${monthValue(weatherDate)}-${dateValue(weatherDate)}`);
            });

            // Grid 1
            let index1 = 6;
            let timeString1 = filterData[index1][0];
            let formatTime1 = timeString1.substring(11, timeString1.length-3);
            document.querySelector("#time1").innerText = formatTime1;
            document.querySelector("#time1-temp-icon").src = `assets/icons/${filterData[index1][2]}.svg`
            document.querySelector("#time1-temp").innerText = parseInt(filterData[index1][1]);

            // Grid 2
            let index2 = 7;
            let timeString2 = filterData[index2][0];
            let formatTime2 = timeString2.substring(11, timeString2.length-3);
            document.querySelector("#time2").innerText = formatTime2;
            document.querySelector("#time2-temp-icon").src = `assets/icons/${filterData[index2][2]}.svg`
            document.querySelector("#time2-temp").innerText = parseInt(filterData[index2][1]);

            // Grid 3
            let index3 = 8;
            let timeString3 = filterData[index3][0];
            let formatTime3 = timeString3.substring(11, timeString3.length-3);
            document.querySelector("#time3").innerText = formatTime3;
            document.querySelector("#time3-temp-icon").src = `assets/icons/${filterData[index3][2]}.svg`
            document.querySelector("#time3-temp").innerText = parseInt(filterData[index3][1]);

            // Grid 4
            let index4 = 9;
            let timeString4 = filterData[index4][0];
            let formatTime4 = timeString4.substring(11, timeString4.length-3);
            document.querySelector("#time4").innerText = formatTime4;
            document.querySelector("#time4-temp-icon").src = `assets/icons/${filterData[index4][2]}.svg`
            document.querySelector("#time4-temp").innerText = parseInt(filterData[index4][1]);

            // Grid 5
            let index5 = 10;
            let timeString5 = filterData[index5][0];
            let formatTime5 = timeString5.substring(11, timeString5.length-3);
            document.querySelector("#time5").innerText = formatTime5;
            document.querySelector("#time5-temp-icon").src = `assets/icons/${filterData[index5][2]}.svg`
            document.querySelector("#time5-temp").innerText = parseInt(filterData[index5][1]);

            // Grid 6
            let index6 = 11;
            let timeString6 = filterData[index6][0];
            let formatTime6 = timeString6.substring(11, timeString6.length-3);
            document.querySelector("#time6").innerText = formatTime6;
            document.querySelector("#time6-temp-icon").src = `assets/icons/${filterData[index6][2]}.svg`
            document.querySelector("#time6-temp").innerText = parseInt(filterData[index6][1]);
        });
    }

    // Function to convert day index to the name.
    function convertDay(index) {
        if(index === 0)
        {
            return "Sunday";
        } 
        else if(index === 1)
        {
            return "Monday";
        } 
        else if(index === 2) 
        {
            return "Tuesday"
        }
        else if(index === 3) 
        {
            return "Wednesday"
        }
        else if(index === 4) 
        {
            return "Thursday"
        }
        else if(index === 5) 
        {
            return "Friday"
        }
        else if(index === 6) 
        {
            return "Saturday"
        }
    }

    // Function to convert month index to the name.
    function convertMonth(index) {
        if(index === 0)
        {
            return "January";
        } 
        else if(index === 1)
        {
            return "February";
        } 
        else if(index === 2) 
        {
            return "March"
        }
        else if(index === 3) 
        {
            return "April"
        }
        else if(index === 4) 
        {
            return "May"
        }
        else if(index === 5) 
        {
            return "June"
        }
        else if(index === 6) 
        {
            return "July"
        }
        else if(index === 7) 
        {
            return "August"
        }
        else if(index === 8) 
        {
            return "September"
        }
        else if(index === 9) 
        {
            return "October"
        }
        else if(index === 10) 
        {
            return "November"
        }
        else if(index === 11) 
        {
            return "December"
        }
    }

    // Function to add leading 0's to date.
    function dateValue(d) { 
        return (d.getDate() < 10 ? '0' : '') + d.getDate();
    }

    // Function to add leading 0's to month.
    function monthValue(d) { 
        return ((d.getMonth()+1) < 10 ? '0' : '') + (d.getMonth()+1);
    }

})();