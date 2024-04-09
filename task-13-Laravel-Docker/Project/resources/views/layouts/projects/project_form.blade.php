<!DOCTYPE html>
<html>
    <head lang="{{ str_replace('_', '-', app()->getLocale()) }}">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="css/form.css">
        <script src="js/project_form.js"></script>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    </head>
    <body>
        <div class="redirect_button">
            <button class="btn btn-primary" onclick="window.location.href = ('/project')">Back to Projects</button>
        </div>
        <div class="container_form">
        <form class="form-new-user">
            <!-- @csrf -->
            <div class="form-group">
                <h4>Create New Project</h4>
            </div>
            <div class="form-group">
                <label for="projectTitle">Project Title</label>
                <input type="text" class="form-control" id="projectTitle" placeholder="Enter Project Title" name="Project Title">
            </div>
            <div class="form-group">
                <label for="technologyUsed">Technology Used</label>
                <input type="text" class="form-control technology_used" id="technologyUsed" placeholder="Enter Technology Used" name="Technology Used">
                <div id="selectedTechnologies" class="d-flex selected_tech"></div>
                <button type="button" class="btn btn-primary" id="addTechnology">Add Technology</button>
            </div>
            <div class="form-group">
                <label for="projectDescription">Project Description</label>
                <input type="text" class="form-control" id="projectDescription" placeholder="Enter Project Description" name="Project Description">
            </div>
            <div class="form-group">
                <select class="form-select" name="user_id" aria-label="user_id">
                    <option selected>User</option>
                @foreach($user as $userdata) 
                    <option value="{{$userdata['id']}}">{{$userdata['id']}} : {{$userdata['name']}}</option>
                @endforeach
                </select>
            </div>
            <div class="d-flex justify-content-center">
                <button type="submit" class="btn btn-primary" class="create-new-user-button">Submit</button></div>
            </form>
            <!-- {{-- @if(isset($data)) --}} -->
                <!-- <div class="exception_container">
                    <div class="alert alert-light exception_box" role="alert">
                        <h4 class="alert-heading">User Data</h4>
                        <p>
                        
                    </div>
                </div> -->
                <!-- <div class="modal fade" tabindex="-1" role="dialog" id="userDataModal">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                        <div class="modal-header d-flex">
                            <h5 class="modal-title">Modal title</h5>
                            <button type="button" class="close ms-auto btn btn-light" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p>
                            {{-- @php
                            $data_content = json_decode($data->getContent(), true);
                            $data_getStatusCode = $data->getStatusCode();
                            @endphp --}}
                            {{-- @if($data_getStatusCode === 200)
                                @foreach($data_content as $key => $value)
                                    <p>{{ $key }} : {{ $value }}</p>
                                @endforeach
                            @else
                                <p style="color:red">Error: {{ $data->content() }}</p>
                            @endif</p></p> --}}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Understood</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                        </div>
                    </div>
                </div> -->
            <!-- {{-- @endif --}} -->
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
            crossorigin="anonymous"></script>
        <!-- <script>
            $(document).ready(function(){
                $('#userDataModal').modal('show');
            });
        </script> -->
        
    </body>
</html>