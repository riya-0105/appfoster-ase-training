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
        const jsonData = JSON.stringify(formObject);
        console.log(jsonData);
        try {
            const fetchData = fetch("http://127.0.0.1:8000/api/host/users/create_new", {
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

            setTimeout(()=>{
                location.reload();
            }, 5000);
        }
        catch(err) {
            console.log("Error ", err.message);
        }

    });
};

document.addEventListener('DOMContentLoaded', function() {
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