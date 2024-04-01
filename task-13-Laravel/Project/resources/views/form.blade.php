<!DOCTYPE html>
<html>
    <head lang="{{ str_replace('_', '-', app()->getLocale()) }}">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="css/form.css">
        <script src="js/form.js"></script>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    </head>
    <body>
        <div class="redirect_button">
            <button class="btn btn-primary" onclick="window.location.href = ('/')">Back to Home</button>
        </div>
        <div class="container_form">
        <form class="form-new-user">
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
                <span class="password-toggle-icon"><i class="fas fa-eye"></i></span>
            </div>
            <div class="form-group form-check-inline">
                <label class="form-label" for="gender">Gender</label>
                <input type="radio" class="form-check-input " id="male" value="Male" name="gender">
                <label class="form-check-label " for="male">Male</label>
                <input type="radio" class="form-check-input " id="female" value="Female" name="gender">
                <label class="form-check-label " for="female">Female</label>
            </div><br>
            <div class="form-group form-check-inline">
                <label class="form-label" for="status">Status</label>
                <input type="radio" class="form-check-input " id="active" value="Active" name="status">
                <label class="form-check-label" for="active">Active</label>
                <input type="radio" class="form-check-input" id="inactive" value="Inactive" name="status">
                <label class="form-check-label" for="inactive">Inactive</label>
            </div><br>
            <div class="d-flex justify-content-center">
                <button type="submit" class="btn btn-primary" class="create-new-user-button">Submit</button></div>
            </form>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
            crossorigin="anonymous"></script>
    </body>
</html>