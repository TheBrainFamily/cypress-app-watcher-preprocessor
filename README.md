This small package allows you a super-fast test-driven workflow.

# Show case
![Demonstration](http://g.recordit.co/xzVUgoEdW6.gif)

Take notice - the tests automatically rerun when I first save changes on the frontend, and then again when I save changes in the backend. 

### App Side
First, install it:

```bash
npm install --save-dev cypress-app-watcher-preprocessor
```

Let's say in your package.json you have a start script that looks like this:

```javascript
{
    "start": "nodemon ."
}
```

Leave it be, and create a new one, for cypress, relating to the existing one:

```javascript 
{
    "start": "nodemon .",
    "startWithCypress": "WAIT_FOR_MESSAGE='backend is running on port' cypressAppWatcher npm run start"
}
```

To do so, you have to figure out what your application spits out when it is ready after a restart, and put it inside WAIT_FOR_MESSAGE env variable.
It can be just part of the line - in this case, no matter what port it starts at and reports, cypress watcher will catch it and send a message to cypress to rerun tests.

If your app is in two-part (as it usually is - frontend + backend), you can use watcher in both places, and cypress will rerun tests whenever you change either one of them.

### Cypress Side

Find your cypress/plugins/index.js file and change it to look like so:
```javascript
const watchApp = require("cypress-app-watcher-preprocessor");
module.exports = (on, config) => {
  on("file:preprocessor", watchApp());
};
```

If you already use a preprocessor, no worries! You can combine them together like so:

```javascript
const cucumber = require("cypress-cucumber-preprocessor").default;
const watchApp = require("cypress-app-watcher-preprocessor");
module.exports = (on, config) => {
  on("file:preprocessor", watchApp(cucumber()));
};
```
