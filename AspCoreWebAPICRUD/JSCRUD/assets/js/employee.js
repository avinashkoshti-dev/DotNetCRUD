$(() => {   
    loadData()    
    $("#exampleModal").find("#btnAdd").off().on("click", (e) => {
        AddEmployee();
    })
});

var loadData = () => {
    fetch('https://localhost:7016/api/Employee/GetEmployees')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            $(Employee).find(".table").find(".divTableRow").html('');
            $.each(data, function (key, element) {   
                var template = $(Employee).find(".table").find(".divSample").find("tr").clone()
                template.find(".tdId").html(key+1)
                template.find(".tdName").html(element.name)
                template.find(".tdGender").html(element.gender.toUpperCase())
                template.find(".tdPosition").html(element.position)
                template.find(".tdSalary").html(element.salary)
                $(template).find(".btnEdit").on("click", (e) => {
                    getByID(element.id);
                });
                $(template).find(".btnDelete").on("click", (e) => {
                    deleleById(element.id)
                });
                $(Employee).find(".table").find(".divTableRow").append(template);
            });   
        })
        .catch(error => { console.error('Error:', error) });
}

var getByID = (id) => {
    fetch('https://localhost:7016/api/Employee/GetEmployeeById/' + id)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            $('#ID').val(data.id);
            $('#name').val(data.name);
            $('#position').val(data.position);
            $('#salary').val(data.salary);
            $('#gender').val(data.gender);
            $('#exampleModal').modal('show');
        })
        .catch(error => { console.error('Error:', error) });
}

var deleleById = (id) => {
    var ans = confirm("Are you sure you want to delete this Record?");

    if (ans)
        fetch('https://localhost:7016/api/Employee/DeleteEmployee/' + id, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    loadData()
                    toastr.success(data.message);    
                }
                else{
                    toastr.error(data.message);    
                }
                           
            })
            .catch(error => { console.error('Error:', error) });
}

var AddEmployee = () => {
    var res = validate();
    if (res == false) {
        return false;
    }
    var obj = {
        id: $('#ID').val() ? $('#ID').val() : 0,
        name: $('#name').val(),
        position: $('#position').val(),
        salary: $('#salary').val(),
        gender: $('#gender').val(),
    };
        fetch('https://localhost:7016/api/Employee/CreateEmployee', {
            method: 'POST', /* or PATCH */
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if(data.success){
                    loadData()
                    toastr.success(data.message);   
                    $('#exampleModal').modal('hide'); 
                    ResetForm()
                }
                else{
                    toastr.error(data.message);    
                }
            });  
}

//Valdidation using jquery
function validate() {
    var isValid = true;
    if ($('#name').val().trim() == "") {
        $('#name').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#name').css('border-color', 'lightgrey');
    }
    if ($('#position').val().trim() == "") {
        $('#position').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#position').css('border-color', 'lightgrey');
    }
    if ($('#salary').val().trim() == "") {
        $('#salary').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#salary').css('border-color', 'lightgrey');
    }
    if ($('#gender').val().trim() == "") {
        $('#gender').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#gender').css('border-color', 'lightgrey');
    }
    return isValid;
}

var ResetForm = () => {
    $('#ID').val("");
    $("#name").val("");
    $("#salary").val("");
    $("#position").val("");
    $("#gender").val("");    
}