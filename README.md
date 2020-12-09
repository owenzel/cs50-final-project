####  VirtuConnect

Project Video: https://www.youtube.com/watch?v=IRtBms3T5Xc&ab_channel=CynthiaChen

Part A: Accessing the Main Project

There are two different ways to access our project. Method One allows you to quickly view the final result, and Method Two allows you to modify the code on your own device.

Method One: Use the online public build.

   1. Visit https://cko-cs50-final-project.herokuapp.com/ in your browser of choice. (We recommend Chrome.)

Method Two: Create and run a local copy.

   1. Install the following:
      a. Node, a runtime environment for Javascript: https://nodejs.org/en/ AND...
      b. Node Package Manager (npm), which will help you easily install our project dependencies: https://www.npmjs.com/get-npm

   2. Visit the GitHub repository of our main application at https://github.com/owenzel/cs50-final-project in your browser of choice..

   3. Download the project onto your local computer via your preferred method. We suggest downloading a ZIP file, cloning the repository via Git, or forking the repository and then downloading or cloning it onto your device.

   4. Open the project you just cloned/downloaded in your preferred IDE, such as Visual Studio Code.

   5. Open a terminal and change directories into the project folder. Install the server-side dependencies, which you can see listed in the package.json file, by running “npm install”.

   6. Change directories into the front-end/ folder inside of the root project folder. Install the client-side dependencies, which you can see listed in the package.json file inside of this folder, by running “npm install”.

  7. Change directories back into the root project folder. Start the server on port 5000 by running “node server.js” OR “npm start”.

  8. Open another terminal (and keep the server running in your first terminal). Change directories into the project’s front-end/ folder. You have two options for viewing the client-side code. Either
   a. Create a build of the frontend by running “npm run build”. Then, visit “http://localhost:5000” in your browser of choice. OR...
   b. Start a development server for the frontend on port 3000 by running “npm run start”. Then, visit “http://localhost:3000” in your browser of choice.

NOTES:
- If you make changes to the code outside of the front-end/ folder, you must restart the server by entering the following in your original terminal: Ctrl+C on PC or Cmd+C on Mac. Then, repeat step 7.
- If you make changes to the code inside of the front-end/ folder and you followed 8a, you must rebuild the frontend by running “npm run build” again in the front-end/ folder. If you followed 8b, you should see your changes reflected while the development server is still running (from “npm run start”). If not, you may need to refresh your browser tab.

Part B: Connecting to the Database

If you followed Method 2 in Part A and would like to learn how to connect to the database to make your own queries (beyond what we provide for you in the code), please continue with this section. Otherwise, skip to Part C.

Our database is a PostgreSQL database hosted on Heroku. We have connected our server as a database client in server.js. 

It may also be possible to establish this connection to another database or with another client; to do so, take the following steps we used to connect our server to the database, in the appropriate files with the corresponding information.

The credentials for connecting to our database on Heroku are as follows (include the following segment of code in your file):

const client = new Client({
    user: 'ldqkazfnoxapti',
    host: 'ec2-18-210-90-1.compute-1.amazonaws.com',
    database: 'daboml4e3mocb8',
    password: '2c49c51d112910a43fb2d109e7120425d67b1b217000974d5fe26a20c8fc5c2c',
    port: '5432',
    ssl: {
      rejectUnauthorized: false
    }
});

Connect our client with “client.connect();” 

Once the connection has been established, we can directly make database queries from server.js via “client.query()”.

Particularly for testing and table creation purposes, it is convenient to be able to access the database via a command-line interface.

Open a new tab in the terminal you have open. Run “psql -h ec2-18-210-90-1.compute-1.amazonaws.com -U ldqkazfnoxapti daboml4e3mocb8” and type in the above password when prompted.

You can now directly access the database from the command line. Beyond query statements to the tables, there are also other functions that are helpful.
To view all the tables in the database, run “\dt”
To view a more specific description of a table, such as its columns or constraints, run “\d [table_name]”
To run queries such as “INSERT INTO” or “SELECT”, directly type them into the CLI

