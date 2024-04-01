async function add_new_user() {
    const create_user_form = document.querySelector('.form-new-user');

    console.log(create_user_form);
    create_user_form.addEventListener("submit", async function(event) {
        event.preventDefault();
        const formData = new FormData(create_user_form);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        const technologyUsed = document.querySelectorAll('.new');
        const technologyUsedArray = Array.from(technologyUsed.children).map(option =>option.textContent.trim());
        formObject['Technology Used'] = technologyUsedArray;
        const jsonData = JSON.stringify(formObject);
        console.log(jsonData);
        try {
            const fetchData = fetch("http://127.0.0.1:8000/api/host/create_project", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
            });
            const responseData = await fetchData;
            console.log(responseData);
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
                display_modal(fetchMessage, true);
            }
            else {
                console.log("User Created Successfully!!")
                display_modal("Success", false);
            }

            // setTimeout(()=>{
            //     location.reload();
            // }, 5000);
        }
        catch(err) {
            console.log("Error ", err.message);
        }

    });
};

document.addEventListener('DOMContentLoaded', function() {
    technology_used();
    add_new_user();
});

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