
"use strict";
// jQuery request
(function() {
	var settings = {
     "url": "https://api-ssl.bitly.com/v4/bitlinks/bit.ly/3bgVO8w/clicks",
     "method": "GET",
    "timeout": 0,
    "headers": {
    "Authorization": "Bearer 63ef42580f0dfc8517612b31d2aa1c9c37cba526"
  },
};

	$.ajax(settings).done(function (response) {
		console.log(response);
		updateUISuccess(response);
	}).fail(function(error) {
		console.log(error);
		updateUIError();	
	});
var bitlink = new Object();


})();