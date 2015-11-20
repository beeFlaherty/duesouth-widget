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

				console.log(countDownElements);

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

					var update = function() {
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

						countDownElements[i].update(days + ' days ' + hours + ' hours ' + minutes + ' min ' + seconds);
						console.log( days + ' days ' + hours + ' hours ' + minutes + ' min ' + seconds);
						//give temp id to element

						$(self).find('.days').html(uniformNumber(days));
						$(self).find('.hours').html(uniformNumber(hours));
						$(self).find('.minutes').html(uniformNumber(minutes));
						$(self).find('.seconds').html(uniformNumber(seconds));
					};

					for (var i in countDownElements) {
						if (countDownElements.hasOwnProperty(i)) {

							var startDate = new Date(countDownElements[i].getAttribute('data-countdown'));

							
							if (isNaN(startDate.getTime())) {
								return false; // Only proceed if we have a current date
							}

							var self = this;

							update();
							setInterval(update, SECOND);
						}

					}
				}

			},

			weather = function() {


				if ($('*[data-cityId]').length) {

					$('*[data-cityId]').each(function() {
						var self = this;
						var cityId = $(this).data('cityid');

						var error = function error() {
							$(self).hide();
						};

						var updateWeather = function(data) {
							try {
								var status = data.weather[0].description;
								var code = data.weather[0].icon;
								var temperature = Math.round(data.main.temp);
								var wind_speed = data.wind.speed;
								//var wind_dir = data.wind.deg;

								$(self).find('.status').html(status);
								$(self).find('.code').addClass('icon_' + code);
								$(self).find('.temperature').html(temperature + '&deg;C');
								$(self).find('.wind_speed').html(wind_speed);
								//$(self).find('.wind_dir').html(wind_dir); 
							} catch (e) {
								error();
							}
						};

						$.ajax({
							url: "http://api.openweathermap.org/data/2.5/weather",
							jsonp: "callback",
							dataType: "jsonp",
							data: {
								'id': cityId,
								'units': 'metric',
								'APPID': '031b030c6e7ef548c603b40c69fe5cf2'
							},
							success: updateWeather,
							error: error
						});
					});
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
