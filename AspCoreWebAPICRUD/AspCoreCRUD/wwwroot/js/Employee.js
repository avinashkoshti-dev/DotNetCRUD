$(document).ready(function () {
    loadData(); 
    $('#myModal').on('hide.bs.modal', function () {
        reset()
    });
});
function uploadFiles(inputId) {
    var input = document.getElementById(inputId);
    var files = input.files;
    var formData = new FormData();

    for (var i = 0; i !== files.length; i++) {
        formData.append("files", files[i]);
    }

    $.ajax(
        {
            url: "/home/uploadfiles",
            data: formData,
            processData: false,
            contentType: false,
            type: "POST",
            success: function (data) {
                // Set the property of the Model.
                $("#ResumeFileName").val(data.fileName);
                alert("Files Uploaded! " + data.fileName);
            }
        }
    );
}


//Load Data function
function loadData() {
    $.ajax({
        url: "https://localhost:7016/api/Employee/GetEmployees",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {                    
            var html = '';
            $.each(result, function (key, item) {               
                html += '<tr>';
                html += '<td>' + item.name + '</td>';
                html += '<td>' + item.position + '</td>';
                html += '<td>' + item.salary + '</td>';
                html += '<td>' + item.gender + '</td>';
                html += '<td> <img src="./uploads/' + item.profileImage + '" height="50px" width="50px"/></td>';
                html += '<td>';
                html += '<a href="#" class="btn btn-primary btn-xs me-2" onclick="return getbyID(' + item.id + ')">';
                html += ' Edit';
                html += ' </a>';
                html += '<a href="#" class="btn btn-danger btn-xs" onclick="return Delele(' + item.id + ')">';
                html += 'Delete ';
                html += ' </a>';
                html += '</td>';
                html += '</tr>';

            });
            $('.tbody').html(html);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

//Add Data Function
function Add() {
    var res = validate();
    if (res == false) {
        return false;
    }
    var empObj = {
        Id: $('#ID').val() ? parseInt($('#ID').val()):0 ,
        Name: $('#Name').val(),
        Position: $('#Position').val(),
        Salary: parseInt($('#Salary').val()),
        Gender: $('#Gender').val(),
        ProfileImage:$("#ResumeFileName").val()
    };
    console.log(empObj)

    $.ajax({
        url: "https://localhost:7016/api/Employee/CreateEmployee",
        data: JSON.stringify(empObj),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            //loadData();
            console.log(result)
            if (result.success) {
                reset();               
                loadData();
                toastr.success(result.message);                
                $('#myModal').modal('hide');                
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            }
            else {
                toastr.error(result.message);
            }
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

//Valdidation using jquery
function validate() {
    var isValid = true;
    if ($('#Name').val().trim() == "") {
        $('#Name').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#Name').css('border-color', 'lightgrey');
    }
    if ($('#Position').val().trim() == "") {
        $('#Position').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#Position').css('border-color', 'lightgrey');
    }
    if ($('#Salary').val().trim() == "") {
        $('#Salary').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#Salary').css('border-color', 'lightgrey');
    }
    if ($('#Gender').val().trim() == "") {
        $('#Gender').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#Gender').css('border-color', 'lightgrey');
    }
    return isValid;
}


//Edit Data function
function getbyID(ID) {
    console.log(ID)
    $.ajax({
        url: "https://localhost:7016/api/Employee/GetEmployeeById/" + ID,
        typr: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            console.log(result)
            $('#ID').val(result.id);
            $('#Name').val(result.name);
            $('#Position').val(result.position);
            $('#Salary').val(result.salary);
            $('#Gender').val(result.gender);
            $("#ResumeFileName").val(result.profileImage);            
            $('#myModal').modal('show');

        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
    return false;
}

//function for deleting employee's record
function Delele(ID) {
    var ans = confirm("Are you sure you want to delete this Record?");
    if (ans) {
        $.ajax({
            url: "https://localhost:7016/api/Employee/DeleteEmployee/" + ID,
            type: "DELETE",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (result) {
                console.log(result)
                if (result.success) {
                    loadData();
                    //window.location.reload(true);
                    toastr.success(result.message);
                    //toastr.success("Employee Deleted Successfully...");

                }
                else {
                    toastr.error(result.message);
                }
            },
            error: function (errormessage) {
                alert(errormessage.responseText);
            }
        });
    }
}

//Function for clearing the textboxes
function reset() {
    $('#ID').val("");
    $('#Name').val("");
    $('#Position').val("");
    $('#Salary').val("");
    $('#Gender').val("");
    $("#ResumeFileName").val("");
}