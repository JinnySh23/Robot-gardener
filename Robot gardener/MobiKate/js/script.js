// 		RZHEVSKI ROBOTICS
// 	     Web-development

// Type: JavaScript
// File: script.js
// Project name: garder_robotic
// Developer: Alexey Fedorov

// ======================= FLAGS ===========================
let watering_relay_status = false;
let light_relay_status = false;

let pr = 0;
// ---------------------------------------------------------
// 
//                       Sliders
// 
// ---------------------------------------------------------
let slider1 = document.getElementById("range-one");
let one = document.getElementById("one");
one.innerHTML = slider1.value;

slider1.oninput = function () {
    one.innerHTML = this.value;
}

let slider2 = document.getElementById("range-two");
let two = document.getElementById("two");
two.innerHTML = slider2.value;

slider2.oninput = function () {
    two.innerHTML = this.value;
}

let slider3 = document.getElementById("range-three");
let three = document.getElementById("three");
three.innerHTML = slider3.value;

slider3.oninput = function () {
    three.innerHTML = this.value;
}

// LOADING A WEB PAGE
$(document).ready(function() {

    // Get humidity in the background
	let reqInfo = {value : 0};
	let getRequestHumidity = ajax_getParametr("get_humidity","","","",reqInfo);

	// If the request is successful
	getRequestHumidity.done(function(){
        let data = JSON.parse(reqInfo.value);
        pr = data.parameter_answer;

        const circle = document.querySelector('.progress-ring__circle');
        const radius = circle.r.baseVal.value;

        const circumference = 2 * Math.PI * radius;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;

        function setProgress(percent) {
            const offset = circumference - percent / 100 * circumference;
            circle.style.strokeDashoffset = offset;
        }

        setProgress(pr);
        document.getElementById("progress-fon__persent").innerHTML = pr;
    });

	// If the request is not successful
	getRequestHumidity.fail(function(){

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
                $("#button-watering-relay").html('<img src="img/Watering.svg" /><span>off</span>');
                watering_relay_status = false;
            });
    
            // If the request is not successful
            getRequest.fail(function(){
                console.log("Error!");
                // alert("Проверьте подключение к сети!");
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
                $("#button-watering-relay").html('<img src="img/Watering.svg" /><span>on</span>');
                $('#button-watering-relay').addClass('button-off-on-active');
            });
    
            // If the request is not successful
            getRequest.fail(function(){
                console.log("Error!");
                // alert("Проверьте подключение к сети!");
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
                $("#button-watering-relay").html('<img src="img/Light.svg" /><span>off</span>');
                light_relay_status = false;
            });
    
            // If the request is not successful
            getRequest.fail(function(){
                console.log("Error!");
                // alert("Проверьте подключение к сети!");
            });
        }
        
        else{
            let reqInfo = {value : 0};
            let getRequest = ajax_getParametr("light_relay_on","","","",reqInfo);
    
            // If the request is successful
            getRequest.done(function(){
                console.log("Succes!");
                $("#button-watering-relay").html('<img src="img/Light.svg" /><span>on</span>');
                $('#button-watering-relay').addClass('button-off-on-active');
                light_relay_status = true;
            });
    
            // If the request is not successful
            getRequest.fail(function(){
                console.log("Error!");
                // alert("Проверьте подключение к сети!");
            });
        }
        return false;
    });

     //Setting User Values
	$("#button-set").click(function(){

        target_humidity = $("#range-one").val();
        lighting_from_hours = $("#range-two").val();
        lighting_to_hours = $("#range-container").val();

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
                // $("#box-container-button-light").html('<button id="button-light-relay">OFF</button>');
            });
    
            // If the request is not successful
            getRequest.fail(function(){
                console.log("Error!");
                alert("Проверьте подключение к сети!");
            });
		return false;
    });
});