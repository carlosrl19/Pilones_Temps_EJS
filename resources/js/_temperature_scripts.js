fetch('/api/temperatures')
    .then((response) => response.json())
    .then((data) => {
        const tableBody = document.getElementById('tableBody');

        data.forEach((row) => {
            const newRow = document.createElement('tr');
            const fechaLectura = new Date(row.fecha_lectura).toISOString().split('T')[0]; // UTC format
            const lecturaRedondeada = parseFloat(row.lectura).toFixed(2); // Two digits format
            newRow.innerHTML = `
      <td>${row.nombre}</td>
      <td>${fechaLectura}</td>
      <td>${row.hora_lectura}</td>
      <td>${row.unidad}</td>
      <td>${lecturaRedondeada}</td>`;
            tableBody.appendChild(newRow);
        });

        $(document).ready(function () {
            $('#myTable').DataTable({
                dom: 'lBfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: 'Export to Excel',
                        className: 'btn btn-primary dt-buttons btnExcel'
                    },
                    {
                        extend: 'print',
                        text: 'Print / Save PDF',
                        className: 'btn btn-secondary dt-buttons btnPrint',
                        exportOptions: {
                            modifier: {
                                selected: null
                            }
                        }
                    }
                ],
                /*language: {
                    zeroRecords: 'No se han encontrado datos almacenados en la base de datos.',
                    lengthMenu: 'Mostrar _MENU_ entradas',
                    info: 'Mostrando _START_ al _END_ de _TOTAL_ entradas',
                    paginate: {
                        previous: 'Anterior',
                        next: 'Siguiente',
                    },
                    search: 'Buscar',
                }*/
            });
        });
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });