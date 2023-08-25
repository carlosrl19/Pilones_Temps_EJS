$(document).ready(function () {
    $('button:contains("Show pilones list and save")').click(function () {
        $('#myModal').modal('show');
    });

    const pilonCheckboxList = $("#pilonCheckboxList");
    const searchInput = $("#searchInput");

    // Call the API to get the list of pilones
    $.get("/api/pilones", function (data) {
        const generateCheckboxes = function (pilons) {
            pilonCheckboxList.empty(); // Clear previous content

            pilons.forEach(function (pilon) {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = "opcion";
                checkbox.value = pilon.id; // Set the pilon's ID as the checkbox value

                const label = document.createElement("label");
                label.textContent = pilon.nombre; // Use the pilon's name

                const div = document.createElement("div");
                div.appendChild(checkbox);
                div.appendChild(label);

                pilonCheckboxList.append(div);
            });
        };

        // Generate checkboxes for initial data
        generateCheckboxes(data);

        // Handle checkbox selection
        $("input[name='opcion']").on("change", function () {
            $("input[name='opcion']").not(this).prop("checked", false);
        });

        // Handle search input
        searchInput.on("input", function () {
            const searchTerm = searchInput.val().toLowerCase();
            const filteredPilons = data.filter(function (pilon) {
                return pilon.nombre.toLowerCase().includes(searchTerm) ||
                    pilon.finca.toLowerCase().includes(searchTerm);
            });
            generateCheckboxes(filteredPilons);
        });
    });
});