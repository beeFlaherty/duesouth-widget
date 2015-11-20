	(function() {
		'use strict';



		var timezone = function() {

				var timezoneElements = document.querySelectorAll("[data-timezone]");

				console.log(timezoneElements);

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
							console.log(timezone);

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
						var remainingTime = currentDate - startDate - DAY;

						if (remainingTime < 0) remainingTime = 0;

						var days = parseInt(remainingTime / DAY);
						remainingTime = remainingTime % DAY;

						var hours = parseInt(remainingTime / HOUR);
						remainingTime = remainingTime % HOUR;

						var minutes = parseInt(remainingTime / MINUTE);
						remainingTime = remainingTime % MINUTE;

						var seconds = parseInt(remainingTime / SECOND);

						document.getElementById(UniqueID).innerHTML = days + ' days ' + hours + ' hours ' + minutes + ' min ' + seconds;
						//set data here
					};

					for (var i in countDownElements) {
						if (countDownElements.hasOwnProperty(i)) {

							var startDate = new Date(countDownElements[i].getAttribute('data-countdown'));
							var UniqueID = "timer_" + new Date().getTime().toString();
							countDownElements[i].id = UniqueID;

							if (isNaN(startDate.getTime())) {
								return false; // Only proceed if we have a current date
							}

							setInterval(update, SECOND, UniqueID);
						}

					}
				}

			},

			weather = function() {

				var weatherElements = document.querySelectorAll("[data-cityId]");

				var updateWeather = function(data) {
					console.log('boom');
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
						console.log ('error');
					}
				};

				var loadCheck = function() {
								if (xhr.status === 200 ) {
									alert('Something went wrong.');
								} else if (xhr.status !== 200) {
									alert('Request failed.  Returned status of ' + xhr.status);
								}
							};

				if (weatherElements.length) {

					for (var i in weatherElements) {
						if (weatherElements.hasOwnProperty(i)) {
							var cityId = weatherElements[i].getAttribute('data-cityId');
							console.log(cityId);
							var UniqueID = "weather_" + new Date().getTime().toString();
							weatherElements[i].id = UniqueID;

							var xhr = new XMLHttpRequest();
							xhr.open('GET', 'http://api.openweathermap.org/data/2.5/weather?id=' + cityId + '&units=metric&APPID=031b030c6e7ef548c603b40c69fe5cf2&');
							xhr.send(null);
							xhr.onload =  updateWeather();
						}
					}
				}
			},

			calories = function() {
				if ($('*[data-calories]').length) {

				}

			},

			steps = function() {

			};

		timezone();
		countup();
		weather();
		calories();
		steps();


	}());


	/*@cc_on
	(function(f){
	 window.setTimeout =f(window.setTimeout);
	 window.setInterval =f(window.setInterval);
	})(function(f){return function(c,t){var a=[].slice.call(arguments,2);return f(function(){c.apply(this,a)},t)}});
	@*/
