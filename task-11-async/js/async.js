
async function fetchData() {
    try {
        const response = await fetch("https://gorest.co.in/public/v2/users");
        const data_api = await response.json();
        return data_api;
        
    } catch(error) {
        console.log(error)
    }
}


async function renderData(pageNumber = 1, entriesPage = 4) {
    const container = document.querySelector(".container_data");
    const data = await fetchData();
    if(!data || data.length === 0) {
        container.innerHTML = "No data Found!!!";
        return;
    }
    container.innerHTML = "";
    const totalPages = Math.ceil(data.length/entriesPage);
    const startIndex = (pageNumber - 1) * entriesPage;
    const endIndex = Math.min(startIndex + entriesPage, data.length);
    const new_div_header = document.createElement('div');
    new_div_header.style.display = "flex";
    new_div_header.style.width = "90%";
    const newHeader = document.createElement("h4");
    const new_header_action = document.createElement("h4");
    new_header_action.textContent = "Action";
    new_header_action.style.marginLeft = "auto";
    new_header_action.style.marginRight = "1.05%";
    newHeader.textContent = "UserName";
    new_div_header.appendChild(newHeader);
    new_div_header.appendChild(new_header_action);
    const newDiv = document.createElement('div');
    newDiv.classList.add("data_style");
    newDiv.appendChild(new_div_header);
    for(let i=startIndex; i<endIndex; i++) {
        const item = data[i];
        const new_Div_body = document.createElement('div');
        new_Div_body.style.display = "flex";
        new_Div_body.classList.add("data_body");
        const new_div_info = document.createElement('div');
        new_div_info.classList.add("collapse");
        new_div_info.setAttribute("id", `collapse_info_${item.id}`);
        new_div_info.classList.add("collapse");
        // const new_div_span = document.createElement('span');
        // new_div_span.innerHTML = `
        // <div>
        //     ID = ${item.id} <br>
        //     Email ID = ${item.email} <br>
        //     Gender = ${item.gender} <br>
        //     Status = ${item.status} <br>
        // </div>
        // `; 
        // new_div_span.classList.add("span_container");
        // new_div_span.style.marginRight = "5%";
        // new_div_info.appendChild(new_div_span);
        new_Div_body.width = "100%";
        const newH3 = document.createElement('h3');
        newH3.textContent = item.name;
        newH3.style.width = "82%";
        const newButton = document.createElement("button");
        newButton.style.marginLeft = "auto";
        newButton.style.marginRight = "10%";
        const hr = document.createElement('hr');
        hr.style.width = "95%";
        hr.style.borderColor = "black";
        newButton.style.justifyContent = "flex-end";
        newButton.addEventListener('click', async function() {
            await user_info(item);
        });
        new_Div_body.appendChild(newH3);
        new_Div_body.appendChild(newButton);
        newDiv.appendChild(new_Div_body);
        newDiv.appendChild(new_div_info);
        newDiv.appendChild(hr);
        container.appendChild(newDiv);
        // console.log("height", new_div_span.offsetHeight)
        // newButton.addEventListener("click", function() {
        //     console.log(document.querySelector(`#collapse_info_${item.id}`).offsetHeight)
        //     document.querySelector(`#collapse_info_${item.id}`).classList.toggle("show");
        // })
    }
    // pagination
    const paginationContainer = document.getElementsByClassName('pagination')[0];
    paginationContainer.innerHTML = "";
    paginationContainer.classList.add("pagination");
    paginationContainer.setAttribute("id", "pagination");

    // previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = "Prev";
    prevButton.addEventListener('click', () => {
        if(pageNumber > 1) {
            const buttons = paginationContainer.querySelectorAll("button");
            buttons.forEach(btn => btn.classList.remove("active"));
            renderData(pageNumber - 1, entriesPage);
        }
        else {
            paginationContainer.innerHTML = `
                <div>No previous Element!!</div>
            `;
            setInterval(() => {
                location.reload();
            }, 1000)
        }
    })
    paginationContainer.appendChild(prevButton);


    // Index for each page
    for(let i=1; i<=totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        // console.log("button", pageButton)
        pageButton.classList.remove("active_button");
        pageButton.addEventListener("click", () => {
            pageButton.classList.add("active_button");
            // console.log(pageButton)
            renderData(i, entriesPage);
        });
        paginationContainer.appendChild(pageButton);
    }

    // next page
    const nextPage = document.createElement('button');
    nextPage.textContent = "Next";
    nextPage.addEventListener("click",  () => {
        if(pageNumber < totalPages) {
            renderData(pageNumber + 1, entriesPage);
        }
        else {
            paginationContainer.innerHTML = `
            <div>No Next Page!!</div>
            `
            setInterval(() => {
                location.reload()
            }, 1000);
        }
    })
    paginationContainer.appendChild(nextPage);
}


async function user_info(item) {
    console.log(item);
    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.setAttribute('id', 'userModal');
    modal.innerHTML = 
    `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">User Data</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
        ID = ${item.id} <br>
        Email ID = ${item.email} <br>
        Gender = ${item.gender} <br>
        Status = ${item.status} <br>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" onclick="location.reload()">Understood</button>
        </div>
      </div>
    </div>`
    ;
    document.body.appendChild(modal);
    const userModal = new bootstrap.Modal(modal);
    userModal.show();
}

document.addEventListener("DOMContentLoaded", function() {
    renderData(1);
})