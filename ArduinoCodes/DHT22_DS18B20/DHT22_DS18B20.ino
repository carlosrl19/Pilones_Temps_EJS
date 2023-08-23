#include <SoftwareSerial.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <DHT.h>

#define ONE_WIRE_BUS 10
#define DHTPIN 2
#define DHTTYPE DHT22

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
DeviceAddress insideThermometer;

DHT dht(DHTPIN, DHTTYPE);

int buzzer = 8;

void setup() {
  Serial.begin(9600);

  sensors.begin();

  if (!sensors.getAddress(insideThermometer, 0)) {
    Serial.println("No se encontró la dirección del dispositivo");
  }

  Serial.print("Dirección dispositivo: ");
  printAddress(insideThermometer);
  Serial.println();

  sensors.setResolution(insideThermometer, 9);

  pinMode(buzzer, OUTPUT);

  dht.begin();
}

void printTemperature(DeviceAddress deviceAddress)
{
  sensors.requestTemperatures();
  float tempC = sensors.getTempC(insideThermometer);
  if (tempC == DEVICE_DISCONNECTED_C) 
  {
    Serial.print("Error: No se puede leer la temperatura");
    Serial.println();
    return;
  }

  float humidity = dht.readHumidity();

  Serial.print("Temperatura: ");
  Serial.print(tempC);
  Serial.print(" C, Humedad: ");
  Serial.print(humidity);
  Serial.print(" %");
  Serial.println();

  if (tempC > 30) {
    digitalWrite(buzzer, HIGH);
  } else {
    digitalWrite(buzzer, LOW);
  }
}

void loop() {
  printTemperature(insideThermometer);
  delay(2000);
}

void printAddress(DeviceAddress deviceAddress)
{
  for (uint8_t i = 0; i < 8; i++)
  {
    if (deviceAddress[i] < 16) Serial.print("0");
    Serial.print(deviceAddress[i], HEX);
  }
}