// 		RZHEVSKI ROBOTICS
// 	     Web-development

// Type: JavaScript
// File: core.js
// Project name: garder_robotic
// Developer: Alexey Fedorov S.


// ===================== CONSTANTS =========================
const APP_HOST = "192.168.2.203"

// A function for sending GET with a parameter in data
function ajax_getParametr(parameter,target_humidity,lighting_from_hours,lighting_to_hours,reciever) {
	return $.ajax({
		url : 'http://'+APP_HOST+'/param',
		type : 'GET',
		data: {
			"parameter" : parameter,
			"target_humidity" : target_humidity,
			"lighting_from_hours" : lighting_from_hours,
			"lighting_to_hours": lighting_to_hours,
		},
		headers: {
			'Access-Control-Allow-Origin': '*',
		},

		contentType: 'application/json; charset=utf-8',

		'success' : function(data) {
				let js = JSON.stringify(data);
				reciever.value = js;
		},

		'error': function(xhr,error){
			let answer = {errorText : error,
						  status: xhr.status};
			reciever.value = answer;
		},	
	});
}