Harvard's CS50 Web Programming with Python and Javascript 2020<br>
Brian Yu
brian@cs.harvard.edu<br>
David J. Malan
malan@harvard.edu

---

## **_Capstone project by Kenny Hsieh_**

Project Name: Capstone Chat<br>
Project Completed on: 4/5/2021<br>

[Kenny Hsieh's me50 GitHub](https://github.com/me50/jojotheelephant.git) <br>
[Kenny Hsieh's Github](https://github.com/jojotheelephant) <br>
[Video Demonstration of App](https://youtu.be/rUpbSuqpFT0) <br>
Email: kennybacktoschool@gmail.com

### **About:**

The project I chose for the capstone project is a chat program that allows users to log in and chat with other users in real time. Users can create new chat rooms or join existing rooms. They can invite their friends to join in on the conversation. Rooms are not password protected so all is needed is the room name to join the conversation. All chat rooms and conversations are saved into Django's SQLite3 database and can be quickly accessed.

### **Project distinctiveness and complexities:**

The project is distinct in many aspects. One of which is the real time chat feature using websockets, an upgraded web protocol. **Django Channels** package was used to make this possible. Django Channels allows for a steady connection to be opened between the server and client to send and receive data without the need for HTTP requests. Django Channels uses a feature called **Channel Layers** that handles the distribution of messages and events through the database. Channel Layers uses **Redis** as its backing store, which I run locally on **Docker**. All this to mean that the client can receive and display the latest messages without refreshing the page. I believe the chat feature alone should satisfy the distinctiveness and complexity requirements.

The project's frontend is built using **React** library and not Django's html templates. The React frontend allows for quick coding of a seamless SPA (Single Page Application) with customizable aesthetics, quick DOM updates, among other benefits. **Bootstrap** CSS library was also integrated to assist with styling.

Since the project departed from using Django's html templating, we needed an alternative solution for authentication, authorization, and CORS (Cross Origin Resource Sharing) that Django natively handled. Default authentication and authorization settings were switched to **Django REST framework** and **Django REST framework JWT** (Json Web Token) packages, a departure from the standard CSRF tokens. **CORS Headers** was used to take care of CORS error.

### **Why:**

CS50's projects were challenging to say the least. My prior experiences with other web development courses were elementery compare to the challenges set forth by the instructors of this course. I truly appreciate the spirit of pushing students to problem solve, instead of hand holding. This course has done more to help me as a developer because I was thrown into the deep end forced me to understand programming at a fundamental level. It was important for the capstone project to embody that same spirit, so I decided to work with technologies that removes me from my comfort zone. I had no exposure to Python when I began the course, let alone the Django framework. I needed to learn a new language, a new framework, how databases worked, websockets, authentication.. etc. In essense, the reason for this project selection was to remain in a state of growth and discomfort.

### **Files:**

The following is the file structure of the project where I added or modified. Default project files are ommitted.

```
/ (folder)
-- (files)

/Capstone - main project folder
 --README.md - this file
 --requirements.txt - list of libraries needed to run
  /Capstone - Django main project folder
   --asgi.py - asynconous web servers and wrapped in middleware
   --settings.py - slightly modified settings
   --urls.py - path configuration
   --utils.py - used for jwt response handler
  /Chat - Django Chat app
   --templates\chat - templates used to test initial build
   --admin.py - admin settings for model view
   --app.py - chat config
   --consumers.py - same as views.py for async class/functions
   --models.py - database models
   --routing.py - same as urls.py for async websockets
   --serializers.py - JSON <- communicate -> models/DB
   --urls.py - all standard HTTP request routing handled here
   --views.py - most of the Chat API handled here
  /frontend - React library
    /src - folder for React files
      /components - React Component folder
       --Chat.js - React component that controls the Chat container
       --Login.js - React component that controls the login form
       --Messages.js - React component that renders messages inside chat
       --Register.js - React component that controls the register form
       --Room.js - React component that renders room list inside roomlist
       --RoomList.js - React component that controls the Room List container
       --Welcome.js - React component that renders welcome message
      /util - folder that contains websocket.js
       --websocket.js - handles the websocket connection with the server
     --index.js - React Index.js
     --.babelrc - babel compiler settings
     --index.css - additional css
     --index.html - React HTML page where React id="app" is located
     --package.json - for React
  /reference - files inside reference when learning websockets
```

---

<br>

### **How to run application:**

The project has separate frontend and backend so they need to be launched separately. <br><br>
**Django server and backend setup**

1. Navigate to the project folder and create a virtual enviornment and activate it.

```
virtualenv venv
source venv/Scripts/activate
```

2. Install all required packages.

```
pip install -r requirements.txt
```

3. Initialize the database with makemigrations, migrate, then create superuser.

```
py manage.py makemigrations
py manage.py migrate
py manage.py createsuperuser
```

4. Since this project requires Redis store, we use Docker to host the store. Download and follow instructions to install Docker: <br>

    - [Docker for Mac](https://docs.docker.com/docker-for-mac/install/)<br>
    - [Docker for Windows](https://docs.docker.com/docker-for-windows/install/)<br>

5. Start a **Redis** server on port 6379.

    Your system should have downloaded the channels_redis package when 'pip install -r requirements.txt' was ran. Django has been pre-configured to connected to port 6379, using a different port will cause the system to not work. You can change this configuration in the settings file.

```
docker run -p 6379:6379 -d redis:5
```

6. Launch the Django server. If set up correctly, server will launch on http://127.0.0.1:8000/.

```
py manange.py runserver
```

**React frontend setup**

7. Navigate to the 'frontend' folder inside capstone project. In addition to the standard packages required to run the project, I built this project using **Parcel** as the compiler. I recommend using parcel to run the frontend. Install using npm or Yarn.

    npm:

    ```
    npm install -g parcel-bundler
    ```

    Yarn:

    ```
    yarn global add parcel-bundler
    ```

8. Download the required dependencies as listed in package.json file. The CSS files and CSS frameworks are listed as CDN in the html file. These files are primarily babel files to run react.

```
npm install
```

9. Launch the app. The package.json file has been configured so that npm run start launches the app using parcel @ http://127.0.0.1:1234

    Docker, Django and Pacel must continue to run in order for application to operate as intended.

```
npm run start
```
