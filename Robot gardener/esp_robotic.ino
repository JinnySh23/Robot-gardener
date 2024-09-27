#include <ESP8266WiFi.h>
#include "ESP8266WebServer.h"

// Pin outputs
#define HUMID_SENSOR A0
#define HUMID_SENSOR_POWER D2
#define RELAY_PORT_WATERING D3
#define RELAY_PORT_LIGHT D4

// Server accesses
ESP8266WebServer server(80);
const char* ssid = "WIFI_SSID";
const char* password = "WIFI_PASSWORD";

// Variable for sensor calibration
// int very_moist_value = 0;

// If already calibrated
// int very_moist_value = 185;

int coefficient_humidity = 8;
int target_humidity_analog = 185;
int target_humidity_percent = 100;
int i_watering = 0;
int i_lighting = 0;
int i_user_lighting = 0;
unsigned int delay_user_lighting = 0;
unsigned int delay_result_lighting = 0;
unsigned int time_user_lighting = 0;

void setup(){

    Serial.begin(115200);

    //Choose a mode!
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    Serial.print("\nConnecting to "); Serial.println(ssid);
    while (WiFi.status() != WL_CONNECTED){
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nConnected!");
    delay(1000);
    Serial.print("Local IP = ");
    Serial.println(WiFi.localIP());

    // Setting up pins for power supply
    pinMode(HUMID_SENSOR_POWER,OUTPUT);
    pinMode(RELAY_PORT_LIGHT,OUTPUT);
    pinMode(RELAY_PORT_WATERING,OUTPUT);
    digitalWrite(RELAY_PORT_WATERING,HIGH);
    digitalWrite(RELAY_PORT_LIGHT,HIGH);

    // Configuring the server paths
    server.on("/", HTTP_GET, []() {
        server.send(200, "text/html",
            "Welcome to the ESP8266 REST Web Server");
    });
    server.on("/param", HTTP_GET, handleRootPath);
    server.onNotFound(handleNotFound);

    server.begin();                    //Start the server
    Serial.println("Server listening");
}

// MAIN
void loop(){
    server.handleClient();
    delay(500);
    i_watering++;

    // A robot for light
    if(i_user_lighting != 0){
        time_user_lighting = (i_user_lighting *60)*2;
        i_lighting++;
        if(i_lighting == time_user_lighting){
            delay_result_lighting = (delay_user_lighting * 60) *1000;
            digitalWrite(RELAY_PORT_LIGHT,HIGH);
            delay(delay_result_lighting);
            digitalWrite(RELAY_PORT_LIGHT,LOW);
            i_lighting = 0;
        }
    }

    // A robot for watering
    if(i_watering == 1800){
        Serial.println("Hello my friend");
        Serial.println("Сheck the sensor...");
        digitalWrite(HUMID_SENSOR_POWER,HIGH);
        delay(10);
        int humidity_value = analogRead(HUMID_SENSOR);
        digitalWrite(HUMID_SENSOR_POWER,LOW);
        if(humidity_value >= 391){
            Serial.println("The soil is dry, I water it...");
            digitalWrite(RELAY_PORT_WATERING,LOW);
            delay(3000);
            digitalWrite(RELAY_PORT_WATERING,HIGH);
            i_watering = 0;
        }
        Serial.println("The soil is good, see you in a minute.");
        i_watering = 0;
    }
}

// WEB - based management function , GET requests
void handleRootPath(){

    String parameterType = "";
    String parameterTargetHumidity = "";
    String humidity_value_percent_str = "";
    String target_humidity_percent_str = "100 %";
    String answer_value = "{\"parameter_answer\":\"0\"}";

    if(server.argName(0) == "parameter"){
        parameterType = server.arg(0);

        // ===================== Functions ======================== //

        // GETTING THE HUMIDITY VALUE
        if(parameterType == "get_humidity"){
            digitalWrite(HUMID_SENSOR_POWER,HIGH);
            delay(10);
            int humidity_value = analogRead(HUMID_SENSOR);
            digitalWrite(HUMID_SENSOR_POWER,LOW);
            
            // Converting readings to percentages
            int humidity_value_percent = map(humidity_value,target_humidity_analog,1023,target_humidity_percent,0);
            target_humidity_percent_str = "\"" + String(target_humidity_percent) + " %\"}";
            humidity_value_percent_str = "\"" + String(humidity_value_percent) + "\"";
            answer_value = String("{\"parameter_answer\":" + humidity_value_percent_str + "," + "\"parameter_answer_percent\":" + target_humidity_percent_str);
            
            // Debugging an analog for calibration
            // Serial.println(String(humidity_value) + " = ");
            // Serial.println(String(humidity_value_percent) + "%");
        }

        // TURN ON THE PUMP
        else if(parameterType == "watering_relay_on"){
            digitalWrite(RELAY_PORT_WATERING,HIGH);
        }
        // TURN OFF THE PUMP
        else if(parameterType == "watering_relay_off"){
            digitalWrite(RELAY_PORT_WATERING,LOW);
        }
        // TURN ON THE DIODES
        else if(parameterType == "light_relay_on"){
            digitalWrite(RELAY_PORT_LIGHT,HIGH);
        }
        // TURN OFF THE DIODES
        else if(parameterType == "light_relay_off"){
            digitalWrite(RELAY_PORT_LIGHT,LOW);
        }
        else if(parameterType == "set_target_humidity"){
            parameterTargetHumidity = server.arg(1);     //Получается в виде строки
            if(server.arg(2) != ""){
                delay_user_lighting = server.arg(2);
                time_user_lighting = server.arg(3);
            }
            target_humidity_percent = parameterTargetHumidity.toInt();
            target_humidity_analog = 1024 - (target_humidity_percent*8);
        }
        else {
        }
    }
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", answer_value);
}

// Handling error 404
void handleNotFound(){
    if (server.method() == HTTP_OPTIONS){
        server.sendHeader("Access-Control-Allow-Origin", "*");
        server.sendHeader("Access-Control-Max-Age", "10000");
        server.sendHeader("Access-Control-Allow-Methods", "PUT,POST,GET,OPTIONS");
        server.sendHeader("Access-Control-Allow-Headers", "*");
        server.send(204);
    }
    else{
        server.send(404, "text/plain", "");
    }
}
