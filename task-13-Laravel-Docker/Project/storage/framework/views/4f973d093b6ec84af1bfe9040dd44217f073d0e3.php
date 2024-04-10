<!DOCTYPE html>
<html>
    <head lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="css/form.css">
        <script src="js/form.js"></script>

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    </head>
    <body>
        <div class="redirect_button">
            <button class="btn btn-primary" id="home_page_btn">Back to Home</button>
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
                <!-- <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Enter Password" name="password">
                    <small class="form-text text-muted">Password length should be >8 minimum 3 Character and digits and at least on special charater out of ! _ @</small>
                    <span class="password-toggle-icon"><i class="fas fa-eye"></i></span>
                </div> -->
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
            <?php if(!empty($data)): ?>
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
                            <?php
                            $data_content = $data->getContent();
                            $data_getStatusCode = $data->getStatusCode();
    
                            ?>
                            <?php if($data_getStatusCode === 200): ?>
                                $responseObject = [];
                                <?php $__currentLoopData = $data_content; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $value): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    $responseObject[$key] = $value;
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                <p>Success</p>
                                <!-- <p>Status: <?php echo e($responseObject['status']); ?></p> -->
                            <?php else: ?>
                                <p style="color:red">Error: <?php echo e($data->content()); ?></p>
                            <?php endif; ?>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Understood</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                        </div>
                    </div>
                </div>
            <?php endif; ?>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
            crossorigin="anonymous"></script>
            <script>
                
                $(document).ready(function(){

                    // let formSubmitted = false;
                    // $('#create_user_form').on("submit", async function()  {
                    //     formSubmitted = true;
                    //     if(formSubmitted) {
                    //         <?php if(isset($data) && $data !== null): ?>
                    //             const data = <?php echo json_encode($data, 15, 512) ?>;
                    //             console.log(data);
                    //             await $('#userDataModal').modal('show');
                    //         <?php endif; ?>
                    //             formSubmitted = false;
                    //         }
                    //     // location.reload();
                    // })
                    
                    $('#home_page_btn').on("click", function() {
                        window.location.href = '/';
                    });
                });
            </script>
    </body>
</html> <?php /**PATH C:\Users\lenovo\Documents\appfoster-ase-training\task-13-Laravel-Docker\Project\resources\views/layouts/users/form.blade.php ENDPATH**/ ?>