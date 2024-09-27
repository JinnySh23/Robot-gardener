// 		RZHEVSKI ROBOTICS
// 	     Web-development

// Type: JavaScript
// File: me.js
// Project name: garder_robotic
// Developer: Alexey Fedorov S.

// ======================= FLAGS ===========================
let watering_relay_status = false;
let light_relay_status = false;

// LOADING A WEB PAGE
$(document).ready(function() {
    let	target_humidity = "";
    let	lighting_from_hours = "";
    let	lighting_to_hours = "";

    // Get humidity in the background
	let reqInfo = {value : 0};
	let getRequestHumidity = ajax_getParametr("get_humidity","","","",reqInfo);

	// If the request is successful
	getRequestHumidity.done(function(){
        let data = JSON.parse(reqInfo.value);
        if(data.parameter_answer >= 50){
		    $("#div-request-humidity").html('<p class="request-ok">' + data.parameter_answer +'/'+ '</p><p>'+ data.parameter_answer_percent +'</p>');
        }
        else{
            $("#div-request-humidity").html('<p class="request-error">' + data.parameter_answer +'/'+ '</p><p>'+ data.parameter_answer_percent +'</p>');
        }
    });
	// If the request is not successful
	getRequestHumidity.fail(function(){
		$("#div-request-humidity").html('<p class="request-error">err</p>');
    });
    
    // Turn on or off the water
	$("#button-watering-relay").click(function(){
        
        // Checking the button status
        if(watering_relay_status){
            let reqInfo = {value : 0};
            let getRequest = ajax_getParametr("watering_relay_off","","","",reqInfo);
    
            // If the request is successful
            getRequest.done(function(){
                console.log("Succes!");
                $("#button-watering-relay").text('OFF');
                $('#button-watering-relay').toggleClass('relay-on relay-off');
                watering_relay_status = false;
            });
    
            // If the request is not successful
            getRequest.fail(function(){
                console.log("Error!");
                alert("Проверьте подключение к сети!");
            });
            return false;
        }
        
        else{
            let reqInfo = {value : 0};
            let getRequest = ajax_getParametr("watering_relay_on","","","",reqInfo);
    
            // If the request is successful
            getRequest.done(function(){
                console.log("Succes!");
                watering_relay_status = true;
                $("#button-watering-relay").text('ON');
                $('#button-watering-relay').toggleClass('relay-off relay-on');
            });
    
            // If the request is not successful
            getRequest.fail(function(){
                console.log("Error!");
                alert("Проверьте подключение к сети!");
            });
            return false;
        }
    });
    
    // Turn on or off the light
	$("#button-light-relay").click(function(){

        // Checking the button status
        if(light_relay_status){
            let reqInfo = {value : 0};
            let getRequest = ajax_getParametr("light_relay_off","","","",reqInfo);
    
            // If the request is successful
            getRequest.done(function(){
                console.log("Succes!");
                $("#button-light-relay").text('OFF');
                $('#button-light-relay').toggleClass('relay-on relay-off');
                light_relay_status = false;
            });
    
            // If the request is not successful
            getRequest.fail(function(){
                console.log("Error!");
                alert("Проверьте подключение к сети!");
            });
        }
        
        else{
            let reqInfo = {value : 0};
            let getRequest = ajax_getParametr("light_relay_on","","","",reqInfo);
    
            // If the request is successful
            getRequest.done(function(){
                console.log("Succes!");
                $("#button-light-relay").text('ON');
                $('#button-light-relay').toggleClass('relay-off relay-on');
                light_relay_status = true;
            });
    
            // If the request is not successful
            getRequest.fail(function(){
                console.log("Error!");
                alert("Проверьте подключение к сети!");
            });
        }
        return false;
    });

     // Setting User values
	$("#button-set").click(function(){

        target_humidity = $("input[name=target-humidity]").val();
        lighting_from_hours = $("input[name=lighting-from-hours]").val();
        lighting_to_hours = $("input[name=lighting-to-hours]").val();

        // Checking for empty fields
		if(lighting_from_hours != "" && lighting_to_hours == "" || lighting_from_hours == "" && lighting_to_hours != ""){
			console.log("Empty field");
            alert("Диапазон времени необходимо указать полностью!");
            $("input[name=lighting-to-hours]").val('');
            $("input[name=lighting-from-hours]").val('');
			return false;
        }
        
        let reqInfo = {value : 0};
        let getRequest = ajax_getParametr("set_target_humidity",target_humidity,lighting_from_hours,lighting_to_hours,reqInfo);
    
            // If the request is successful
            getRequest.done(function(){
                console.log("Succes!");
                $("#box-container-button-light").html('<button id="button-light-relay">OFF</button>');
            });
    
            // If the request is not successful
            getRequest.fail(function(){
                console.log("Error!");
                alert("Проверьте подключение к сети!");
            });
		return false;
    });
});