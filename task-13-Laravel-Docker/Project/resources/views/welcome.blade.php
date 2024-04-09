<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Laravel</title>
        <link href="css/welcome.css" rel="stylesheet">
        <!-- <script src="js/welcome.js"></script> -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    </head>
    <body>
        @section('container') 
            <div class="container-header">
                <div class="entries_count_container">
                    <form action="/" method="GET">
                        <input type="number" id="entriesPage" placeholder="No. of Entries (Default Value is 10)" name="n">
                        <button class="btn btn-primary btn-outline-success entries_button" type="submit">Enter</button>
                    </form>
                </div>
                <div class="entries_count_container">
                    <button class="create_new_user_button">Create New User</button>
                    <button class="entries_button">View Projects</button>
                </div>
            </div>
            <div class="container-info">

            {{--  condition to check count and display results accordingly, for count == 0, no data will be printed on screen --}}
                @if($users->count() > 0)
                    <table class="table_container">
                    <tr>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                    @foreach($users as $user)
                    <tr data-user-id="{{ $user }}">
                        
                        <td>{{ $user->name }}</td>
                        <td>
                            <button class="btn btn-primary btn-outline-success" data-bs-target="#view_user_data{{ $user->id }}" data-bs-toggle="modal">View</button>
                            <div class="modal fade" id="view_user_data{{ $user->id }}" tabIndex="-1" aria-labelledby="user_view" role="dialog"  
                            aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">User Data</h5>
                                            <button type="button"
                                        class="btn btn-outline-secondary btn-secondary close ms-auto" data-bs-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                        </div>
                                        <div class="modal-body">
                                            <h6 class="text-capitalize">Name = {{ $user->name }}</h6><br>
                                            <h6 class="text-capitalize">Email Id = {{ $user->email }}</h6><br>
                                            <h6 class="text-capitalize">Gender = {{ $user->gender }}</h6><br>
                                            <h6 class="text-capitalize">Status = {{ $user->status }}</h6><br>
                                        </div>
                                        <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" class="btn btn-primary w-auto" data-bs-dismiss="modal">Understood</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="button" class="btn btn-primary btn-outline-danger" data-bs-target="#edit_users{{ $user->id }}" data-bs-toggle="modal">Edit</button>
                            <div class="modal fade" id="edit_users{{ $user->id }}" tabIndex="-1" aria-labelledby="edit_users" role="dialog" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">User Data</h5>
                                        <button type="button"
                                        class="btn btn-outline-secondary btn-secondary close ms-auto" data-bs-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    
                                    <form class="modify_form" action="{{ route('update_user') }}" method="POST">
                                    
                                        <div class="modal-body">
                                        <div class="mb-3 h6">
                                            <label for="email{{ $user->id }}" class="form-label h6">Email Address</label>
                                            <input placeholder="Enter Authorised Mail" type="text" class="form-control" id="email{{ $user->id }}" name="email">
                                        </div>
                                        <div class="mb-3 h6">
                                            <label for="name{{ $user->id }}" class="form-label h6">Name</label>
                                            <input placeholder="{{ $user->name }}" type="text" class="form-control" id="name{{ $user->id }}" name="name">
                                        </div>
                                        <div class="mb-3 gender_data h6">
                                            <label for="gender{{ $user->id }}" class="form-label h6">Gender</label>
                                            <input name="gender" type="radio" class="form-check-input" id="male{{ $user->id }}" value='Male' {{ $user->gender === 'Male' ? 'checked' : '' }} >Male
                                            <input name="gender" type="radio" class="form-check-input" id="female{{ $user->id }}" value='Female' {{ $user->gender === 'Female' ? 'checked' : '' }}>Female
                                            <input name="gender" type="radio" class="form-check-input" id="other{{ $user->id }}" value='Other' {{ $user->gender === 'Other' ? 'checked' : '' }}>Other
                                        </div>
                                        <div class="mb-3 h6 ">
                                            <label for="status{{ $user->id }}" class="form-check-label h6">Status</label>
                                            <input name="status"
                                            type="radio" class="form-check-input" id="active{{ $user->id }}" value='Active' {{ $user->status === 'Active' ? 'checked' : '' }}>Active
                                            <input name="status" type="radio" class="form-check-input" id="inactive{{ $user->id }}" value='Inactive' {{ $user->status === 'Inactive' ? 'checked' : '' }}>Inactive
                                        </div>
                                        </div>
                                        <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" >Submit</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            </div>
                            {{-- delete button --}}
                            <button type="button" class="btn btn-primary btn-outline-danger" data-bs-target="#delete_users{{ $user->id }}" data-bs-toggle="modal">Delete</button>
                            <div class="modal fade" id="delete_users{{ $user->id }}" role="dialog" tabindex="-1" aria-labelledby="delete_users" aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h6 class="modal-title">Delete Confirmation</h6>
                                            <button type="button"
                                        class="btn btn-outline-secondary btn-secondary close ms-auto" data-bs-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                        </div>
                                        <div class="modal-body">
                                            <h6>Are you sure to Delete User?</h6>
                                        </div>
                                        <div class="modal-footer">
                                            <form class="d-flex" method="DELETE" id="delete_user_form" data-user="{{ $user }}">

                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" id="data_delete">Delete</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {{-- project button --}}
                            <button type="button" data-user="{{ $user }}" class="btn btn-primary btn-outline-success project_display_button">Project</button>
                        </td>
                    </tr>
                    @endforeach
                    </table>
                    @else
                    <h5>No Data Found!!!</h5>
                @endif 
                
                <!-- <div class="exception_container">
                    <div class="alert alert-light exception_box" role="alert">
                        <h4 class="alert-heading">User Data</h4>
                        <p>
                        
                    </div>
                </div> -->

                <div class="modal fade in" tabindex="-1" role="dialog" id="editDataModal">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                            <div class="modal-header d-flex">
                                <h5 class="modal-title">Modal title</h5>
                                <button type="button" class="close ms-auto btn btn-light" data-bs-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                            <!-- edit response to fetch response after editing the user info -->

                            
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Understood</button>
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                            </div>
                        </div>
                    </div>
            </div>

            <div class="pagination">
                <!-- Pagination -->
                {{ $users->links() }}
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
            crossorigin="anonymous"></script>
            <script>
                
               $(document).ready(function() {

                // ajax call for delete form

                $(delete_user_form).submit(async function() {
                    const user = $(this).data('user');
                    console.log(user.id);
                    const response = await fetch(`/api/host/delete_user/${user.id}`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": 'application/json',
                            "X-CSRF-TOKEN": "{{ csrf_token() }}",
                        },
                    });
                    const responseData = await response.json();
                    if(responseData['error']) {
                        $('#editDataModal .modal-body').html(`<pre style="color:red">${JSON.stringify(responseData)}</pre>`);
                    }
                    else {
                        const responseDataString = JSON.stringify(responseData);
                        console.log(responseDataString)

                        const responseDataObject = JSON.parse(responseDataString);
                        console.log(responseDataObject);
                                $('#editDataModal .modal-body').html(`
                        <h6 class="h6 text-capitalize" style="color:green">User ${responseDataObject.name} deleted successfully!!</h6><br>`);
                    }
                            
                    $('#editDataModal').modal('show');
                    setTimeout(() => {
                        $('#editDataModal').modal('hide');
                    }, 3000);
                })

                // ajax call for edit form
                $('.modify_form').submit(async function(e) {
                        e.preventDefault();
                        const formData = $(this).serializeArray(); 
                        const formObject = {};
                        console.log(formData);
                        $.map(formData, function(field, index) {
                            formObject[field['name']] = field['value'];
                        });
                        console.log(formObject);
                        const jsonData = JSON.stringify(formObject);
                        console.log(jsonData);

                        try {
                            const response = await fetch('/api/host/modify_userInfo', {
                            method: 'POST',
                            headers: {
                                "Content-Type": 'application/json',
                                "X-CSRF-TOKEN": "{{ csrf_token() }}",
                            },
                            body: jsonData
                            });
                            const responseData = await response.json();
                            // console.log(responseData['error']);
                            if(responseData['error']) {
                                $('#editDataModal .modal-body').html(`<pre style="color:red">${JSON.stringify(responseData)}</pre>`);
                            }
                            else {
                                const responseDataString = JSON.stringify(responseData);
                                console.log(responseDataString)

                                const responseDataObject = JSON.parse(responseDataString);
                                console.log(responseDataObject);
                                $('#editDataModal .modal-body').html(`
                                <h6 class="h6 text-capitalize" style="color:green">Name: ${responseDataObject.name}</h6><br>
                                <h6 class="h6 text-capitalize" style="color:green">Email: ${responseDataObject.email}</h6><br>
                                <h6 class="h6 text-capitalize" style="color:green">Gender: ${responseDataObject.gender}</h6><br>
                                <h6 class="h6 text-capitalize" style="color:green">Status: ${responseDataObject.status}</h6><br>
                                `);
                            }
                            
                            $('#editDataModal').modal('show');
                        }
                        catch(error) {
                            console.error("Error:", error);
                            $('#editDataModal .modal-body').html('<pre>' + error + '<pre>');
                            $('#editDataModal').modal('show');
                            // Handle error display or other actions here

                        };
                        setTimeout(() => {
                            $('#editDataModal').modal('hide');
                        }, 3000);
                    });
                    $('.create_new_user_button').on('click', function() {
                        window.location.href='/create_user';
                    }); 

                    $('.entries_button').on('click', function() {
                        window.location.href='/project';
                    });
                });

                // ajax call for project display
                $('.project_display_button').on("click", function() {
                    const user = $(this).data('user');
                    console.log(user);
                    project_user_fun(user);
                })
                async function project_user_fun(user) {
                    console.log(user);
                    const modal = document.createElement('div');
                    modal.classList.add('modal', 'fade');
                    modal.setAttribute("id", "userProject");
                    modal.innerHTML = "";
                    const response = await fetch(`http://127.0.0.1:8000/api/host/${user.id}/projects`);
                    const responseData = await response.json();
                    // console.log(responseData);
                    modal.innerHTML = `
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h6 class="modal-title">Projects By ${user.name}</h6>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Done</button>
                                </div>
                            </div>
                        </div>
                    `;
                    const modal_body = modal.querySelector('.modal-body');
                    // console.log(modal_body);
                    modal_body.innerHTML = "";
                    responseData.forEach(item => {
                        const technology_array = item["Technology Used"].split(',');
                        const technology_used = technology_array.map(tech => tech.replace(/"/g, ' '));
                        const technology_string = technology_used.join(', ');
                        modal_body.innerHTML += `
                        <div class="d-inline"><h6 class="class="text-capitalize">Project Name : </h6><p class="">${item["Project Title"]}</p></div><br>
                        <div class="d-inline"><h6 class="class="text-capitalize">Technology Used: </h6><p>${technology_string}</p></div><br>
                        <div class="d-inline"><h6 class="class="text-capitalize">Project Description: </h6><p>${item["Project Description"]}</p></div><br><br><hr>
                    `;
                    })
                    document.body.appendChild(modal);
                    const userModal = new bootstrap.Modal(modal);
                    userModal.show();
                    setTimeout(() => {
                        userModal.hide();
                    }, 3000);
                }                   
            </script>
    </body>
</html>

