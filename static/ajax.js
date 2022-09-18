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
    $("#btn_editStudent").click(() => {
        postEdit();
    })
});

function hide_modal_addStudent() {
    $("#modal_addStudent").modal("hide");
}

function hide_modal_editStudent() {
    $("#modal_editStudent").modal("hide");
}

function appendStudent(index, item) {
    $("table tbody").append(
        `<tr id='index${index}'>` +
        `<td>${(index + 1)}</td>` +
        // "<td>" + formatTheID(fromByteArray(item.id.split(","))) + "</td>" +
        "<td>" + item.id + "</td>" +
        "<td>" + item.name + "</td>" +
        "<td>" + item.batch + "</td>" +
        "<td>" + item.address + "</td>" +
        `<td><input class='btn btn-info' value='edit' id='Edit' type='button' onclick='edit(\"${index}\", \"${item._id}\")';> &nbsp;` +
        `<input class='btn btn-danger'value='delete' id='Delete' type='button' onclick='del(\"${item._id}\", \"${item.id}\")';></td>` +
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
            } else {
                alert('Response. false');
            }
        }
    });
}

function edit(index, _id) {

    let id = $(`#index${index} td:nth-child(2)`).text();
    let name = $(`#index${index} td:nth-child(3)`).text();
    let batch = $(`#index${index} td:nth-child(4)`).text();
    let address = $(`#index${index} td:nth-child(5)`).text();

    $("#modal_editStudent").modal('show');

    $("#edit_obj_id").val(_id);
    $("#edit_index").val(index);
    $("#edit_id").val(id);
    $("#edit_name").val(name);
    $("#edit_batch").val(batch);
    $("#edit_address").val(address);
}

function postEdit() {
    let student = { _id: $("#edit_obj_id").val(), index: $("#edit_index").val(), id: $("#edit_id").val(), name: $("#edit_name").val(), batch: $("#edit_batch").val(), address: $("#edit_address").val() };
    $.ajax({
        type: "post",
        url: "/editStudent",
        contentType: "application/json",
        data: JSON.stringify(student),
        success: function(response) {
            if (response.OK) {
                // if OK: hide modal_add_student
                hide_modal_editStudent();
                let item = response.data;
                $(`#index${item.index} td:nth-child(3)`).text(item.name);
                $(`#index${item.index} td:nth-child(4)`).text(item.batch);
                $(`#index${item.index} td:nth-child(5)`).text(item.address);
                alert(`Updated information student: ${item.name}`);
            } else {
                alert('Response. false');
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