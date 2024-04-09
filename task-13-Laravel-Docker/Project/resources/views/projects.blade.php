<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="css/projects.css">
        <link rel="stylesheet" href="css/welcome.css">
        <script src="js/projects.js"></script>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    </head>
    <body>
    <div class="container-header">
                <form action="/project" method="GET" class="entries_count_container">
                    <input name="n" type="number" id="entriesPage" placeholder="No. of Entries (Default Value is 10)">
                    <button class="btn btn-primary entries_button btn-outline-light" type="submit">Enter</button>
                </form>
                <div class="entries_count_container">
                    <button class="entries_button" onclick="window.location.href='/create_project'">Create New Project</button>
                    <button class="entries_button" onclick="window.location.href = '/'">View Users</button>
                </div>
            </div>
            <div class="container-info">
            <div class="project_container">
            @if(count($project_user) > 0)
            <table>
                <tr>
                    <th>Project</th>
                    <th>User Id</th>
                    <th>Action</th>
                </tr>
                {{-- project_user has data in form ['user', 'project'] --}}
                @foreach($project_user as $data)
                <tr data-project-id="{{ $data['project']->id }}">
                    <td>{{$data['project']->{'Project Title'} }}</td>
                    <td>{{ $data['user']->name }}</td>
                    <td>
                        <button type="button" class="btn btn-primary btn-outline-success"  data-bs-toggle="modal" data-bs-target="#project_view{{ $data['project']->id }}">View</button>

                        {{-- modal for view --}} 
                        @php
                            $technology_array = explode(',', $data['project']->{'Technology Used'});
                            
                            $technology_used = array_map(function($tech) {
                                return str_replace('"', '', $tech);
                            }, $technology_array);
                            $technology_string = implode(', ', $technology_used);
                        @endphp
                        <div class="modal fade" id="project_view{{ $data['project']->id }}" tabindex="-1" role="dialog"  aria-labelledby="project_view" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5>Project Details</h5>
                                        <button type="button"
                                        class="btn btn-outline-secondary btn-secondary close ms-auto" data-bs-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <h6>Project ID = {{ $data['project']->id }}</h6><br><br>
                                        <h6>Project Name = {{ $data['project']->{"Project Title"} }}</h6><br><br>
                                        <h6>Technology Used = {{ $technology_string }}</h6>
                                        <br><br>
                                        <h6>Project Description = {{ $data['project']->{'Project Description'} }}</h6><br><br>
                                        <h6>User Name = {{ $data['user']->name }}</h6><br><br><br>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary btn-outline-danger" data-bs-dismiss="modal" aria-label="Close">Close</button>
                                        <button type="button" class="w-auto btn btn-primary btn-outline-success" data-bs-dismiss="modal">Understood</button>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <button type="button" class="btn btn-primary btn-outline-danger" data-bs-toggle="modal" data-bs-target="#userdeleteConfirm{{ $data['project']->id }}">Delete</button>

                            {{-- Delete modal --}}
                            <div class="modal fade" id="userdeleteConfirm{{ $data['project']->id }}" tabindex="-1" role="dialog" aria-labelledby="userdeleteConfirm" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header d-flex">
                                        <h6 class="modal-title">Delete Confirmation</h6>
                                        <button type="button"
                                        class="btn btn-outline-secondary btn-secondary close ms-auto" data-bs-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <h6>Are you sure to Delete User?</h6>
                                    </div>
                                    <div class="mb-0 modal-footer">
                                        <form class="mb-0 d-flex" data-project="{{ $data['project']->id }}" id="delete_form_project">
                                            <button type="button" class="btn btn-secondary btn-outline-success" data-bs-dismiss="modal">Close</button>
                                            <button type="submit" class="btn btn-primary btn-outline-danger" data-bs-dismiss="modal" id="data_delete{{ $data['project']->id }}">Delete</button>
                                        </form>  
                                    </div>
                                </div>
                            </div>
                        </div>

                        {{-- data show modal --}}
                        <div class="modal fade" id="display_modal" tabindex="-1" role="dialog" aria-labelledby="display_modal" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button class="btn-close" type="button" data-bs-dismiss="Close" aria-label="Close" onClick="location.reload()"></button>
                                </div>
                                <div class="modal-body">
                                    
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick="location.reload()">Close</button>
                                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick="location.reload()">Done</button>
                                </div>
                            </div>
                        </div>
                        </div>

                        <button type="button" class="btn btn-primary btn-outline-light edit_project_btn" data-project="{{ json_encode($data) }}">Edit</button>
                        {{-- edit modal --}}

                        <div class="modal fade" id="edit_data{{ $data['project']->id }}" tabindex="-1" role="dialog" aria-labelledby="edit_project_data" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">User Data</h5>
                                        <button type="button"
                                        class="btn btn-outline-warning btn-secondary close ms-auto" data-bs-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <form class="modify_form{{ $data['project']->id }}" id="edit_form_project">
                                        <div class="modal-body">
                                        <div class="mb-3">
                                            <label for="id{{ $data['project']->id }}" class="form-label">Project Id</label>
                                            <input placeholder="{{ $data['project']->id }}" type="text" class="form-control" id="id{{ $data['project']->id }}" name="id" disabled>
                                        </div>
                                        <div class="mb-3">
                                            <label for="projectTitle{{ $data['project']->id }}" class="form-label">Project Title</label>
                                            <input placeholder="{{ $data['project']->{'Project Title'} }}" type="password" class="form-control" id="projectTitle{{ $data['project']->id }}" name="projectTitle" disabled>
                                        </div>
                                        <div class="mb-3">
                                            <label for="user_name{{ $data['project']->id }}" class="form-label">User Name</label>
                                            <input placeholder="{{ $data['user']->name }}" type="text" class="form-control" id="user_name{{ $data['project']->id }}" name="user_name" disabled>
                                        </div>
                                        <div class="mb-3">
                                            <label for="technologyUsed{{ $data['project']->id }}" class="form-label">Technology Used</label>
                                            <input type="text" class="form-control" id="technologyUsed{{ $data['project']->id }}" name="Technology Used" placeholder="{{ $technology_string }}">
                                            <div id="selectedTechnologies{{ $data['project']->id }}" class="d-flex selected_tech"></div>
                                            <button type="button" class="btn btn-primary w-auto" id="addTechnology{{ $data['project']->id }}">Add Technology</button>
                                        </div>
                                        <div class="mb-3">
                                            <label for="projectDescription{{ $data['project']->id }}" class="form-label">Project Description</label>
                                            <input placeholder="{{ $data['project']->{'Project Description'} }}" type="text" class="form-control" id="projectDescription{{ $data['project']->id }}" name="Project Description">
                                        </div>
                                        <div class="modal-footer">
                                        <button type="button" class="btn btn-outline-warning" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" class="btn btn-primary w-auto btn-outline-success" data-bs-dismiss="modal" >Submit</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>  
                        
                    </td>
                </tr>
                @endforeach
            </table>
            @else 
            <h5>No Data Found!!!</h5>
            @endif
        </div>
            </div>
            <div class="pagination">
                {{ $projects->links() }}
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
            crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
        crossorigin="anonymous"></script>
        <script>
            document.addEventListener('DOMContentLoaded', async () => {
                const data_project = document.querySelectorAll('[data-project-id]');
                data_project.forEach(data_project_id => {
                    const id = data_project_id.dataset.projectId;
                    console.log(id);

                    async function technology_used() {
                    const technology_used_array = document.querySelector(`#technologyUsed${id}`);
                    technology_used_array.setAttribute('tabindex', '0');
                    const add_Technology = document.querySelector(`#addTechnology${id}`);
                    const seletedTechnologies = [];

                    function handle_add_tech(seletedTechnologies) {
                        const newTechnology = technology_used_array.value.trim().split(',').map(option => option.trim());
                        console.log("hello", newTechnology);
                        newTechnology.forEach(newOption => {
                            console.log(newOption);
                            const newOptionList = document.createElement('div');
                            newOptionList.classList.add('newOptionList');
                            newOptionList.classList.add('d-flex');
                            newOptionList.classList.add('h6');
                            newOptionList.classList.add('align-item-center');
                            // newOptionList.classList.add('btn btn-primary btn-outline-light');
                            const deleteButton = document.createElement('button');
                            deleteButton.textContent = 'x';
                            deleteButton.classList.add("btn");
                            deleteButton.classList.add("btn-primary");
                            deleteButton.classList.add("btn-outline-light");
                            // deleteButton.classList.add("w-auto");
                            deleteButton.style.width = "2rem";
                            deleteButton.addEventListener("click", function() {
                                const removeItem = seletedTechnologies.indexOf(newOption);
                                if(removeItem !== -1) {
                                    seletedTechnologies.splice(removeItem, 1);
                                }
                                newOptionList.remove();
                            });
                            console.log(newOption);
                            seletedTechnologies.push(newOption);
                            localStorage.setItem('selectedTechnologies', JSON.stringify(seletedTechnologies));
                            document.querySelector(`#selectedTechnologies${id}`).value = JSON.stringify(seletedTechnologies);
                            newOptionList.textContent = newOption;
                            newOptionList.appendChild(deleteButton);
                            // document.querySelector('#technology_used_array').appendChild(newOptionList);
                            document.querySelector(`#selectedTechnologies${id}`).appendChild(newOptionList);
                            document.querySelector(`#selectedTechnologies${id}`).style.marginTop = "2%";
                            document.querySelector(`#selectedTechnologies${id}`).style.marginBottom = "2%";
                            document.querySelector(`#selectedTechnologies${id}`).style.border = "0.05rem solid #1F75FE";
                            technology_used_array.value = "";
                            console.log("required", seletedTechnologies);
                            });
                            };
                            technology_used_array.addEventListener("keypress", function(event) {
                                if(event.key === 'Enter') {
                                    add_Technology.click();
                                }
                            });

                            add_Technology.addEventListener("click", function() {
                                handle_add_tech(seletedTechnologies);
                            });
                    }
                    technology_used();
                    document.querySelector(`.modify_form${id}`).addEventListener("submit", async() => {
                        console.log("hello ", id);
                        const modify_form = document.querySelector(`.modify_form${id}`);
                        const formData = new FormData(modify_form);
                        console.log(formData);
                        const formObject = {};
                        formData.forEach((value, key) => {
                            formObject[key] = value;
                        });
                        const technologyUsedArray = [];
                        const technologyUsed = document.querySelectorAll('.newOptionList');
                        technologyUsed.forEach(divNodes => {
                            divNodes.childNodes.forEach(childNode => {
                                if(childNode.nodeType === Node.TEXT_NODE) {
                                    technologyUsedArray.push(childNode.textContent.trim());
                                }
                            })
                        })
                        console.log(technologyUsedArray);
                        formObject['Technology Used'] = technologyUsedArray;
                        const jsonData = JSON.stringify(formObject);
                        console.log(jsonData); 
                        // console.log("helllllllllllllllllllllll"); 

                        try {
                            // const csrfResponse = await fetch('http://127.0.0.1:8000/csrf');
                            // const csrfData = await csrfResponse.json();
                            // // const csrfToken = await csrfData.csrfToken;
                            // console.log(csrfData);
                            const response = fetch(`http://127.0.0.1:8000/api/host/modify_projects/${id}`, {
                                method: 'POST', 
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: jsonData
                            });
                            const responseData = await response;
                            console.log(responseData);
                        }
                        catch(error) {
                            console.log("error", error);
                        }
                    })
                })
            });

            // function updated_page() {
            //     const page_Numbers = document.querySelector('#entriesPage').value;
            //     console.log(page_Numbers);
            //     const url = window.location.href=
            //     `/project/${page_Numbers}`;
            //     window.location.href = url;
            // }

            $(document).ready(function() {

                // delete form modal {}
                $('#delete_form_project').submit(async function(e) {
                    e.preventDefault();
                    const data = $(this).data('project');
                    console.log(data);
                    const formUrl = `/api/host/delete_project/${data}`;
                    const response = await fetch(formUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': '{{ csrf_token() }}',
                        }
                    });
                    const responseData = await response.json();
                    console.log(responseData);
                    const display_modal = $('#display_modal .modal-body');
                    if(typeof responseData === 'string') {
                        display_modal.html(`<p style="color: red;">${responseData}</p>`);
                        $('#display_modal').modal("show");
                    }
                    else {
                        display_modal.html(`<p style='color:green'>${responseData.error}</p>`);
                        $('#display_modal').modal("show");
                    }
                });

                $('.edit_project_btn').on("click", async function() {
                    const data = $(this).data('project');
                    console.log("the data is", data);
                    await edit_data(data['project'], data['user']);
                })
                // $('#edit_form_project').submit(async function(e) {
                //     e.preventDefault();
                //     const data = $(this).data('project');
                //     console.log(data);
                //     const formUrl = `/api/host/delete_project/${data}`;
                //     const response = await fetch(formUrl, {
                //         method: 'GET',
                //         headers: {
                //             'Content-Type': 'application/json',
                //             'X-CSRF-TOKEN': '{{ csrf_token() }}',
                //         }
                //     });
                //     const responseData = await response.json();
                //     console.log(responseData);
                //     const display_modal = $('#display_modal .modal-body');
                //     if(typeof responseData === 'string') {
                //         display_modal.html(`<p style="color: red;">${responseData}</p>`);
                //         $('#display_modal').modal("show");
                //     }
                //     else {
                //         display_modal.html(`<p style='color:green'>${responseData.error}</p>`);
                //         $('#display_modal').modal("show");
                //     }
                // });
            })
        </script>
    </body>
</html>