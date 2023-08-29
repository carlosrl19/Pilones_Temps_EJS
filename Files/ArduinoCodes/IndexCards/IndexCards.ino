// Librerías necesarias
#include <OneWire.h>
#include <DallasTemperature.h>
#include <SoftwareSerial.h>

// Puerto 10 en Arduino
#define ONE_WIRE_BUS 10

// Configuración para comunicarse con cualquier otro dispositivo OneWire
OneWire oneWire(ONE_WIRE_BUS);

// Pasa nuestra referencia de oneWire al sensor Dallas.  
DallasTemperature sensors(&oneWire);

// Arrays para almacenar la dirección del dispositivo
DeviceAddress insideThermometer;

/*
 * Funciones básicas del programa
 */

void setup() {
  // Configuración del monitor serie
  Serial.begin(9600);

  sensors.begin();

  if (!sensors.getAddress(insideThermometer, 0)) {
    Serial.println("No se encontró la dirección del dispositivo");
  }

  // Imprimir la dirección del dispositivo
  Serial.print("Dirección dispositivo: ");
  printAddress(insideThermometer);
  Serial.println();

  // Establece la resolución de pantalla a 9 bits
  sensors.setResolution(insideThermometer, 9);
}

// Función para imprimir la temperatura de un dispositivo
void printTemperature(DeviceAddress deviceAddress)
{
  // Temperatura en unidad Fahrenheit
  float tempF = sensors.getTempF(deviceAddress);
  if (tempF == DEVICE_DISCONNECTED_F) 
  {
    Serial.print("Error: No se puede leer la temperatura");
    Serial.println();
    return;
  }

  // Imprimir la temperatura en grados Fahrenheit
  Serial.print(tempF);

  // Enviar la temperatura al servidor a través del puerto serie
  sendTemperature(tempF);
}

/*
 * Función principal. Pregunta las temperaturas al sensor
 */
void loop() {
  // Envia una petición al sensor para que nos devuelva la temperatura
  sensors.requestTemperatures();
  delay(1000);
  printTemperature(insideThermometer);
  delay(1000);
}

// Imprimir la dirección de los dispositivos
void printAddress(DeviceAddress deviceAddress)
{
  for (uint8_t i = 0; i < 8; i++)
  {
    if (deviceAddress[i] < 16) Serial.print("0");
    Serial.print(deviceAddress[i], HEX);
  }
}

// Función para enviar la temperatura al servidor a través del puerto serie
void sendTemperature(float temperature) {
  Serial.print("<START>");
  Serial.print(temperature);
  Serial.println("<END>");
}
