# Helpdesk-Py
This repo is a copy of my other project [Helpdesk](https://github.com/MattFrench019/Helpdesk) which is the same application, but written with an ASP.NET backend.
I had planned to host the project on Google Cloud, but due to a change of plans I am hosting this locally on a Docker container.
While it is still possible to do this, it is far simpler to use a basic framework like Flask and Python instead of ASP.NET.
<br>
##

### Using the Application
To get started with the application you'll need to have Node.Js and Python installed, then you need to follow these steps:
1. Download the [Source-code](https://github.com/MattFrench019/Helpdesk-Py/archive/master.zip)
2. Set up a new [Firebase Project](https://console.firebase.google.com/)
3. Enable Email Authentication
4. Enable the Realtime Database
5. Copy and paste the Firebase config values into the [.env](https://github.com/MattFrench019/Helpdesk-Py/blob/master/.env) file in the root of the project
6. Run 'npm install'
7. Run 'pip install -r requirements.txt'
8. Run 'npm build'
9. Run 'python main.py'
10. Head to [localhost:5000](https://localhost:5000)

![Screenshot of Login Page](https://github.com/MattFrench019/Helpdesk-Py/blob/master/img/sign_in_page.png)