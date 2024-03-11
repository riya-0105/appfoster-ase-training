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
    const container = document.getElementsByClassName("container_data");
    const data = await fetchData();
    if(!data) {
        return;
    }
    const newDiv = document.createElement('div');
    data.forEach(item => {
        const newH3 = document.createElement('h3')
        newH3.textContent = item.name;
        newDiv.appendChild(newH3);
        console.log(item.name)
    })
    console.log(container);
    container.appendChild(newDiv);
}

renderData()