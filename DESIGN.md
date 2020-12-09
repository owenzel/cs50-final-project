# Design Specifications

VirtuConnect is two full-stack web applications built in the Model-View-Controller paradigm.

The main application, https://github.com/owenzel/cs50-final-project, allows users to register for an account, sign in, fill out a profile, and get matched with another user for socializing. The backend/controller is built on Node and Express, the database/model is built on PostgreSQL, and the frontend/view is built on React. Additional libraries and packages such as React-Bootstrap and Nodemailer are included to assist with styling and implementations such as sending emails (as is the case with Nodemailer). The whole application is hosted on Heroku at https://cko-cs50-final-project.herokuapp.com/.

## Backend Design:
Node is a runtime environment that allows us to run JavaScript on the server-side. We chose to learn and use Node for our controller because it is lightweight, portable, widely supported by web hosts (including Heroku), and highly performant with web applications. As for Express, it is perhaps the most popular web framework for Node, and it is used by major companies like Accenture, IBM, and Uber. The capabilities of vanilla Express are by no means extensive: it allows us to add middleware for further processing of requests, create simple handlers for HTTP requests at different routes (not unlike Flask, which we learned about in class this semester), and specify connection ports. With such a large development community around Node and Express, numerous libraries have been created for working with virtually anything a novice web developer could dream of -- cookies, sessions, etc. -- which we took advantage of. Moreover, Node/Express allowed us to code in JavaScript. Because we were interested in developing the front-end in React, which is also based in JavaScript, we were able to write the vast majority of our code for this project in JavaScript, thereby eliminating some friction when moving between different technologies in the stack.

Server.js contains most of the controller code. We imported Express, the Express-Session middleware, which allows us to save a user’s session data on the server, the Body-Parser middleware, which helps us sanitize HTTP requests, the Express-Validator middleware, which helps us sanitize user input, the path module, which allows us to work with file and directory paths, the nodemailer library, which allows us to send emails, uuid, which allows us to generate random ids with little-to-no collisions, the pg library, which allows us to connect to and execute commands on our SQL database, and matching.js, a file we created that contains most of the code for the matching algorithm (see “Matching Design” for further details).

