	(function() {
		'use strict';



		var timezone = function() {

				var timezoneElements = document.querySelectorAll("[data-timezone]");

				if (timezoneElements.length) {
					var
						SECOND = 1000,
						MINUTE = 60 * SECOND,
						HOUR = 60 * MINUTE,
						DAY = 24 * HOUR;

					var uniformNumber = function(n) {
						if (n < 10) n = '0' + n;

						return n;
					};

					for (var i in timezoneElements) {
						if (timezoneElements.hasOwnProperty(i)) {
							var timezone = parseInt(timezoneElements[i].getAttribute('data-timezone'));
							var currentTime = new Date();
							var offsetTime = currentTime.getTime();
							offsetTime += currentTime.getTimezoneOffset() * MINUTE; // Get UTC
							offsetTime += timezone * HOUR; // Add timezone offset
							offsetTime = new Date(offsetTime); // Convert back to date

							timezoneElements[i].innerHTML = uniformNumber(offsetTime.getHours()) + ':' + uniformNumber(offsetTime.getMinutes());
						}
					}
				}
			},

			countup = function() {

				var countDownElements = document.querySelectorAll("[data-countdown]");

				if (countDownElements.length) {
					var
						SECOND = 1000,
						MINUTE = 60 * SECOND,
						HOUR = 60 * MINUTE,
						DAY = 24 * HOUR;

					var uniformNumber = function(n) {
						if (n < 10) n = '0' + n;

						return n;
					};

					var update = function(UniqueID) {
						var currentDate = new Date();
						var duration = currentDate - startDate - DAY;

						if (duration < 0) duration = 0;


						var minutesForEffort = Math.floor((duration / 1000) / 60);
						document.getElementById(UniqueID).setAttribute('data-alapsed', minutesForEffort);

						var days = parseInt(duration / DAY);
						duration = duration % DAY;

						var hours = parseInt(duration / HOUR);
						duration = duration % HOUR;

						var minutes = parseInt(duration / MINUTE);
						duration = duration % MINUTE;

						var seconds = parseInt(duration / SECOND);

						document.getElementById(UniqueID).innerHTML = days + ' days ' + hours + ' hours ' + minutes + ' min ' + seconds;
						//set data here
					};



					for (var i in countDownElements) {
						if (countDownElements.hasOwnProperty(i)) {

							var startDate = new Date(countDownElements[i].getAttribute('data-countdown'));
							var UniqueID = "timer_" + new Date().getTime().toString();

							if (!countDownElements[i].id) {
								countDownElements[i].id = UniqueID;
							}

							var elementID = countDownElements[i].id;

							if (isNaN(startDate.getTime())) {
								return false; // Only proceed if we have a current date
							}

							setInterval(update, SECOND, elementID);

							var effortID = elementID + '-effort';

							if (document.getElementById(effortID)) {
								setInterval(effort, SECOND, elementID, effortID);
							}
						}

					}
				}

			},

			weather = function() {

				var weatherElements = document.querySelectorAll("[data-cityId]");
				var onJsonLoad = function(xhr) {
					if (xhr.readyState == 4 && xhr.status == 200) {
						var myArr = JSON.parse(xhr.responseText);
						updateWeather(myArr);
					}
				};
				var updateWeather = function(data) {

					try {
						var status = data.weather[0].description;
						var code = data.weather[0].icon;
						var temperature = Math.round(data.main.temp);
						var wind_speed = data.wind.speed;
						//var wind_dir = data.wind.deg;

						document.querySelector("#" + weatherElements[i].id + " > .status").innerHtml = status;
						document.querySelector("#" + weatherElements[i].id + " > .temperature").innerHtml = temperature + '&deg;C';
						document.querySelector("#" + weatherElements[i].id + " > .wind_speed").innerHtml = wind_speed;
						//$(self).find('.wind_dir').html(wind_dir); 
					} catch (e) {
						console.log('error');
					}
				};

				if (weatherElements.length) {

					for (var i in weatherElements) {
						if (weatherElements.hasOwnProperty(i)) {
							//this may need to be switched to latlong
							var cityId = weatherElements[i].getAttribute('data-cityId');
							var UniqueID = "weather_" + new Date().getTime().toString();
							weatherElements[i].id = UniqueID;

							var xhr = new XMLHttpRequest();
							var url = 'http://api.openweathermap.org/data/2.5/weather?id=' + cityId + '&units=metric&APPID=031b030c6e7ef548c603b40c69fe5cf2&';


							xhr.onreadystatechange = onJsonLoad(xhr);

							xhr.open('GET', url, true);
							xhr.send();
						}
					}
				}
			},

			effort = function(timeID, effortID) {

				console.log(timeID + ', ' + effortID);

				var calorieContainer = document.querySelector("#" + effortID + " > p .calories");
				var calorieRate = calorieContainer.getAttribute('data-calories') / 1440;
				var calorieID = "cal_" + new Date().getTime().toString();
				calorieContainer.id = calorieID;

				var stepsContainer = document.querySelector("#" + effortID + " > p .steps");

				var stepsRate = stepsContainer.getAttribute('data-steps') / 1440;
				var stepID = "step_" + new Date().getTime().toString();
				stepsContainer.id = stepID;
				
				var timeAlapsed = document.getElementById(timeID).getAttribute('data-alapsed');

				var caloriesBurnt = numberWithCommas(Math.round(calorieRate * timeAlapsed));

				var stepsTaken = numberWithCommas(Math.round(stepsRate * timeAlapsed));

				//set to display
				document.getElementById(calorieID).innerHTML = caloriesBurnt;
				document.getElementById(stepID).innerHTML = stepsTaken;
			};

		function numberWithCommas(x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}

		timezone();
		countup();
		weather();

	}());


	/*@cc_on
	(function(f){
	 window.setTimeout =f(window.setTimeout);
	 window.setInterval =f(window.setInterval);
	})(function(f){return function(c,t){var a=[].slice.call(arguments,2);return f(function(){c.apply(this,a)},t)}});
	@*/
