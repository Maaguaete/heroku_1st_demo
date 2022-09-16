$(document).ready(function() {
    displayData();

    $("#btn_modal_addStudent").click(() => {
        $("#modal_addStudent").modal('show');
    });
    $("#btn_addStudent").click(function() {
        addStudent();
    });
    $("#searchBar").keyup(function() {
        searchStudent();
    });
});

function hide_modal_addStudent() {
    $("#modal_addStudent").modal("hide");
}

function appendStudent(index, item) {
    $("table tbody").append(
        "<tr>" +
        "<td class='index'>" + (index + 1) + "</td>" +
        "<td>" + formatTheID(fromByteArray(item.id.split(","))) + "</td>" +
        "<td>" + item.name + "</td>" +
        "<td>" + item.batch + "</td>" +
        "<td>" + item.address + "</td>" +
        `<td><input class='btn btn-info' value='edit' id='edit' type='button' onclick='edit(${item._id})';> &nbsp;` +
        `<input class='btn btn-danger'value='delete' id='delete' type='button' onclick='del(\"${item._id}\", \"${item.id}\")';></td>` +
        "</tr>"
    );
}

function formatTheID(str) {
    // function encrypt format string length is multiple of 4,
    // but ID in form submited is 14 only.
    str = str.replace(/[+]/g, '-').substring(0, str.length - 2);
    return str;
}

function displayData() {
    $.ajax({
        type: "get",
        url: "/readData",
        success: function(response) {
            $("table tbody").empty();
            $.each(response, function(index, item) {
                appendStudent(index, item);
            });
        }
    });
}

function searchStudent() {
    $.ajax({
        type: "get",
        url: "/searchData",
        data: { name: $("#searchBar").val() },
        contentType: "application/json",
        success: function(response) {
            $("table tbody").empty();
            $.each(response, function(index, item) {
                appendStudent(index, item);
            });

        }
    });
}

function addStudent() {
    let student = { id: $("#id").val(), name: $("#name").val(), batch: $("#batch").val(), address: $("#address").val() };

    $.ajax({
        type: "post",
        url: "/addStudent",
        contentType: "application/json",
        data: JSON.stringify(student),
        success: function(response) {
            if (response.OK) {
                // if OK: hide modal_add_student
                hide_modal_addStudent();
                let item = response.data;
                let index = $("table tbody > tr").length;
                appendStudent(index, item);
            }
        }
    });
}

function del(item_id, id) {
    if (confirm(`Are you sure to delete the student with id: ${id}?`)) {
        let data = { _id: item_id };
        $.ajax({
            type: "delete",
            contentType: "application/json",
            data: JSON.stringify(data),
            url: "/deleteData",
            success: function(response) {
                if (response.OK) {
                    displayData();
                } else {
                    alert(response.Error);
                }
            }
        });
    }
}