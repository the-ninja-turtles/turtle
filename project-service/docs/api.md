# Project Service - API

Project microservice is used to manage Turtle's primary business logic. The external (public) REST API provides request endpoints for CRUD operations on a user's projects, sprints, and tasks. The project service relies on the JSON Web Token issued by **Auth0** to authenticate incoming requests.

The project service will also expose internal API to allow the **invitation system** microservice to obtain some information regarding users, and request the addition/removal of users to/from projects.

## Table of Contents

- [External API](#external-api)
  - [Projects](#external-projects)
    + `/projects`
      + [Fetch](#external-projects-fetch)
      + [Create](#external-projects-create)
    - `/projects/:projectId`
      + [Details](#external-projects-details)
      + [Modify](#external-projects-modify)
      + [Delete](#external-projects-delete)
    - `/projects/:projectId/positions`
      + [Positions](#external-projects-positions)
  - [Sprints](#external-sprints)
    - `/projects/:projectId/startsprint`
      + [Start](#external-sprint-start)
    - `/projects/:projectId/endsprint`
      + [End](#external-sprint-end)
    + `/projects/:projectId/sprints`
      + [Fetch](#external-sprints-fetch)
    - `/projects/:projectId/sprints/:sprintId`
      + [Details](#external-sprints-details)
      + [Modify](#external-sprints-modify)
    - `/projects/:projectId/sprints/:sprintId/positions`
      + [Positions](#external-sprints-positions)
    - `/projects/:projectId/sprints/:sprintId/assigntasks`
      + [Bulk Add/Remove Tasks](#external-projects-tasks)
  - [Tasks](#external-tasks)
    + `/projects/:projectId/tasks`
      + [Fetch](#external-tasks-fetch)
      + [Create](#external-tasks-create)
    - `/projects/:projectId/tasks/:taskId`
      + [Details](#external-tasks-details)
      + [Modify](#external-tasks-modify)
      + [Delete](#external-tasks-delete)

- [Internal API](#internal-api)
  - [Projects](#internal-projects)
    + `/projects/:projectId/assignusers`
      + [Add/Remove User](#internal-projects-users)

<a name="external-api"/>
# Project Service External API

<a name="external-projects"/>
## Projects

- `length` - This is the duration of each sprint.

<a name="external-projects-fetch"/>
### Fetch a User's Projects

Get all existing projects for a user (as identified through JWT).

- **URL**
  + `/projects`
- **Method**
  + `GET`
- **Query Params**
  + None
- **Data Params**
  + None
- **Success Response**
  + Code: `200 OK`
  + Content:

```json
[
  {
    "id": 0,
    "name": "greenfield",
    "length": 7,
  }, {
    "id": 1,
    "name": "legacy",
    "length": 7,
  }
]
```

- **Error Response**
  + Code: `401 UNAUTHORIZED`
  + Content: `{ "error": "You are unauthorized to make this request." }`

  OR

  + Code: `405 METHOD NOT ALLOWED`
  + Content: `{ "error": "Use GET to retrieve projects and POST to create a project" }`

  OR

  + Code: `500 INTERNAL SERVER ERROR`
  + Content: `{ "error": "Try again later" }`

<a name="external-projects-create"/>
### Create Project for User

Create a new project for a user (as identified through JWT). Valid emails that correspond to existing users will be sent to the invitation service for handling.

The `length` is the duration of each sprint, defaults to 7 days.

A sprint is created by default with `status = 0` (planning). The sprint will have an empty name. Use the [Modify Sprint](#external-sprints-modify) end point to modify the name.

- **URL**
  + `/projects`
- **Method**
  + `POST`
- **Query Params**
  + None
- **Data Params**
  + Required
    * `name=[string]`
  + Optional
    * `emails=[array]`
    * `length=[number]`
- **Success Response**
  + Code: `201 CREATED`
  + Content:

```json
{
  "id": 1,
  "name": "thesis",
  "length": 7,
  "createdAt": "2004-10-19 10:23:54+02"
}
```

- **Error Response**
  * Code: `400 BAD REQUEST`
  * Content: `{ "error": "Invalid data parameters." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

<a name="external-projects-details"/>
### Fetch Project

Get a project's users, sprints and tasks. Tasks are placed in `currentSprint`, `nextSprint`, or `backlog` depending on where they reside. Tasks are ordered by the last provided positioning (see `positions` endpoint for how to reorder tasks).

If there is no current ongoing sprint, `currentSprint` will not be in the response.

- **URL**
  + `/projects/:projectId`
- **Method**
  + `GET`
- **Query Params**
  + None
- **Data Params**
  + None
- **Success Response**
  + Code: `200 OK`
  + Content:

```json
{
  "id": 0,
  "name": "greenfield",
  "length": 7,
  "users": [
    {
      "id": 1,
      "email": "something@turtle.com",
      "username": "wesley",
      "picture": "https://secure.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png"
    }, {
      "id": 2,
      "email": "another@turtly.co",
      "username": "jsonp",
      "picture": "https://secure.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png"
    }
  ],
  "currentSprint": {
    "id": 1,
    "name": "mvp",
    "status": 1,
    "startDate": "2015-09-10 10:23:54+02",
    "endDate": null,
    "tasks": [
      {
        "id": 1,
        "name": "win",
        "description": "save the princess",
        "status": 1,
        "score": 40,
        "userId": 1,
        "sprintId": 1
      }, {
        "id": 2,
        "name": "celebrate",
        "description": "throw a party",
        "status": 2,
        "score": 80,
        "userId": 2,
        "sprintId": 1
      }
    ]
  },
  "nextSprint": {
    "id": 3,
    "name": "amazing",
    "status": 0,
    "startDate": null,
    "endDate": null,
    "tasks": [
      {
        "id": 3,
        "name": "add css",
        "description": "do some css stuff for once",
        "status": 0,
        "score": 40,
        "userId": 1,
        "sprintId": 3
      }, {
        "id": 4,
        "name": "add feature",
        "description": "such feature",
        "status": 0,
        "score": 80,
        "userId": 2,
        "sprintId": 3
      }
    ]
  },
  "backlog": [
    {
      "id": 7,
      "name": "wow",
      "description": "impress someone",
      "status": 0,
      "score": 30,
      "userId": null,
      "sprintId": null
    }, {
      "id": 9,
      "name": "impressive",
      "description": "wow someone",
      "status": 0,
      "score": 80,
      "userId": 1,
      "sprintId": null
    }
  ]
}
```

- **Error Response**
  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Project doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

<a name="external-projects-modify"/>
### Modify Project

Edit an existing project. Adding or removing users are handled through the [internal API](#internal-api).

- **URL**
  + `/projects/:projectId`
- **Method**
  + `PUT`
- **Query Params**
  + None
- **Data Params**
  + Optional
    * `name=[string]`
    * `length=[number]`
- **Success Response**
  + Code: `200 OK`
  + Content:

```json
{
  "id": 1,
  "name": "turtle",
  "length": 10,
  "createdAt": "2004-10-19 10:23:54+02",
  "updatedAt": "2004-10-19 10:23:54+02"
}
```

- **Error Response**
  * Code: `400 BAD REQUEST`
  * Content: `{ "error": "Invalid data parameters." }`

  OR

  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Project doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

<a name="external-projects-delete"/>
### Delete Project

Delete an existing project. **All sprints and tasks for the project are also deleted.**

- **URL**
  + `/projects/:projectId`
- **Method**
  + `DELETE`
- **Query Params**
  + None
- **Data Params**
  + None
- **Success Response**
  + Code: `204 NO CONTENT`
  + Content: None
- **Error Response**
  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Project doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

<a name="external-projects-positions">
### Reorder Backlog Tasks

Reposition a task to a certain index in the backlog. `index = 0` means positioning the task first.

- **URL**
  + `/projects/:projectId/positions`
- **Method**
  + `POST`
- **Query Params**
  + None
- **Data Params**
  + `id=[number]`
  + `index=[number]`
- **Success Response**
  + Code: `200 OK`
  + Content:

```json
[
  {
    "id": 1,
    "name": "win",
    "description": "save the princess",
    "status": 0,
    "score": 40,
    "userId": 1,
    "sprintId": null
  }, {
    "id": 5,
    "name": "celebrate",
    "description": "throw a party",
    "status": 0,
    "score": 80,
    "userId": 2,
    "sprintId": null
  }, {
    "id": 2,
    "name": "something",
    "description": "going crazy",
    "status": 0,
    "score": 50,
    "userId": null,
    "sprintId": null
  }
]
```

- **Error Response**
  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Project doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

<a name="external-sprints"/>
## Sprints

Sprints currently have three possible statuses:

0 - **Planning**. Sprint has not started. A new sprint with this status is created automatically every time a sprint is started. A sprint in planning will also have the following properties:
  - `status = 0`
  - `startDate = null` - not defined until the sprint is started
  - `endDate = null` - not defined until the sprint is ended

1 - **Ongoing**. Sprint is currently in progress. Use the `startsprint` endpoint to change the **Planning** sprint to **Ongoing**. An ongoing sprint will have the following properties:
  - `status = 1`
  - `startDate = [date]` - whenever the user initiated the sprint using the `startsprint` endpoint
  - `endDate = null` - not defined until the sprint is ended

2 - **Complete**. Sprint is completed. Use the `endsprint` endpoint to change a sprint from **Ongoing** to **Complete**. All incomplete tasks (`status < 3`) will be transferred to the project backlog. A complete sprint will also have the following properties:
  - `status = 2`
  - `startDate = [date]` - whenever the user initiated the sprint using the `startsprint` endpoint
  - `endDate = [date]` - whenever the user ended the sprint using the `endsprint` endpoint

<a name="external-sprint-start"/>
### Start Sprint for Project

Starts the sprint that is currently with `status = 0` (planning) and sets `status = 1` (ongoing). There must be no currently ongoing sprints for a success response. The `startDate` of the sprint is automatically set to the date that this method is called.

This will also automatically create a new sprint with `status = 0` (planning).

- **URL**
  + `/projects/:projectId/sprints/start`
- **Method**
  + `POST`
- **Query Params**
  + None
- **Data Params**
  + None
- **Success Response**
  + Code: `204 NO CONTENT`
  + Content: None
- **Error Response**
  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Project doesn't exist." }`
  
  OR

  + Code: `400 BAD REQUEST`
  + Content: `{ "error": "There is already an ongoing sprint." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`


<a name="external-sprint-end"/>
### End Current Sprint of Project

Ends the current sprint with `status = 1` (ongoing). There must be an ongoing sprint for a success response. The `endDate` of the sprint is automatically set to the date that this method is called. Tasks that are not yet completed will be moved to the project backlog.

- **URL**
  + `/projects/:projectId/sprints/end`
- **Method**
  + `POST`
- **Query Params**
  + None
- **Data Params**
  + None
- **Success Response**
  + Code: `204 NO CONTENT`
  + Content: None
- **Error Response**
  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Project doesn't exist." }`
  
  OR

  + Code: `400 BAD REQUEST`
  + Content: `{ "error": "There is no ongoing sprint." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

<a name="external-sprints-fetch"/>
### Fetch a Project's Sprints 

Get all existing sprints for a project. There will _always_ be one sprint with `status = 0` (planning) and at most one sprint with `status = 1` (ongoing).

- **URL**
  + `/projects/:projectId/sprints`
- **Method**
  + `GET`
- **Query Params**
  + None
- **Data Params**
  + None
- **Success Response**
  + Code: `200 OK`
  + Content:

```json
{
  "currentSprint": {
    "id": 1,
    "name": "mvp",
    "status": 1,
    "startDate": "2004-10-19 10:23:54+02",
    "endDate": null
  },
  "nextSprint": {
    "id": 2,
    "name": "profit",
    "status": 0,
    "startDate": null,
    "endDate": null
  }
}
```

- **Error Response**
  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Project doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

<a name="external-sprints-details"/>
### Fetch Sprint

Get a sprint's tasks, including basic user information. Tasks are ordered by the last provided positioning (see `positions` endpoint for how to reorder tasks).

- **URL**
  + `/projects/:projectId/sprints/:sprintId`
- **Method**
  + `GET`
- **Query Params**
  + None
- **Data Params**
  + None
- **Success Response**
  + Code: `200 OK`
  + Content:

```json
{
  "id": 1,
  "name": "mvp",
  "status": 1,
  "startDate": "2004-10-19 10:23:54+02",
  "endDate": null,
  "tasks": [
    {
      "id": 5,
      "name": "do a task",
      "description": "some description",
      "status": 0,
      "score": 10,
      "user": {
        "id": 2,
        "username": "mario",
        "picture": "https://secure.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png"
      }
    }, {
      "id": 2,
      "name": "do another task",
      "description": "some more description",
      "status": 1,
      "score": 20,
      "user": {
        "id": 3,
        "username": "boo",
        "picture": "https://secure.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png"
      }
    }
  ]
}
```

- **Error Response**
  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Project doesn't exist." }`

  OR

  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Sprint doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`
  
<a name="external-sprints-modify"/>
### Modify Sprint

Edit an existing sprint. The name cannot be empty.

- **URL**
  + `/projects/:projectId/sprints/:sprintId`
- **Method**
  + `PUT`
- **Query Params**
  + None
- **Data Params**
  + Required
    * `name=[string]`
- **Success Response**
  + Code: `200 OK`
  + Content:

```json
{
  "id": 1,
  "name": "extra features",
  "status": 1,
  "startDate": "2004-10-19 10:23:54+02",
  "endDate": null,
  "createdAt": "2004-10-19 10:23:54+02",
  "updatedAt": "2004-10-19 10:23:54+02"
}
```

- **Error Response**

  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Project doesn't exist." }`

  OR

  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Sprint doesn't exist." }`

  OR

  * Code: `400 BAD REQUEST`
  * Content: `{ "error": "Invalid data parameters." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

<a name="external-sprints-positions">
### Reorder Tasks in a Sprint

Reorder the tasks in the sprintboard by providing the tasks's `id` and the new `index` of the task. An `index` of 0 represents highest priority/ordered first.

- **URL**
  + `/projects/:projectId/sprints/:sprintId/positions`
- **Method**
  + `POST`
- **Query Params**
  + None
- **Data Params**
  + `id=[number]`
  + `index=[number]`
- **Success Response**
  + Code: `200 OK`
  + Content:

```json
[
  {
    "id": 1,
    "name": "win",
    "description": "save the princess",
    "status": 0,
    "score": 40,
    "userId": 1,
    "sprintId": 2
  }, {
    "id": 5,
    "name": "celebrate",
    "description": "throw a party",
    "status": 0,
    "score": 80,
    "userId": 2,
    "sprintId": 2
  }, {
    "id": 2,
    "name": "something",
    "description": "going crazy",
    "status": 0,
    "score": 50,
    "userId": null,
    "sprintId": 2
  }
]
```

- **Error Response**
  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Project doesn't exist." }`

  OR

  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Sprint doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

<a name="external-sprints-tasks"/>
### Bulk Add/Remove Tasks to/from Sprint

Add/remove tasks to/from a sprint by attaching an array of task IDs with the request. Tasks that don't exist or don't need to be changed will be ignored. Tasks that are "done" (`status = 3`) cannot be removed from a sprint. All other removed tasks will be added to the project backlog.

- **URL**
  + `/projects/:projectId/sprints/:sprintId/assigntasks`
- **Method**
  + `POST`
- **Query Params**
  + None
- **Data Params**
  + Required (one or both)
    * `add=[array:id]`
    * `remove=[array:id]`
- **Success Response**
  + Code: `204 NO CONTENT`
- **Error Response**
  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Project doesn't exist." }`

  OR

  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Sprint doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

<a name="external-tasks"/>
## Tasks

Tasks can have the following statuses: 0, 1, 2 or 3. The label for each status is up to the front end microservice, but the largest status (in this case 3) always indicates that the task is done.

<a name="external-tasks-fetch"/>
### Fetch a Project's Tasks

Get all existing tasks for a project. Tasks are ordered by the last provided positioning (see `positions` endpoint for how to reorder tasks).

If there is no sprint with `status = 1` (ongoing), `currentSprint` will not be included in the response.

- **URL**
  + `projects/:projectId/tasks`
- **Method**
  + `GET`
- **Query Params**
  + None
- **Data Params**
  + None
- **Success Response**
  + Code: `200 OK`
  + Content:

```json
{
  "current": [
    {
      "id": 6,
      "name": "bacon",
      "description": "sandwich",
      "status": 2,
      "score": 30,
      "userId": 2,
      "sprintId": 2
    }, {
      "id": 7,
      "name": "ham",
      "description": "sandwich",
      "status": 3,
      "score": 60,
      "userId": 1,
      "sprintId": 2
    }
  ],
  "next": [
    {
      "id": 8,
      "name": "lorem",
      "description": "ipsum stuff",
      "status": 0,
      "score": 20,
      "userId": 1,
      "sprintId": 3
    }
  ],
  "backlog": [
    {
      "id": 4,
      "name": "do yet another task",
      "description": "some description",
      "status": 0,
      "score": 10,
      "userId": null,
      "sprintId": null
    }
  ]
}
```

- **Error Response**
  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Project doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

<a name="external-tasks-create"/>
### Create Task for Project

Create a new task for a project. Empty string is allowed for `description`.

By default, new tasks are assigned `status = 0` and are ordered below existing tasks. See `positions` endpoint for how to reorder tasks.

- **URL**
  + `/projects/:projectId/tasks`
- **Method**
  + `POST`
- **Query Params**
  + None
- **Data Params**
  + Required
    * `name=[string]`
    * `score=[integer]`
  + Optional
    * `description=[string]`
    * `userId=[number]`
    * `sprintId=[number]`
- **Success Response**
  + Code: `201 CREATED`
  + Content:

```json
{
  "id": 5,
  "name": "the final task",
  "description": "vague description",
  "status": 0,
  "score": 25,
  "userId": 4,
  "sprintId": 2
}
```

- **Error Response**
  * Code: `400 BAD REQUEST`
  * Content: `{ "error": "Invalid data parameters." }`

  OR

  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Project doesn't exist." }`

  OR

  * Code: `404 NOT FOUND`
  * Content: `{ "error": "User doesn't exist." }`

  OR

  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Sprint doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

<a name="external-tasks-details"/>
### Fetch Task

Get a task's user and sprint information.

- **URL**
  + `/projects/:projectId/tasks/:taskId`
- **Method**
  + `GET`
- **Query Params**
  + None
- **Data Params**
  + None
- **Success Response**
  + Code: `200 OK`
  + Content:

```json
{
  "id": 5,
  "name": "the final task",
  "description": "vague description",
  "status": 0,
  "score": 30,
  "user": {
    "id": 1,
    "username": "bowser",
    "email": "kingkoopa@turtle.com",
    "picture": "https://secure.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png"
  },
  "sprint": {
    "id": 3,
    "name": "mvp",
    "status": 1,
    "startDate": "2004-10-19 10:23:54+02",
    "endDate": null
  }
}
```

- **Error Response**
  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Project doesn't exist." }`
  
  OR

  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Task doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

<a name="external-tasks-modify"/>
### Modify Task

Edit an existing task. The `status` must be a number 0, 1, 2 or 3. To assign a task to a sprint or send it back to the backlog, use `/projects/:projectId/sprints/:sprintId/assigntasks` endpoint.

- **URL**
  + `/projects/:projectId/tasks/:taskId`
- **Method**
  + `PUT`
- **Query Params**
  + None
- **Data Params**
  + Optional
    * `name=[string]`
    * `description=[string]`
    * `status=[number]`
    * `score=[number]`
    * `userId=[number]`
- **Success Response**
  + Code: `200 OK`
  + Content:

```json
{
  "id": 1,
  "name": "do a task",
  "description": "jump and hit the flag",
  "status": 3,
  "score": 15,
  "userId": 1,
  "sprintId": null
}
```

- **Error Response**
  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Project doesn't exist." }`
  
  OR

  * Code: `400 BAD REQUEST`
  * Content: `{ "error": "Invalid data parameters." }`

  OR

  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Task doesn't exist." }`

  OR

  * Code: `404 NOT FOUND`
  * Content: `{ "error": "User doesn't exist." }`

  OR

  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Sprint doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

<a name="external-tasks-delete"/>
### Delete Task

Delete an existing task.

- **URL**
  + `/projects/:projectId/tasks/:taskId`
- **Method**
  + `DELETE`
- **Query Params**
  + None
- **Data Params**
  + None
- **Success Response**
  + Code: `204 NO CONTENT`
- **Error Response**
  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Project doesn't exist." }`

  OR

  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Task doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

---

<a name="internal-api"/>
# Project Service Internal API

<a name="internal-projects"/>
## Projects

<a name="internal-projects-users"/>
### Add/Remove Users to/from Project

Add or remove users to/from a project via users' email.

- **URL**
  + `/projects/:projectId/assignusers`
- **Method**
  + `POST`
- **Query Params**
  + None
- **Data Params**
  + Required (one or both)
    * `add=[array]`
    * `remove=[array]`
- **Success Response**
  + Code: `204 NO CONTENT`
  + Content: None
- **Error Response**
  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Project doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`
