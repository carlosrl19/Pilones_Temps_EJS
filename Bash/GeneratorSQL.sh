#!/bin/bash

# Solicitar la cantidad de registros a crear
read -p "Ingrese la cantidad de registros que desea crear: " cantidad_registros

# Nombre del archivo SQL
archivo_sql="insert_script.sql"

# Crear el archivo SQL o sobrescribir si ya existe
echo "" > $archivo_sql

# Agregar encabezado al archivo SQL
echo "USE pilones_temps;" >> $archivo_sql

# Inicializar variables
pilon_inicio=0
variedad_inicio=0
pn_inicio=1200
temp_min_inicio=55
temp_max_inicio=57

# Inicializar el valor de los valores
valores=""

# Loop para generar los registros
for ((i = 1; i <= cantidad_registros; i++)); do
    pilon_numero=$((pilon_inicio + i))
    variedad_numero=$((variedad_inicio + i))
    pn_numero=$((pn_inicio + i))
    temp_min_numero=$((temp_min_inicio + i))
    temp_max_numero=$((temp_max_inicio + i))

    valores+="('Pilón $pilon_numero', 'Variedad $variedad_numero', 'ABC', $i, $pn_numero, $temp_min_numero, $temp_max_numero, CURDATE(), 'In progress', ''),"

done

# Eliminar la última coma
valores=${valores%,}

# Construir el script SQL
echo "INSERT INTO pilones (nombre, variedad, finca, etapa, pn, temp_min, temp_max, fecha_ingreso, estado, asignado)" >> $archivo_sql
echo "VALUES" >> $archivo_sql
echo "$valores;" >> $archivo_sql

# Notificar la finalización
echo "Archivo $archivo_sql creado exitosamente con $cantidad_registros registros."