If you wish to recreate the five tables currently in our database:

 `DROP TABLE  IF EXISTS scheduling_preferences;
DROP TABLE  IF EXISTS week;
DROP TABLE  IF EXISTS matches;
DROP TABLE  IF EXISTS people;
DROP TABLE  IF EXISTS users;

CREATE TABLE users (
	user_id SERIAL PRIMARY KEY, 
	name VARCHAR (50) NOT NULL, 
	password VARCHAR(50) NOT NULL, 
	email VARCHAR (255) NOT NULL, 
	created_on TIMESTAMP NOT NULL, 
	last_login TIMESTAMP
);

CREATE TABLE people (
	person_id SERIAL PRIMARY KEY, 
	user_id INT, 
	organization VARCHAR (255) NOT NULL, 
	ADDRESS VARCHAR (255),
	CONSTRAINT fk_users
		FOREIGN KEY(user_id)
			REFERENCES users(user_id)
);

CREATE TABLE matches (
	person1_id INT, 
	person2_id INT,
	CONSTRAINT fk_user1
		FOREIGN KEY(person1_id)
			REFERENCES people(person_id),
	CONSTRAINT fk_user2
		FOREIGN KEY(person2_id)
			REFERENCES people(person_id)
);

CREATE TABLE week (
	weekday_id SERIAL PRIMARY KEY,
	day VARCHAR (50) UNIQUE NOT NULL
);

Because this table consists of the days of the week, each with its own unique id, we manually populated this table with a series of insert statements:
INSERT INTO week(day) VALUES (“Monday”)
INSERT INTO week(day) VALUES (“Tuesday”)
INSERT INTO week(day) VALUES (“Wednesday”)
INSERT INTO week(day) VALUES (“Thursday”)
INSERT INTO week(day) VALUES (“Friday”)
INSERT INTO week(day) VALUES (“Saturday”)
INSERT INTO week(day) VALUES (“Sunday”)

CREATE TABLE scheduling_preferences (
	person_id INT,
	day_id INT,
	CONSTRAINT fk_people
		FOREIGN KEY(person_id)
			REFERENCES people(person_id),
	CONSTRAINT fk_week
		FOREIGN KEY(day_id)
			REFERENCES week(weekday_id)
); `

Part C: Using the Main Project

Once you have (a) local server(s) up and running or you’re on the Heroku build at https://cko-cs50-final-project.herokuapp.com/, you should see the Home “page”. (Technically, this is a single-page React application, but we’ll refer to the main React Components -- Home, Register, Login, Dashboard, and Profile -- as pages from now on).

The Home page contains instructions for using the application.

To register for an account, click the “Register” link on the Navigation Bar in the top left, click one of the “Register” buttons on the Home Page, or append “register” to the URL https://cko-cs50-final-project.herokuapp.com/ and press enter. You will then be taken to the Register page. Fill out all of the fields in the form, making sure that you enter a valid-looking email address and that the passwords in the last two fields match. Then, press “register”. If there were no issues, you should see a green alert that says “You are registered! Now you can log in with your new account!”.

To log in to your newly created account. Click the “Log In” link on the Navigation Bar in the top left or append “login” to the URL https://cko-cs50-final-project.herokuapp.com/ and press enter. You will then be taken to the Log In page. Fill out all of the fields in the form with your newly created account credentials. If you wish to test logging in with a different account, you can use the following email and password instead: “rye@gmail.com” and “pass”, respectively. If there were no issues logging in, you should be redirected to the Home page, but you will be able to access a Dashboard page and a Profile page (as well as a Log Out button) from the Navigation Bar at the top of the page. Because we have used the rye@gmail.com account throughout our development process, it has already been matched; the Dashboard page for this account will show the corresponding match, whereas that for a newly created account may not, depending on when it was created and when you are viewing the Dashboard (see the Dashboard section below).

The Profile page provides a form requesting information regarding organization affiliation, address, preferred meeting times, and interests. To visit the Profile page, click the “Profile” link on the Navigation Bar in the top left or append “profile” to the URL https://cko-cs50-final-project.herokuapp.com/ and press enter. Fill out the fields, then press the button at the bottom of the form. You will see that although the display fields were initially empty, upon successful submission of the form, they will become populated with information that was just inputted. The text input fields for organization and address will also clear. Similarly, any future visits to the Profile page will display the most recently submitted information, and you can update your profile by submitting the form again with the updated information. Attempts to submit the form with at least one of the organization, address, and preferred meeting time fields empty will result in a prompt to fill in those fields. 