After importing several modules and creating an Express app, server.js completes the basic set up by connecting to the SQL database hosted on Heroku via pg and configuring a Gmail transporter via nodemailer for sending emails from our administrator gmail account. It then runs the matching algorithm once a week with help from the Date library and the database (see “Matching Design” for more details) and sends an email to all of the newly matched pairs with a unique link to a video chat room. The unique link is created via a UUID-generated ID appended to the browser-based video chat application we created (https://dashboard.heroku.com/apps/cs50-final-project-video-chat). Because we did not want to require elderly users to have a Google or Zoom account, we decided to follow this YouTube tutorial (https://www.youtube.com/watch?v=DvlyzDZDEq4) and make a few modifications to build this secondary video chat web application (https://github.com/owenzel/cs50-final-project-video-chat). The backend is built on Node, Express, WebRTC, Socket.io, and UUID, and the frontend is built on EJS.  The whole application is also hosted on Heroku at https://dashboard.heroku.com/apps/cs50-final-project-video-chat.

The next section of server.js deals with HTTP requests. With the help of the path module, we deal with GET requests to any endpoint by serving all static frontend files in the build folder (while is allowed by adding a middleware with the express.static method). The build folder is updated every time the command “npm run build” is run in the front-end/ folder (see “Frontend Design” for more details on how the frontend and backend are connected), and React handles which components/pages to render based on the URL typed in the browser (see “Frontend Design” for more details on the React components). There are also endpoints for POST requests: /register, /login, /dashboard, /profile, and /logout. (We decided to make all other requests have a method of POST, as opposed to GET, so that they would not conflict with the aforementioned “catch all” GET request.) The controller handles POST requests to /register by, with the help of Express-Validator, ensuring the user’s inputs in the registration form were not empty and, in the case of the email field, were a properly formatted email address. It hashes the password, adds the new user’s data to the database with the INSERT SQL command and the pg library, and sends error messages back to the client if the user attempts to submit invalid credentials or register for an existing account, or if the server fails to connect to the database. POST requests to /login are handled similarly, only instead of inserting data into the database, data is fetched from the database via the SELECT SQL command and the pg library, ensuring that the user submitted a correct email and (hashed) password pair. If the user did so,  the user’s id and a boolean indicating that they’re logged in are stored in the server’s session via Express-Session, and this is sent back to the client. For POST requests to /dashboard, we leverage the aforementioned unique ids that are stored in the server’s session to fetch the name and email of the user’s match using a series of SELECT SQL commands. This data is returned to the client to be displayed on the user’s dashboard, where they are also able to view when the next matching will occur. POST requests to /profile are first categorized into one of two -- retrieving from and making changes to the database -- utilizing parameters we send when making the POST request from the client side. Similar to POST requests to /dashboard, for the former, we use the user’s id stored in the session to retrieve previously inputted information from the database and then return it to be displayed on the Profile page. The latter form of POST request is sent whenever a user submits the form on the Profile page, and depending on whether or not they have previously filled out the form, we either update or insert into the corresponding tables in the database (matches and scheduling_preferences, see “Database Design” below) with the newly submitted information.

The last section of server.js contains the DJB hash function for passwords, which better protects users’ privacy, and ends the connection with the client and the database when the server closes.

## Database Design:
We chose a SQL database for our model because our team was most familiar with relational database design and basic SQL commands and, with a relatively simple set up, we did not need it to be easily horizontally scalable. SQL also has a strong community of developers around it, making it easier to find help online as issues arise.

Currently, our database consists of five tables -- users, people, matches, week, and scheduling_preferences -- that store account information, personal information, weekly matches, the days of the week, and preferred meeting times, respectively. The people table is linked to the users table via user_id, and the matches table is  linked to the people table via person_id. The scheduling_preferences table links together the people table and the week table via person_id and day_id, respectively. We designed our database to utilize various association tables that use foreign keys to connect different pieces of information together. This way, instead of storing all of a single user’s information in one table, our use of multiple tables for different pieces of information allows for the accommodation of many-to-many relationships. These include, for example, the choice for a user to be matched with more than one other person, or to note scheduling preferences for multiple days. The database itself is a Postgres database that is hosted on Heroku as well. We used the Axios library to send requests from the browser client to the server (see “Frontend Design” for more details), which in turn, acts as a database client and sends queries to the database accordingly, returning a corresponding JSON object back to the client to render.

## Matching Design:
The matching algorithm extends from the back-end (retrieving user data from server) all the way to the front-end (displaying the matches). To match users with each other and form weekly pairings in matching.js, we first retrieved a list of users from one table in the Postgres database, which we then randomly shuffled and wrote to a new table in the database using a series of queries to our Postgres client in server.js. In dashboard.js, we retrieved the user’s match information and displayed it on their dashboard. For the sake of time, we decided to use a simple random matching algorithm, but in the future, we hope to extend the algorithm so that it takes into account user preferences (such as availability or interests).

## Frontend Design:
We chose to learn and use React because it is perhaps the most popular framework for frontend development, it is well-maintained by Facebook, it (generally) speeds up render times via its usage of the virtual DOM, and it allowed us to create reusable components (as is the case with the info cards on the home page), which improved the design of the code and the speed of our development.

Given that we were relatively new to React, we decided to follow the documentation’s advice and use npx create-react-app to quickly set up a single-page React development environment. 

To connect our frontend application to our Node/Express backend, we ran “npm run build” in our frontend folder and then had Express respond to GET requests by serving the static files in our newly created build folder (see “Backend Design” for more details). We also added a proxy to the package.json file in our front-end/ folder so that when we ran a React development server via “npm run start”, which is provided to use by create-react-app, all requests would be proxied to our backend development server on our local computer’s port 5000. Lastly, knowing that we were deploying to Heroku, we added a “heroku-postbuild” script to the package.json file in our root directory to ensure that once Heroku installed the backend dependencies and started up the server, it would then install the necessary frontend dependencies and build the static files that the Express can serve.

Because the backend responds to all GET requests (regardless of the route) by simply serving the files in the React build folder, we had to handle routing on the frontend. In our parent App.js component, we imported the react-router-dom library and made use of its Route, Redirect, and Switch components. Switch looks at the URL in the browser, sees which route it matches, and then renders the appropriate component(s) (or redirects to the appropriate component), per our specifications. We specified routes for a home page component at “/”, a register page component at “/register”, a login page component at “/login”, a dashboard page component at “/dashboard”, a profile page component at “/profile”, and a catchall that would redirect to the home route “/”.  We wanted the dashboard and profile to only be available when the user was logged in, and we wanted the register and login to only be available when the user was logged out, though, so we created a cookie for keeping track of whether the user was logged in, and we had a method that parsed the browser’s cookies to check whether the user was logged in every time a new component was rendered. The navbar at the top of the page, which was another React component we created, changed based on whether or not the user was logged in and, if the user attempted to reach a route we didn’t want them to via the URL, they would be redirected. While constantly retrieving and parsing the cookies is not ideal performance-wise, we decided that it was better than constantly sending requests to the server to check whether the user is logged in or passing around state via the useState React Hook, which is lost as soon as the user refreshes the application or types in a different route in the URL.

All of our components were stylized with the React-Bootstrap library. This helped us speed up development time and achieve a relatively clean, clutter-free, (hopefully) more accessible interface for elderly users, who are often less tech-savvy. For example, the home page includes several graphics that explain how visitors can register and how the matching process works. We also standardized large fonts across the website to make it very readable.

We used the Axios library to communicate with the server via HTTP requests, which in turn inserted, selected from, and updated the database as necessary (see “Backend Design and Database Design” for more details). The Dashboard component used Axios to fetch the logged in user’s match information (if they’ve been matched). The Login component used Axios to POST to the server that the user is logged in and, if that was successful, tell the client that they’re logged in. The Logout component used Axios to log out the user on the server side (i.e., clear their session). The Profile component used Axios to POST to POST any updated profile information to the server and fetch any previously submitted profile information (which it will then display). The Register component used Axios to POST registration information to the database. All of the components also fetched error messages from the server, which would then be displayed in visually-appealing alerts, where appropriate.

We also made extensive use of React Hooks for referencing components we were rendering (with UseRef), keeping track of and displaying error and success alerts, as necessary, and keeping track of and communicating to the navbar (with UseState and props, the latter of which is not a Hook, but a React staple) whether the user is logged in or not.

## Host Design:
Both applications are hosted on Heroku because not only was it recommended by CS50 staff, but it has free web and SQL database hosting with generous limits, it has a very simple set up, and a direct integration with GitHub that allowed us to update the build every time we pushed changes to our shared repository.