import 'bootstrap/js/dist/util';
import 'bootstrap/dist/js';

async function fetchData() {
    try {
        const response = await fetch("https://gorest.co.in/public/v2/users");
        const data_api = await response.json();
        return data_api;
        
    } catch(error) {
        console.log(error)
    }
}

async function renderData() {
    const container = document.querySelector(".container_data");
    const action_container = document.getElementsByClassName("action_container")[0];
    const data = await fetchData();
    if(!data || data.length === 0) {
        container.innerHTML = "No data Found!!!";
        return;
    }
    const new_div_header = document.createElement('div');
    new_div_header.style.display = "flex";
    new_div_header.style.width = "90%";
    const newHeader = document.createElement("h4");
    const new_header_action = document.createElement("h4");
    new_header_action.textContent = "Action";
    new_header_action.style.marginLeft = "auto";
    new_header_action.style.marginRight = "2%";
    newHeader.textContent = "UserName";
    new_div_header.appendChild(newHeader);
    new_div_header.appendChild(new_header_action);
    const newDiv = document.createElement('div');
    newDiv.classList.add("data_style");
    newDiv.appendChild(new_div_header);
    data.forEach(item => {
        const new_Div_body = document.createElement('div');
        new_Div_body.style.display = "flex";
        new_Div_body.classList.add("data_body");
        const new_div_info = document.createElement('div');
        new_div_info.classList.add("collapse");
        new_div_info.setAttribute("id", `collapse_info_${item.id}`);
        new_div_info.classList.add("collapse");
        const new_div_span = document.createElement('span');
        new_div_span.innerHTML = `
        ID = ${item.id} <br>
        Email ID = ${item.email} <br>
        Gender = ${item.gender} <br>
        Status = ${item.status} <br>
        `; 
        new_div_info.appendChild(new_div_span);
        new_Div_body.width = "100%";
        const newH3 = document.createElement('h3');
        newH3.textContent = item.name;
        newH3.style.width = "82%";
        const newButton = document.createElement("button");
        newButton.style.marginLeft = "auto";
        newButton.style.marginRight = "14%";
        const hr = document.createElement('hr');
        hr.style.width = "95%";
        hr.style.borderColor = "black";
        newButton.style.backgroundImage = "url(https://icones.pro/wp-content/uploads/2021/05/symbole-de-l-oeil-bleu.png)";
        newButton.style.justifyContent = "flex-end";
        newButton.dataset.bsToggle = "collapse";
        newButton.dataTarget = `collapse_info_${item.id}`;
        new_Div_body.appendChild(newH3);
        new_Div_body.appendChild(newButton);
        newDiv.appendChild(new_Div_body);
        newDiv.appendChild(new_div_info);
        newDiv.appendChild(hr);
        newDiv.appendChild(new_div_info);
        const toggle_element = document.getElementById("collapse_info");
        new bootstrap.Collapse(toggle_element);  
    })
    console.log(container);
    container.appendChild(newDiv);
}

document.addEventListener("DOMContentLoaded", function() {
    renderData()
})