After filling out the Profile form, you will be entered into the group of users who will be matched. Our matching algorithm runs once a week, and we keep all users informed about the most recent updates. On the Dashboard page, which you can visit by clicking the “Dashboard” link on the Navigation Bar in the top left or appending “dashboard” to the URL and pressing https://cko-cs50-final-project.herokuapp.com/ enter, you will be able to view the name and email of your most recent match, as well as how much time is left until you receive a new match.

Once our weekly matching algorithm finishes running, we will update all users who have just been matched via email. If you check the inbox of the email you registered with after the weekly algorithm runs, there should be an email from cko.cs50.final.project@gmail.com to both you and your match containing the link to a video chat and instructions for setting up a time.

You will most likely be matched with a fictional person from our test data. Do not actually reply to the email and schedule a time with the fictional person. You can, however, test the unique video chat link you’ve been given by clicking on it or pasting it in a new tab in your browser. Be sure to provide the application permission to access your camera and microphone if prompted to do so. If your device has a camera, you should see yourself on the screen. You can paste this link into another tab or share it with a friend who has a separate computer to test video chatting with another person. If you wish to test the video chat before the matching algorithm runs, follow Part D and Part E.

When you’re done video chatting, simply close the tab(s). Don’t forget to log out of your account in the main application by clicking the Log Out button on the Navigation Bar.

Part D: Accessing the Secondary Project
The secondary application, which was 90% derived from a YouTube tutorial (https://www.youtube.com/watch?v=DvlyzDZDEq4) and is only meant to complement the main project, can similarly be accessed through two methods:

Method One: Use the online public build.

   1. Visit https://cs50-final-project-video-chat.herokuapp.com/ in your browser of choice.

Method Two: Create and run a local copy.

   1. If you haven’t completed Part A, install the following:
      a. Node, a runtime environment for Javascript: https://nodejs.org/en/ AND...
      b. Node Package Manager (npm), which will help you easily install our project dependencies: https://www.npmjs.com/get-npm

   2. Visit the GitHub repository of our main application at https://github.com/owenzel/cs50-final-project-video-chat in your browser of choice..

   3. Download the project onto your local computer via your preferred method. We suggest downloading a ZIP file, cloning the repository via Git, or forking the repository and then downloading or cloning it onto your device.

   4. Open the project you just cloned/downloaded in your preferred IDE, such as Visual Studio Code.

   5. Open a terminal and change directories into the project folder. Install the server-side dependencies, which you can see listed in the package.json file, by running “npm install”.

  6. Start the server on port 443 by running “node server.js” OR “npm start”.

NOTE: If you make changes to the code, you must restart the server by entering the following in your terminal: Ctrl+C on PC or Cmd+C on Mac. Then, repeat step 6.

Part E: Using the Secondary Project
**NOTE: This video chat web app is not supported by some phones. Please use a computer.**

Once you have a local server up and running or you’re on the Heroku build at https://cs50-final-project-video-chat.herokuapp.com/, you should see the following: “Please append a '/' to the URL followed by your video chat room ID. (Check your email for the full link.)”.

You are seeing this message because you are not yet in a video chat room. To enter a room, pick a room ID, which can be any sequence of valid URL characters such as “turtles” or “124pickles” and append a slash, followed by your selected room ID, to the URL of your local server or the Heroku build. For example, if you selected a room ID of “turtes” you might visit https://cs50-final-project-video-chat.herokuapp.com/turtles.

You may be prompted by your browser to allow access to your camera and microphone. Please allow access. If your device has a camera, you should see yourself on the screen. You can paste this link into another tab or share it with a friend who has a separate computer to simulate chatting with another person. (Note that video chat with multiple people in the same room will only work if you use the Heroku build, not a local build.)

When you’re done video chatting, simply close the tab(s).
