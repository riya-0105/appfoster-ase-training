<!DOCTYPE html>
<html>
    <head lang="{{ str_replace('_', '-', app()->getLocale()) }}">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="css/form.css">
        <!-- <script src="js/form.js"></script> -->

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    </head>
    <body>
        <div class="redirect_button">
            <button class="btn btn-primary" id="home_page_btn">Back to Home</button>
        </div>
        <div class="container_form">
            <form class="form-new-user" action="{{ route('create_user') }}" id="create_user_form" method="POST">
                @csrf
                <div class="form-group">
                    <h4>Create New User</h4>
                </div>
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" class="form-control" id="name" placeholder="Enter Name" name="name">
                </div>
                <div class="form-group">
                    <label for="email">Email Id</label>
                    <input type="email" class="form-control" id="email" placeholder="Enter Valid Email Address" name="email">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Enter Password" name="password">
                    <small class="form-text text-muted">Password length should be >8 minimum 3 Character and digits and at least on special charater out of ! _ @</small>
                    <span class="password-toggle-icon"><i class="fas fa-eye"></i></span>
                </div>
                <div class="form-group form-check-inline">
                    <label class="form-label" for="gender">Gender</label>
                    <input type="radio" class="form-check-input " id="male" value="Male" name="gender">
                    <label class="form-check-label " for="male">Male</label>
                    <input type="radio" class="form-check-input " id="female" value="Female" name="gender">
                    <label class="form-check-label " for="female">Female</label>
                    <input type="radio" class="form-check-input " id="other" value="other" name="gender">
                    <label class="form-check-label " for="female">Other</label>
                </div><br>
                <div class="form-group form-check-inline">
                    <label class="form-label" for="status">Status</label>
                    <input type="radio" class="form-check-input " id="active" value="Active" name="status">
                    <label class="form-check-label" for="active">Active</label>
                    <input type="radio" class="form-check-input" id="inactive" value="Inactive" name="status">
                    <label class="form-check-label" for="inactive">Inactive</label>
                </div><br>
                <div class="d-flex justify-content-center">
                    <button type="submit" class="btn btn-primary">Submit</button>
                </div>
            </form>
            @if(!empty($data))
                <!-- <div class="exception_container">
                    <div class="alert alert-light exception_box" role="alert">
                        <h4 class="alert-heading">User Data</h4>
                        <p>
                        
                    </div>
                </div> -->
                <div class="modal fade" tabindex="-1" role="dialog" id="userDataModal">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                        <div class="modal-header d-flex">
                            <h5 class="modal-title">Modal title</h5>
                            <button type="button" class="close ms-auto btn btn-light" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            @php
                            $data_content = json_decode($data->getContent(), true);
                            $data_getStatusCode = $data->getStatusCode();
                            echo $data_getStatusCode;
                            @endphp
                            @if($data_getStatusCode === 200)
                                $responseObject = [];
                                @foreach($data_content as $key => $value)
                                    $responseObject[$key] = $value
                                @endforeach
                                <p>Name: {{ $responseObject['name']  }}</p>
                                <p>Status: {{ $responseObject['status'] }}</p>
                            @else
                                <p style="color:red">Error: {{ $data->content() }}</p>
                            @endif
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Understood</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                        </div>
                    </div>
                </div>
            @endif
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
            crossorigin="anonymous"></script>
            <script>
                // user form submit ajax call
                // $('form-new-user').submit(async function() {
                //     const formData = $(this).serializeArray();
                //     const formUrl = $(this).action();
                //     const formObject = {};
                //     $.map(formData, function(field, index) {
                //         formObject[field['name']] = formData[field['value']];
                //     });
                //     console.log(formObject);
                //     const jsonData = JSON.stringify(formObject);
                //     console.log(jsonData);
                //     try {
                //             const response = await fetch(formUrl, {
                //             method: 'POST',
                //             headers: {
                //                 "Content-Type": 'application/json',
                //                 "X-CSRF-TOKEN": "{{ csrf_token() }}",
                //             },
                //             body: jsonData
                //             });
                //             const responseData = await response.json();
                //             // console.log(responseData['error']);
                //             if(responseData['error']) {
                //                 $('#submitDataModal .modal-body').html(`<pre style="color:red">${JSON.stringify(responseData)}</pre>`);
                //             }
                //             else {
                //                 const responseDataString = JSON.stringify(responseData);
                //                 console.log(responseDataString)

                //                 const responseDataObject = JSON.parse(responseDataString);
                //                 console.log(responseDataObject);
                //                 $('#submitDataModal .modal-body').html(`
                //                 <h6 class="h6 text-capitalize" style="color:green">Name: ${responseDataObject.name}</h6><br>
                //                 <h6 class="h6 text-capitalize" style="color:green">Email: ${responseDataObject.email}</h6><br>
                //                 <h6 class="h6 text-capitalize" style="color:green">Gender: ${responseDataObject.gender}</h6><br>
                //                 <h6 class="h6 text-capitalize" style="color:green">Status: ${responseDataObject.status}</h6><br>
                //                 `);
                //             }
                            
                //             $('#editDataModal').modal('show');
                //         }
                //         catch(error) {
                //             console.error("Error:", error);
                //             $('#editDataModal .modal-body').html('<pre>' + error + '<pre>');
                //             $('#editDataModal').modal('show');
                //             // Handle error display or other actions here

                //         };
                //         setTimeout(() => {
                //             $('#editDataModal').modal('hide');
                //         }, 3000);
                // });


                $(document).ready(function(){

                    
                    let formSubmitted = false;
                    $('#create_user_form').on("submit", function()  {
                        formSubmitted = true;
                        if(formSubmitted) {
                            @if(isset($data) && $data !== null)
                            const data = @json($data);
                            console.log(data);
                            $('#userDataModal').modal('show');
                        @endif
                            formSubmitted = false;
                        }
                    })
                    
                    $('#home_page_btn').on("click", function() {
                        window.location.href = '/';
                    });
                });
            </script>
    </body>
</html> 