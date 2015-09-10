# Project Service - API

Project microservice is used to manage Turtle's primary business logic. The external (public) REST API provides request endpoints for CRUD operations on a user's projects, sprints, and tasks. The project service relies on the JSON Web Token issued by **Auth0** to authenticate incoming requests.

The project service will also expose internal API to allow the **invitation system** microservice to obtain some information regarding users, and request the addition/removal of users to/from projects.

## Table of Contents

- [External API](#external-api)
  - [Projects](#external-projects)
    + [Fetch](#external-projects-fetch)
    + [Create](#external-projects-create)
    + [Details](#external-projects-details)
    + [Modify](#external-projects-modify)
    + [Delete](#external-projects-delete)
  - [Sprints](#external-sprints)
    + [Fetch](#external-sprints-fetch)
    + [Create](#external-sprints-create)
    + [Details](#external-sprints-details)
    + [Modify](#external-sprints-modify)
    + [Delete](#external-sprints-delete)
    + [Bulk Add/Remove Tasks](#external-projects-tasks)
  - [Tasks](#external-tasks)
    + [Fetch](#external-tasks-fetch)
    + [Create](#external-tasks-create)
    + [Details](#external-tasks-details)
    + [Modify](#external-tasks-modify)
    + [Delete](#external-tasks-delete)

- [Internal API](#internal-api)
  - [Projects](#internal-projects)
    + [Add User](#internal-projects-user-add)
    + [Remove User](#internal-projects-user-remove)

<a name="external-api"/>
# Project Service External API

<a name="external-projects"/>
## Projects

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
    "name": "greenfield"
  }, {
    "id": 1,
    "name": "legacy"
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

Create a new project for a user (as identified through JWT).

- **URL**
  + `/projects`
- **Method**
  + `POST`
- **Query Params**
  + None
- **Data Params**
  + Required
    * `name=[string]`
- **Success Response**
  + Code: `201 CREATED`
  + Content:

```json
{
  "id": 1,
  "name": "thesis",
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

Get a project's users, sprints and tasks. Tasks are ordered ascending by `rank`.

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
  "users": [
    {
      "id": 1,
      "email": "something@turtle.com",
      "username": "wesley"
    }
  ],
  "sprints": [
    {
      "id": 1,
      "name": "mvp",
      "status": "Started",
      "startDate": "2004-10-19 10:23:54+02",
      "endDate": "2004-10-19 10:23:54+02"
    }
  ],
  "tasks": [
    {
      "id": 1,
      "name": "win",
      "description": "save the princess",
      "status": "In Progress",
      "score": 40,
      "rank": 2,
      "userId": 1,
      "sprintId": 1
    },
    {
      "id": 2,
      "name": "celebrate",
      "description": "throw a party",
      "status": "Ready",
      "score": 80,
      "rank": 5,
      "userId": 2,
      "sprintId": 1
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

Edit an existing project.

- **URL**
  + `/projects/:projectId`
- **Method**
  + `PUT`
- **Query Params**
  + None
- **Data Params**
  + Optional
    * `name=[string]`
- **Success Response**
  + Code: `200 OK`
  + Content:

```json
{
  "id": 1,
  "name": "turtle",
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
  + Content:
- **Error Response**
  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Project doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

<a name="external-sprints"/>
## Sprints

<a name="external-sprints-fetch"/>
### Fetch a Project's Sprints 

Get all existing sprints for a project.

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
[
  {
    "id": 1,
    "name": "mvp",
    "status": "Started",
    "startDate": "2004-10-19 10:23:54+02",
    "endDate": "2004-10-19 10:23:54+02"
  }, {
    "id": 2,
    "name": "profit",
    "status": "Not Started",
    "startDate": "2004-10-19 10:23:54+02",
    "endDate": "2004-10-19 10:23:54+02"
  }
]
```

- **Error Response**
  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Project doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

<a name="external-sprints-create"/>
### Create Sprint for Project

Create a new sprint for a project.

- **URL**
  + `/projects/:projectId/sprints`
- **Method**
  + `POST`
- **Query Params**
  + None
- **Data Params**
  + Required
    * `name=[string]`
    * `status=[string]`
    * `startDate=[date]`
    * `endDate=[date]`
- **Success Response**
  + Code: `201 CREATED`
  + Content:

```json
{
  "id": 1,
  "name": "extra features",
  "status": "Not Started",
  "startDate": "2004-10-19 10:23:54+02",
  "endDate": "2004-10-19 10:23:54+02",
  "createdAt": "2004-10-19 10:23:54+02"
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

<a name="external-sprints-details"/>
### Fetch Sprint

Get a sprint's tasks, including basic user information. Tasks are ordered ascending by `rank`.

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
  "status": "Started",
  "startDate": "2004-10-19 10:23:54+02",
  "endDate": "2004-10-19 10:23:54+02",
  "tasks": [
    {
      "id": 1,
      "name": "do a task",
      "description": "some description",
      "status": "Ready",
      "score": 10,
      "rank": 3,
      "user": {
        "id": 2,
        "username": "mario"
      }
    }, {
      "id": 2,
      "name": "do another task",
      "description": "some more description",
      "status": "In Progress",
      "score": 20,
      "rank": 5,
      "user": {
        "id": 3,
        "username": "boo"
      }
    }
  ]
}
```

- **Error Response**
  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Sprint doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`
  
<a name="external-sprints-modify"/>
### Modify Sprint

Edit an existing sprint.

- **URL**
  + `/projects/:projectId/sprints/:sprintId`
- **Method**
  + `PUT`
- **Query Params**
  + None
- **Data Params**
  + Optional
    * `name=[string]`
    * `status=[string]`
    * `startDate=[date]`
    * `endDate=[date]`
- **Success Response**
  + Code: `200 OK`
  + Content:

```json
{
  "id": 1,
  "name": "extra features",
  "status": "Started",
  "startDate": "2004-10-19 10:23:54+02",
  "endDate": "2004-10-19 10:23:54+02",
  "createdAt": "2004-10-19 10:23:54+02",
  "updatedAt": "2004-10-19 10:23:54+02"
}
```

- **Error Response**
  * Code: `400 BAD REQUEST`
  * Content: `{ "error": "Invalid data parameters." }`

  OR

  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Sprint doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

<a name="external-sprints-delete"/>
### Delete Sprint

Delete an existing sprint. tasks that belong to this sprint are **not** deleted.

- **URL**
  + `/projects/:projectId/sprints/:sprintId`
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
  * Content: `{ "error": "Sprint doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

<a name="external-sprints-tasks"/>
### Bulk Add/Remove Tasks to/from Sprint

Add/remove an array of tasks to a sprint by attaching an array of task IDs with the request. Tasks that don't exist or don't need to be changed will be ignored.

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

<a name="external-tasks-fetch"/>
### Fetch a Project's Tasks

Get all existing tasks for a project. Tasks are ordered ascending by `rank`.

- **URL**
  + `projects/:projectId/tasks/`
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
    "id": 1,
    "name": "do a task",
    "description": "some description",
    "status": "Ready",
    "score": 40,
    "rank": 2,
    "userId": 2,
    "sprintId": 4
  }, {
    "id": 2,
    "name": "do another task",
    "description": "some description",
    "status": "In Progress",
    "score": 30,
    "rank": 10,
    "userId": 3,
    "sprintId": 4
  }, {
    "id": 4,
    "name": "do yet another task",
    "description": "some description",
    "status": "Done",
    "score": 10,
    "rank": 15,
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

<a name="external-tasks-create"/>
### Create Task for Project

Create a new task for a project. Empty string is allowed for `description`.

- **URL**
  + `/projects/:projectId/tasks`
- **Method**
  + `POST`
- **Query Params**
  + None
- **Data Params**
  + Required
    * `name=[string]`
    * `description=[string]`
    * `status=[string]`
    * `score=[integer]`
    * `rank=[integer]`
  + Optional
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
  "status": "Ready",
  "score": 25,
  "rank": 5,
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
  "status": "Ready",
  "score": 30,
  "rank": 10,
  "user": {
    "id": 1,
    "username": "bowser",
    "email": "kingkoopa@turtle.com"
  },
  "sprint": {
    "id": 1,
    "name": "mvp",
    "status": "Started",
    "startDate": "2004-10-19 10:23:54+02",
    "endDate": "2004-10-19 10:23:54+02"
  }
}
```

- **Error Response**
  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Task doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

<a name="external-tasks-modify"/>
### Modify Task

Edit an existing task.

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
    * `status=[string]`
    * `score=[integer]`
    * `rank=[integer]`
    * `userId=[number]`
    * `sprintId=[number]`
- **Success Response**
  + Code: `200 OK`
  + Content:

```json
{
  "id": 1,
  "name": "do a task",
  "description": "jump and hit the flag",
  "status": "Done",
  "score": 15,
  "rank": 1,
  "userId": 1,
  "sprintId": null
}
```

- **Error Response**
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
  * Content: `{ "error": "Task doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

---

<a name="internal-api"/>
# Project Service Internal API

<a name="internal-projects"/>
## Projects

<a name="internal-projects-user-add"/>
### Add User to Project

Add a user to a project via user's email address.

- **URL**
  + `/projects/:projectId/users`
- **Method**
  + `POST`
- **Query Params**
  + None
- **Data Params**
  + Required
    * `email=[string]`
- **Success Response**
  + Code: `200 OK`
  + Content:

```json
{
  "id": 1,
  "username": "kirby",
  "email": "pink@turtle.com"
}
```

- **Error Response**
  * Code: `404 NOT FOUND`
  * Content: `{ "error": "Project doesn't exist." }`

  OR

  * Code: `404 NOT FOUND`
  * Content: `{ "error": "User doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`

<a name="internal-projects-user-remove"/>
### Remove User from Project

Remove a user from a project.

- **URL**
  + `/projects/:projectId/users/:userId`
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
  * Content: `{ "error": "User doesn't exist." }`

  OR

  * Code: `401 UNAUTHORIZED`
  * Content: `{ "error": "You are unauthorized to make this request." }`
