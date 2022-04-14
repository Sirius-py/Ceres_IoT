#include <Arduino.h>
#include <SPI.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include "Adafruit_SHT31.h"

Adafruit_SHT31 sht31 = Adafruit_SHT31();

// Credenciales de tu red Wi-Fi
const char *ssid = "Juan Jose";
const char *password = "pacoymono";

// Credenciales de tu servidor MQTT
const char *mqtt_server = "test.mosquitto.org";
const char *mqtt_username = "rw";
const char *mqtt_password = "readwrite";
const int mqtt_port = 1883;

// Tópicos
const char *topic1 = "esp32/temperatura";
const char *topic2 = "esp32/humedad";
const char *topic3 = "esp32/distancia";

// Variables
WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
int value = 0;
const int ledPin = 2;
float t = 0;
float h = 0;
const int Trigger = 5;
const int Echo = 18;

// PWM config
const int pwmPin = 4;
const int freq = 5000;
const int ledChannel = 0;
const int ledChannel2 = 0;
const int resolution = 8;
String slider_value = "0";

//Tanque
#define ledfull  16
#define ledmiddle  17
#define ledlow  18
#define bombaon  25
#define bombaoff 12


void callback(char *topic, byte *message, unsigned int length)
{
  Serial.print("Llegó un mensaje del tópico: ");
  Serial.print(topic);
  Serial.print(". Mensaje: ");
  String messageTemp;

  for (int i = 0; i < length; i++)
  {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  Serial.println();

  if (String(topic) == "esp32/LED")
  {
    Serial.print("Changing output to ");
    if (messageTemp == "on")
    {
      Serial.println("Led encendido");
      digitalWrite(ledPin, HIGH);
    }
    else if (messageTemp == "off")
    {
      Serial.println("Led apagado");
      digitalWrite(ledPin, LOW);
    }
  
  //nivel y bomba del tanque
  }
  if (String(topic) == "esp32/PWM")
  {
    if (messageTemp >"50"){
    digitalWrite(ledfull, HIGH);
    digitalWrite(ledmiddle, LOW);
    digitalWrite(ledlow, LOW);
    
    }
    
    if(messageTemp >"90"){
      digitalWrite(bombaoff,HIGH);
      digitalWrite(bombaon,LOW);
    }

    if(messageTemp <= "50"){
    digitalWrite(ledmiddle, HIGH);
    digitalWrite(ledfull, LOW);
    digitalWrite(ledlow, LOW);
    }

    if(messageTemp == "0" ){
    digitalWrite(ledmiddle, LOW);
    digitalWrite(ledfull, LOW);
     digitalWrite(ledlow, HIGH);
    digitalWrite(bombaon, HIGH);
    digitalWrite(bombaoff,LOW);
    }
    
  

  }

  Serial.println();
}

void setup_wifi()
{

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Conectándose a: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.print("Dirección IP del ESP32: ");
  Serial.print(WiFi.localIP());
  Serial.println("");
}

void setup()
{
  Serial.begin(9600);
  pinMode(Trigger, OUTPUT);
  pinMode(Echo, INPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(ledfull,OUTPUT);
  pinMode(ledmiddle,OUTPUT);
  pinMode(ledlow,OUTPUT);
  pinMode(bombaoff,OUTPUT);
  pinMode(bombaon,OUTPUT);

//definir
 digitalWrite(ledmiddle, LOW);
    digitalWrite(ledfull, LOW);
    digitalWrite(ledlow, LOW);
    digitalWrite(bombaoff, LOW);
    digitalWrite(bombaon, LOW);

  ledcSetup(ledChannel, freq, resolution); // PWM setup
  ledcAttachPin(pwmPin, ledChannel);
  ledcWrite(ledChannel, slider_value.toInt());


  


  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  /*if (!sht31.begin(0x44))
  {
    Serial.println("No se pudo encontrar el SHT31");
    while (1)
      delay(1);
  }*/
}

void reconnect()
{
  // Loop until we're reconnected
  while (!client.connected())
  {
    String client_id = "esp32-client-";
    client_id += String(WiFi.macAddress());
    Serial.print("Intentando conexión MQTT..");
    // Attempt to connect
    if (client.connect(client_id.c_str(), mqtt_username, mqtt_password))
    {
      Serial.println("¡conectado!");
      client.subscribe("esp32/LED");
      client.subscribe("esp32/PWM");
    }
    else
    {
      Serial.print("falló, rc=");
      Serial.print(client.state());
      Serial.println(" intentar otra vez en 5 segundos");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void loop()
{
  long time;
  float distance;

  if (!client.connected())
  {
    reconnect();
  }
  client.loop();

  long now = millis();
  if (now - lastMsg > 5000)
  {
    lastMsg = now;
    /*
    t = sht31.readTemperature(); // Convertir la variable t de float a char
    char tempString[8];
    dtostrf(t, 1, 2, tempString);
    Serial.print("Temperatura: ");
    Serial.print(tempString);
    Serial.print(" °C");
    Serial.println("");
    client.publish(topic1, tempString);

    h = sht31.readHumidity(); // Convertir la variable h de float a char
    char humString[8];
    dtostrf(h, 1, 2, humString);
    Serial.print("Humedad: ");
    Serial.print(humString);
    Serial.print(" %");
    Serial.println("");
    delay(1000);
    client.publish(topic2, humString);
  */
    digitalWrite(Trigger, HIGH);
    delayMicroseconds(10); // Enviamos un pulso de 10us
    digitalWrite(Trigger, LOW);

    time = pulseIn(Echo, HIGH); // Obtenemos el ancho del pulso
    distance = time * 0.034 / 2;

    char distanceString[8];
    dtostrf(distance, 1, 2, distanceString);
    Serial.print("Distancia: ");
    Serial.print(distanceString);
    Serial.print(" cm");
    Serial.println("");
    delay(1000);
    client.publish(topic3, distanceString);
  }
}