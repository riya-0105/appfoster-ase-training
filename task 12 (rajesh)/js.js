async function fetchUsers(){
    try {
      let response = await fetch(`https://gorest.co.in/public/v2/users`);
      let data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }
  
  async function populateUserList(pageNumber = 1, entries = 4){
    const userList = document.getElementById('user-list');
    try {
      const users = await fetchUsers();
      if (!users) {
        console.error('Failed to fetch user data.');
        return;
      }
      const total_pages = Math.ceil(users.length/entries);
      const startIndex = (pageNumber-1) * entries, endIndex = Math.min(startIndex + entries, users.length)
      userList.innerHTML = "";
      for(let i=startIndex; i<endIndex; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${users[i].name}</td>
          <td>
            <button type="button" class="btn btn-primary view-more" data-user-id="${users[i].id}">View More
            </button>
            </button>
            </td>
          `;
        userList.appendChild(row);
      };

      const container_page = document.getElementsByClassName("pagination_container")[0];
      container_page.innerHTML = "";
      const prev_pagination = document.createElement('button');
      prev_pagination.setAttribute("id", "prev_page_btn");
      prev_pagination.textContent = "Prev";
      container_page.appendChild(prev_pagination);

      prev_pagination.addEventListener("click", () => {
        if(pageNumber>1) {
          populateUserList(pageNumber-1);
        }
        else {
          container_page.innerHTML = (`
            <div>
              Previous Page not allowed!!!
            </div>
          `)
          setInterval(() => {
            location.reload();
          }, 1000)
        }
      })

      
      
      for(let i=1; i<=total_pages; i++) {
        const index_pagination = document.createElement('button');
        index_pagination.setAttribute("id", `index_page_btn${i}`);
        index_pagination.addEventListener("click", () => {
          populateUserList(i, entries);
        }) 
        index_pagination.textContent = i;
        container_page.appendChild(index_pagination);
      }

      const next_pagination = document.createElement("button");
      next_pagination.textContent = "Next";
      next_pagination.addEventListener("click", () => {
        if(pageNumber<total_pages) {
          populateUserList(pageNumber+1);
        }
        else {
          container_page.innerHTML = (`
            <div>
              Next Page not allowed!!!
            </div>
          `)
          setInterval(() => {
            location.reload();
          }, 1000)
        }
      })
      container_page.appendChild(next_pagination);
      const viewMoreButtons = document.querySelectorAll('.view-more');
       viewMoreButtons.forEach(button =>{
        button.addEventListener('click', function(){
          const userId = this.getAttribute('data-user-id');
          console.log(userId)
          displayUserInfo(userId);
        });
       });
    }catch (error){
      console.error('Error fetching user data:', error);
    }
  }
  
  async function fetchUser(userId){
    try {
      let response = await fetch(`https://gorest.co.in/public/v2/users/${userId}`);
      let data = await response.json();
      return data.data;
    }catch (error){
      console.error('Error fetching user data:', error);
      return null;
    }
  }
  
  async function displayUserInfo(userId){
    try{
      const user = await fetchUsers(userId);
      if (!user){
        console.error('User data is undefined or null.');
        return;
      }
      
      console.log('User data:', user);
      const userInfoModal = $('#userInfoModal');
      const userInfo = document.getElementById('user-info');
      console.log(userId);
      user.forEach(user_id => {
        console.log(userId, user_id.id)
        if(user_id.id == userId) {
            userInfo.innerHTML = `
            <table class="table">
            <tr>
                <th>ID</th>
                <td>${user_id.id}</td>
            </tr>
            <tr>
                <th>Name</th>
                <td>${user_id.name}</td>
            </tr>
            <tr>
                <th>Email</th>
                <td>${user_id.email}</td>
            </tr>
            <tr>
                <th>Gender</th>
                <td>${user_id.gender}</td>
            </tr>
            <tr>
                <th>Projects</th>
                <td>${user_id.projects}</td>
            </tr>
            </table>
        `;
        }
        userInfoModal.modal({show: true, backdrop: false, fade: false});
      })
      
    }catch (error){
      console.error('Error fetching user info:', error);
    }
  }
  
  
  document.addEventListener('DOMContentLoaded', function(){
    populateUserList(1);
  });