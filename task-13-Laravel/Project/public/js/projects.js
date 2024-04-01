// async function getUserData(user_id, project_id) {
//     const response = await fetch(`http://127.0.0.1:8000/api/host/users/show_user_info/${user_id}`, {
//         method: 'POST',
//         header: {
//             'Content-Type': 'application/json'
//         }
//     });
//     const responseData = await response.json();
//     console.log(responseData);
//     const button = document.getElementById(`user_data${project_id}`);
//     console.log(button);
//     if (button) {
//         button.textContent = responseData.name;
//     }
// }


// document.addEventListener('click', async () => {
//     await getUserData(user_id, project_id);
// })



function view_data(project, user) {
    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.setAttribute("id", `data_user_${project.project_id}`);
    modal.innerHTML = "";
    const technology_array = project['Technology Used'].split(',');
    const technology_used = technology_array.map(tech => tech.replace(/"/g, ''));
    const technology_string = technology_used.join(', ')
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5>Project Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Project ID = ${project.project_id}<br><br>
                    Project Name = ${project["Project Title"]}<br><br>
                    Technology Used = ${technology_string}
                    <br><br>
                    Project Description = ${project['Project Description']}<br><br>
                    User Name = ${user.name}<br><br>
                    Created On = ${project['Created On']}<br><br>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close">Close</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Understood</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    $projectModal = new bootstrap.Modal(modal);
    $projectModal.show();
}


async function delete_data(project_id) {
    // console.log("hello");
    const modal = document.createElement('div');
    modal.classList.add("modal", "fade");
    modal.setAttribute("id", "userdeleteConfirm");
    modal.innerHTML= "";
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Delete Confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure to Delete User?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="data_delete">Delete</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const modalUser = new bootstrap.Modal(modal);
    modalUser.show();
    const data_delete = document.querySelector('#data_delete');
    data_delete.addEventListener("click", async function() {
        const response = await fetch(`http://127.0.0.1:8000/api/host/delete_project/${project_id}`);
        const responseData = await response.json();
        // console.log(responseData);
        location.reload();
    })
}


async function edit_data(project, user) {
    const modal = document.createElement('div');
    modal.innerHTML = "";
    modal.classList.add("modal", "fade");
    modal.setAttribute("id", "userModaledit");
    
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">User Data</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form class="modify_form">
                    <div class="modal-body">
                    <div class="mb-3">
                        <label for="project_id" class="form-label">Project Id</label>
                        <input placeholder=${project.project_id} type="text" class="form-control" id="project_id" name="project_id" disabled>
                    </div>
                    <div class="mb-3">
                        <label for="projectTitle" class="form-label">Project Title</label>
                        <input placeholder="${project['Project Title']}" type="password" class="form-control" id="projectTitle" name="projectTitle" disabled>
                    </div>
                    <div class="mb-3">
                        <label for="user_name" class="form-label">User Name</label>
                        <input placeholder="${user.name}" type="text" class="form-control" id="user_name" name="user_name" disabled>
                    </div>
                    <div class="mb-3">
                        <label for="technologyUsed" class="form-label">Technology Used</label>
                        <input type="text" class="form-control" id="technologyUsed" name="Technology Used" placeholder="${project['Technology Used'].split(',').map((tech => tech.replace(/"/g, '')))}">
                        <div id="selectedTechnologies" class="d-flex selected_tech"></div>
                        <button type="button" class="btn btn-primary" id="addTechnology">Add Technology</button>
                    </div>
                    <div class="mb-3">
                        <label for="createdOn" class="form-label">Created On</label>
                        <input placeholder="${project['Created On']} Format : YYYY-MM-DD" type="date" class="form-control" id="createdOn" name="Created On">
                    </div>
                    <div class="mb-3">
                        <label for="projectDescription" class="form-label">Project Description</label>
                        <input placeholder="${project['Project Description']}" type="text" class="form-control" id="projectDescription" name="Project Description">
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" >Submit</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    
    document.body.appendChild(modal);
    const userModal = new bootstrap.Modal(modal);
    userModal.show();
    const modify_form = document.querySelector('.modify_form');
    await technology_used();
    modify_form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(modify_form);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        const technologyUsedArray = [];
        const technologyUsed = document.querySelectorAll('.newOptionList');
        console.log("hello ", technologyUsed);
        technologyUsed.forEach(divNodes => {
            divNodes.childNodes.forEach(childNode => {
                if(childNode.nodeType === Node.TEXT_NODE) {
                    technologyUsedArray.push(childNode.textContent.trim());
                }
            })
        })
        // const technologyUsedArray = Array.from(technologyUsed.children).map(option =>option.textContent.trim());
        console.log(technologyUsedArray);
        formObject['Technology Used'] = technologyUsedArray;
        const jsonData = JSON.stringify(formObject);
        console.log(jsonData); 
        // console.log("helllllllllllllllllllllll"); 
        userModal.hide();
        try {
            // const csrfResponse = await fetch('http://127.0.0.1:8000/csrf');
            // const csrfData = await csrfResponse.json();
            // // const csrfToken = await csrfData.csrfToken;
            // console.log(csrfData);
            const response = fetch(`http://127.0.0.1:8000/api/host/modify_projects/${project.project_id}`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonData
            });
            const responseData = await response;
            if (responseData.status !== 200) {
                let fetchMessage;
                if(responseData.status === 500) {
                    fetchMessage = "500 error: server encountered an unexpected condition that prevented it from fulfilling the request ";
                }
                else if(responseData.status === 404) {
                    fetchMessage = "404 error: a server could not find a client-requested webpage";
                }
                else {
                    fetchMessage = "Error: server encountered unknown error";
                }
                setInterval(() => {
                    display_modal(fetchMessage, true);
                }, 5000);
            }
            else {
                console.log("User Created Successfully!!");
                setTimeout(() => {
                    display_modal("Success", false);
                }, 1000);
                // setTimeout(() => {
                //     view_data(project, user);
                // }, 1000);
            }
            // const updated_data = await fetch('http://127.0.0.1:8000/api/host/show_project/{id}', {
            //     method: 'POST',

            // })

        }
        catch(error) {
            console.log("error", error);
        }
    })
}


