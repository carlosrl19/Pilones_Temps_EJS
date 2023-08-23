// Obtener el contexto del lienzo del gráfico
var ctx = document.getElementById("myChart").getContext("2d");

// Declarar la variable del gráfico fuera de la función crearGrafico
var myChart;

// Función para obtener los datos filtrados por ID de pilón
function obtenerDatosFiltrados(pilonId, fechaInicial, fechaFinal) {
    var url = "api/temperatures/" + pilonId + "?fechaInicial=" + fechaInicial + "&fechaFinal=" + fechaFinal;

    return fetch(url)
        .then(function (response) {
            return response.json();
        });
}

// Función para crear y actualizar el gráfico
function crearGrafico(labels, data, fechas) {
    if (myChart) {
        // Si el gráfico ya existe, actualizar sus datos
        myChart.data.labels = labels.map(function (hora, index) {
            return hora + " - " + fechas[index];
        });
        myChart.data.datasets[0].data = data;
        myChart.update();
    } else {
        // Si el gráfico no existe, crear uno nuevo
        myChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels.map(function (hora, index) {
                    return hora + " - " + fechas[index];
                }),
                datasets: [
                    {
                        label: "Temperatures",
                        data: data,
                        backgroundColor: "rgba(84, 197, 255, 0.3)",
                        borderColor: "rgba(0, 124, 188, 0.6)",
                        pointStyle: 'circle',
                        pointRadius: 6,
                        pointHoverRadius: 15,
                        fill: {
                            target: "origin",
                            above: "rgba(84, 197, 255, 0.1)",
                        },
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Hacer la gráfica redimensionable
                scales: {
                    x: {
                        ticks: {
                            font: {
                                size: 14, // Tamaño de fuente para el eje X
                            },
                        },
                    },
                    y: {
                        ticks: {
                            font: {
                                size: 16, // Tamaño de fuente para el eje Y
                            },
                        },
                    },
                },
            },
            plugins: {
                fill: {
                    propagate: true,
                },
            },
        });
    }
}

// Evento de cambio del select y de las fechas para actualizar el gráfico
selectPilon.addEventListener("change", actualizarGrafica);
fechaInicialSelector.addEventListener("change", actualizarGrafica);
fechaFinalSelector.addEventListener("change", actualizarGrafica);

function actualizarGrafica() {
    var pilonId = selectPilon.value;
    var fechaInicial = fechaInicialSelector.value;
    var fechaFinal = fechaFinalSelector.value;

    // Verificar si se ha seleccionado un pilón
    if (pilonId) {
        // Formatear las fechas en formato AAAA-MM-DD
        var formattedFechaInicial = fechaInicial ? fechaInicial : null;
        var formattedFechaFinal = fechaFinal ? fechaFinal : null;

        obtenerDatosFiltrados(pilonId, formattedFechaInicial, formattedFechaFinal)
            .then(function (data) {
                // Obtener las horas, temperaturas y fechas como arreglos separados
                var horas = data.map(function (dato) {
                    return dato.hora_lectura;
                });
                var temperaturas = data.map(function (dato) {
                    return dato.lectura;
                });
                var fechas = data.map(function (dato) {
                    var fecha = new Date(dato.fecha_lectura);
                    return fecha.getFullYear() + '-' + (fecha.getMonth() + 1).toString().padStart(2, '0') + '-' + fecha.getDate().toString().padStart(2, '0');
                });

                // Crear o actualizar el gráfico con los nuevos datos
                crearGrafico(horas, temperaturas, fechas);
            })
            .catch(function (error) {
                console.error("Error al obtener los datos:", error);
            });
    } else {
        // Si no se ha seleccionado un pilón, mostrar la gráfica vacía
        crearGrafico([], [], []);
    }
}

// Hacer una solicitud al servidor para obtener la lista de pilones
fetch("api/pilones")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // Agregar las opciones al select de pilones
        data.forEach(function (pilon) {
            var option = document.createElement("option");
            const fechaIngreso = new Date(pilon.fecha_ingreso).toISOString().split('T')[0]; // UTC format
            option.value = pilon.id;
            option.textContent = pilon.nombre + ' - ' + pilon.finca + ' - ' + fechaIngreso +' - ' + pilon.variedad;
            selectPilon.appendChild(option);
        });
    })
    .catch(function (error) {
        console.error("Error al obtener los pilones:", error);
    });

// Llamar a la función actualizarGrafica inicialmente cuando se seleccionen las fechas
actualizarGrafica();

// Export graphics to images
function exportToImage() {
    var canvas = document.getElementById("myChart");

    var imageData = canvas.toDataURL("image/png");
    var link = document.createElement("a");
    link.href = imageData;
    link.download = "grafico.png";
    link.click();
}