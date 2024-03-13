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
  
  async function populateUserList(){
    const userList = document.getElementById('user-list');
    try {
      const users = await fetchUsers();
      if (!users) {
        console.error('Failed to fetch user data.');
        return;
      }
      users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.name}</td>
          <td>
            <button type="button" class="btn btn-primary view-more" data-user-id="${user.id}">View More
            </button>
            </button>
          </td>
        `;
        userList.appendChild(row);
      });
  
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
      })
      userInfoModal.modal('show');
    }catch (error){
      console.error('Error fetching user info:', error);
    }
  }
  
  
  document.addEventListener('DOMContentLoaded', function(){
    populateUserList();
  });