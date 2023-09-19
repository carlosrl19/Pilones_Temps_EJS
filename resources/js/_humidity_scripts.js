fetch('/api/humidities')
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
      <td>${lecturaRedondeada} %</td>`;
            tableBody.appendChild(newRow);
        });

        $(document).ready(function () {
            $('#myTable').DataTable({
                dom: 'lBfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: 'Export to Excel',
                        className: 'btn btn-primary dt-buttons btnExcel',
                        exportOptions: {
                            columns: [0, 1, 2, 3]
                        }
                    },
                    {
                        extend: 'print',
                        text: 'Print / Save PDF',
                        className: 'btn btn-secondary dt-buttons btnPrint',
                        exportOptions: {
                            columns: [0, 1, 2, 3]
                        }
                    }
                ],

                "aoColumnDefs": [
                    { "bSearchable": true, "aTargets": [0] },
                    { "bSearchable": true, "aTargets": [1] },
                    { "bSearchable": false, "aTargets": [2] },
                    { "bSearchable": false, "aTargets": [3] },
                ],
                scrollY: "75vh",
                scrollCollapse: true,
                search: {
                    regex: true, // Enables the use of regular expressions in search
                    smart: false // Disables automatic filtering of DataTables to allow exact searches
                }
            });
        });
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });