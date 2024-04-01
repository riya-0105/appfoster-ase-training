
async function fetchData() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/host/users");
        const data_api = await response.json();
        return data_api;
    }
    catch(err) {
        console.log(err);
    }
}

async function renderData(pageNumber = 1, entriesPage = 4) {
    const container = document.querySelector(".container-info");
    const data = await fetchData();
    // console.log(data);
    if(!data || data.length === 0) {
        container.innerHTML = "No Data Found!!!";
        return;
    }
    container.innerHTML = "";
    const totalPages = Math.ceil(data.length/entriesPage);
    const startIndex = (pageNumber - 1)*entriesPage;
    const endIndex = Math.min(startIndex+entriesPage, data.length);
    const table = document.createElement('table');
    table.classList.add('table_container');
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Action</th>
        </tr>
    `;
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    for(let i=startIndex; i<endIndex; i++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${data[i].name}</td>
            <td>
                <button class="view_data${i}">View</button>
                <button class="edit_data${i}">Edit</button>
                <button class="delete_data${i}">Delete</button>
                <button class="project_user${i}">Project</button>
            </td>
        `;
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    container.appendChild(table);

    for(let i = startIndex; i < endIndex; i++) {
        const viewButton = document.querySelector(`.view_data${i}`);
        viewButton.addEventListener("click", async function() {
            await showData(data[i]);
        });

        const edit_button = document.querySelector(`.edit_data${i}`);
        edit_button.addEventListener("click", async function() {
            await editData(data[i]);
        })

        const delete_data = document.querySelector(`.delete_data${i}`);
        delete_data.addEventListener("click", async function() {
            await delete_data_fun(data[i]);
        })

        const project_user = document.querySelector(`.project_user${i}`);
        project_user.addEventListener("click", async function() {
            await project_user_fun(data[i]);
        })
    }
    //pagination
    const pagination = document.getElementsByClassName('pagination')[0];
    pagination.innerHTML = "";
    const prev_button = document.createElement('button');
    prev_button.textContent = "Prev";
    prev_button.addEventListener('click', function() {
        if(pageNumber > 1) {
            renderData(pageNumber-1, entriesPage);
        }
        else {
            pagination.innerHTML = `
                <div>No Prev Element!!</div>
            `;
            setInterval(() => {
                location.reload();
            }, 1000);
        }
    });
    pagination.appendChild(prev_button);
    for(let i=1; i<=totalPages; i++) {
        const nav_button = document.createElement('button');
        nav_button.textContent = i;
        nav_button.classList.remove('active_button');
        nav_button.addEventListener("click", () => {
            renderData(i, entriesPage);
        });
        pagination.appendChild(nav_button);   
    }
    const next_button = document.createElement('button');
    next_button.textContent = "Next";
    next_button.addEventListener("click", () => {
        if(pageNumber < totalPages) {
            renderData(pageNumber+1, entriesPage);
        }
        else {
            pagination.innerHTML = `
                <div>No Next Page!!!</div>
            `;
            setInterval(() => {
                location.reload();
            }, 1000);
        }
    });
    pagination.appendChild(next_button);
}

async function project_user_fun(data) {
    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.setAttribute("id", "userProject");
    modal.innerHTML = "";
    const response = await fetch(`http://127.0.0.1:8000/api/host/${data.id}/projects`);
    const responseData = await response.json();
    // console.log(responseData);
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Projects By ${data.name}</h5>
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
        <h6>Project Id: </h6> <p> ${item.project_id}</p><br>
        <h6>Project Name: </h6> <p>${item["Project Title"]} </p><br>
        <h6>Project Description: </h6> <p> ${item["Project Description"]} </p><br>
        <h6>Technology Used: </h6> <p> ${technology_string}</p><br>
        <h6>Created On: </h6> <p>${(new Date(Date.parse(item.created_at))).toLocaleDateString()}<p><br><hr>
    `;
    })
    document.body.appendChild(modal);
    const userModal = new bootstrap.Modal(modal);
    userModal.show();
}

async function delete_data_fun(data) {
    // console.log(data);
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
        const response = await fetch(`http://127.0.0.1:8000/api/host/delete_user/${data.id}`);
        const responseData = await response.json();
        // console.log(responseData);
        location.reload();
    })
}

async function showData(data) {
    // console.log(data);
    const modal = document.createElement('div');
    modal.innerHTML= "";
    modal.classList.add("modal", "fade");
    modal.setAttribute("id", "userModal");
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">User Data</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    ID = ${data.id}<br>
                    Name = ${data.name}<br>
                    Email Id = ${data.email}<br>
                    Gender = ${data.gender}<br>
                    Status = ${data.status}<br>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Understood</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const userModal = new bootstrap.Modal(modal);
    userModal.show();
}


async function editData(data) {
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
                        <label for="email" class="form-label">Email Address</label>
                        <input placeholder="Enter Authorised Mail" type="text" class="form-control" id="email" name="email">
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input placeholder="Enter Password" type="password" class="form-control" id="password" name="password">
                    </div>
                    <div class="mb-3">
                        <label for="name" class="form-label">Name</label>
                        <input placeholder="${data.name}" type="text" class="form-control" id="name" name="name">
                    </div>
                    <div class="mb-3 gender_data">
                        <label for="gender" class="form-label">Gender</label>
                        <input name="gender" type="radio" class="form-check-input" id="male${data.email}" ${data.gender === 'Male' ? 'checked' : ''} value="Male">Male
                        <input name="gender" type="radio" class="form-check-input" id="female${data.email}" value="Female" ${data.gender === 'Female' ? 'checked' : ''}>Female
                    </div>
                    <div class="mb-3">
                        <label for="status" class="form-check-label">Status</label>
                        <input name="status"
                        type="radio" class="form-check-input" id="active${data.email}" ${data.status === 'Active' ? 'checked' : ''} value="Active">Active
                        <input name="status" type="radio" class="form-check-input" id="inactive${data.email}" ${data.status === 'Inactive' ? 'checked' : ''} value="Inactive">Inactive
                    </div>
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
    modify_form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(modify_form);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        const jsonData = JSON.stringify(formObject);
        // console.log(jsonData); 
        // console.log("helllllllllllllllllllllll"); 
        userModal.hide();
        try {
            // const csrfResponse = await fetch('http://127.0.0.1:8000/csrf');
            // const csrfData = await csrfResponse.json();
            // // const csrfToken = await csrfData.csrfToken;
            // console.log(csrfData);
            const response = await fetch('http://127.0.0.1:8000/api/host/modify_userInfo', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonData
            });
            const responseData = await response.json();
            // console.log(responseData);
            const updatedData = await fetchData();
            await showData(updatedData.find(item => item.id === data.id));
        }
        catch(error) {
            console.log("error", error);
        }
    })
}




document.addEventListener("DOMContentLoaded", function() {
    renderData(1);
})


