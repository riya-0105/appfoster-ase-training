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
                <!-- <div class="entries_count_container">
                    <input type="number" id="entriesPage" placeholder="No. of Entries (Default Value is 4)">
                    <button class="entries_button" onclick="renderData(1, parseInt(document.getElementById('entriesPage').value) <= 0 ? 4 : parseInt(document.getElementById('entriesPage').value))">Enter</button>
                </div> -->
                <div class="entries_count_container">
                    <button class="entries_button" onclick=`window.location.href="/create_user"`>Create New Project</button>
                    <button class="entries_button" onclick="window.location.href = '/'">View Users</button>
                </div>
            </div>
            <div class="container-info">
            <div class="project_container">
            <table>
                <tr>
                    <th>Project</th>
                    <th>User Id</th>
                    <th>Action</th>
                </tr>
                @foreach($project_user as $data)
                <tr>
                    <td>{{$data['project']->{'Project Title'} }}</td>
                    <td>{{ $data['user']->name }}</td>
                    <td>
                        <button class="view_data{{ $data['project']->project_id }}" onClick="view_data({{ $data['project'] }}, {{ $data['user'] }})">View</button>
                        <button class="edit_data{{ $data['project']}}" onclick="edit_data({{ $data['project'] }}, {{ $data['user'] }})">Edit</button>
                        <button class="delete_data{{ $data['project']->project_id }}" onclick="delete_data({{ $data['project']->project_id }})">Delete</button>
                    </td>
                </tr>

                @endforeach
            </table>
        </div>
            </div>
            <div class="pagination"></div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
            crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
        crossorigin="anonymous"></script>
    </body>
</html>