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

# Inicializar el valor de los valores
valores=""

# Opciones para la variedad
variedades=("Camacho" "Corojo" "Connecticut" "Nicaragua" "Danlidense" "Canadiense" "Dominicano")

# Pedir los rangos para pn, temp_min, y temp_max
read -p "Ingrese el valor mínimo para pn: " pn_min
read -p "Ingrese el valor máximo para pn: " pn_max
read -p "Ingrese el valor mínimo para temp_min: " temp_min_min
read -p "Ingrese el valor máximo para temp_min: " temp_min_max
read -p "Ingrese el valor mínimo para temp_max: " temp_max_min
read -p "Ingrese el valor máximo para temp_max: " temp_max_max

# Loop para generar los registros
for ((i = 1; i <= cantidad_registros; i++)); do
    pilon_numero=$((pilon_inicio + i))
    variedad=${variedades[$((RANDOM % ${#variedades[@]}))]}
    pn_numero="$((RANDOM % ($pn_max - $pn_min + 1) + $pn_min))"
    temp_min_numero="$((RANDOM % ($temp_min_max - $temp_min_min + 1) + $temp_min_min))"
    temp_max_numero="$((RANDOM % ($temp_max_max - $temp_max_min + 1) + $temp_max_min))"
    valores+="('Pilón $pilon_numero', '$variedad', 'ABC', $i, $pn_numero, $temp_min_numero, $temp_max_numero, CURDATE(), 'In progress'),"

done

# Eliminar la última coma
valores=${valores%,}

# Construir el script SQL
echo "INSERT INTO pilones (nombre, variedad, finca, etapa, pn, temp_min, temp_max, fecha_ingreso, estado)" >> $archivo_sql
echo "VALUES" >> $archivo_sql
echo "$valores;" >> $archivo_sql

# Notificar la finalización
echo "Archivo $archivo_sql creado exitosamente con $cantidad_registros registros."