function display_modal(message, isError) {
    const modal = document.createElement('div');
    modal.classList.add("modal", "fade");
    modal.setAttribute("id", `modal-create-user`);
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button class="btn-close" type="button" data-bs-dismiss="Close" aria-label="Close" onClick="location.reload()"></button>
                </div>
                <div class="modal-body">
                    <p style="${isError ? "color: red;" : 'color:green;'}">${message}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick="location.reload()">Close</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick="location.reload()">Done</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const modal_window = new bootstrap.Modal(modal);
    modal_window.show();
}

async function technology_used() {
    const technology_used_array = document.querySelector('#technologyUsed');
    technology_used_array.setAttribute('tabindex', '0');
    const add_Technology = document.querySelector('#addTechnology');
    const seletedTechnologies = [];

    function handle_add_tech(seletedTechnologies) {
        const newTechnology = technology_used_array.value.trim().split(',').map(option => option.trim());
        console.log("hello", newTechnology);
        newTechnology.forEach(newOption => {
            console.log(newOption);
            const newOptionList = document.createElement('div');
            newOptionList.classList.add('newOptionList');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'x';
            deleteButton.classList.add("btn");
            deleteButton.classList.add("btn-primary");
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
            document.querySelector('#selectedTechnologies').value = JSON.stringify(seletedTechnologies);
            newOptionList.textContent = newOption;
            newOptionList.appendChild(deleteButton);
            // document.querySelector('#technology_used_array').appendChild(newOptionList);
            document.querySelector('#selectedTechnologies').appendChild(newOptionList);
            document.querySelector('#selectedTechnologies').style.marginTop = "2%";
            document.querySelector('#selectedTechnologies').style.marginBottom = "2%";
            document.querySelector('#selectedTechnologies').style.border = "0.05rem solid #1F75FE";
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

function display_modal(message, isError) {
    const modal = document.createElement('div');
    modal.classList.add("modal", "fade");
    modal.setAttribute("id", `modal-create-user`);
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button class="btn-close" type="button" data-bs-dismiss="Close" aria-label="Close" onClick="location.reload()"></button>
                </div>
                <div class="modal-body">
                    <p style="${isError ? "color: red;" : 'color:green;'}">${message}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick="location.reload()">Close</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick="location.reload()">Done</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const modal_window = new bootstrap.Modal(modal);
    modal_window.show();
}
