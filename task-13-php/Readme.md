The `project` bash script allows you to run some project related commands easily. 

The application is run through docker container but for this project you would mostly need access to node/npm, php and the database. 

To make sure `project` script is executable run the following command in this directory 

`chmod +x project`


### Startup the project

`./project up`

Keep this command running to keep the services working. For other commands open up a new terminal window.

### Start the Laravel project

`./project start`

**Note:** The project would need additional setup mentioned in the src/README.md before you can start using it.

### Access the app container

`./project app` gives you access to the php app container and you can run additional commands in the container.
e.g 

`./project app composer install`

### Node related commands


`./project node <command>`

e.g if you want to run `node -v` you do 

`./project node -v`

### npm related commands

`./project npm <command>`

e.g if you want to run `npm start` you do 

`./project npm start`


### Accessing database

It includes an adminer image which should run on [localhost:8080](http://localhost:8080/adminer.php)

Login with username/password mentioned in src/.env.example





