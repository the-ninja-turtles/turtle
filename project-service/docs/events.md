# Project Service - Events

The project service will `publish` events through the event system microservice under the namespace `projects`. The frontend will subscribe to the `projects` namespace and the room corresponding to the project `id` for each of the user's projects. Events for a project will only be published to users that belong to it.

Example subscription URL: `/subscribe/projects/:jwt`

The name of the events will be further namespaced, such as `project:change`, `task:change`, etc. Each event will come with a data payload that includes information related to the event. Each payload will also include a `message` property to be displayed on the front end.

## Table of Contents

**URL**: `/projects/:projectId`
- [Projects](#projects)
  + [Add](#projects-add)
  + [Change](#projects-change)
  + [Delete](#projects-delete)
- [Sprints](#sprints)
  + [Start](#sprints-start)
  + [End](#sprints-end)
- [Tasks](#tasks)
  + [Add](#tasks-add)
  + [Change](#tasks-change)
  + [Delete](#tasks-delete)

<a name="projects"/>
## Projects

<a name="projects-add" />
### Add

When a user is added to a project, this event is triggered.

- **Event Name**
  + `project:add`
- **Data Parameters**
  + Always
    * `id=[number]`
    * `name=[string]`
    * `message=[string]`

```json
{
  "event": "project:add",
  "data": {
    "id": 2,
    "name": "new project name",
    "message": "A new project Awesome Project has been added to your Dashboard."
  }
}

```

<a name="projects-change"/>
### Change

Project level changes. If there are changes in which users belong to the project, there will be a `users` array passed along with the new set of users.

- **Event Name**
  + `project:change`
- **Data Parameters**
  + Always
    * `id=[number]`
    * `message=[string]`
  + When Applicable
    * `name=[string]`
    * `length=[number]`
    * `users=[array]`
- **Example Data**

```json
{
  "event": "project:change",
  "data": {
    "id": 1,
    "name": "8 bit videogames",
    "length": 10,
    "users": [
      {
        "id": 1,
        "email": "something@turtle.com",
        "username": "wesley"
      }, {
        "id": 2,
        "email": "else@turtle.com",
        "username": "andrey"
      }, {
        "id": 3,
        "email": "another@turtle.com",
        "username": "david"
      }
    ],
    "message": "Bojack has modified project details for Awesome Project."
  }
}
```

<a name="projects-delete"/>
### Delete

When a project is deleted.

- **Event Name**
  + `project:delete`
- **Data Parameters**
  + Always
    * `id=[number]`
    * `name=[string]`

```json
{
  "event": "project:delete",
  "data": {
    "message": "The project Awesome Project has been deleted by Bojack."
  }
}
```

<a name="sprints"/>
## Sprints

<a name="sprints-start"/>
### Start

When a sprint is started for the current project.

- **Event Name**
  + `sprint:start`
- **Data Parameters**
  + Always
    * `message=[string]`

```json
{
  "event": "sprint:start",
  "data": {
    "message": "A new sprint has been started for project Awesome Project."
  }
}
```

<a name="sprints-end"/>
### End

When a sprint is ended for the current project.

- **Event Name**
  + `sprint:end`
- **Data Parameters**
  + Always
    * `message=[string]`

```json
{
  "event": "sprint:end",
  "data": {
    "message": "The current sprint for project Awesome Project has ended."
  }
}
```

<a name="tasks"/>
## Tasks

<a name="tasks-add"/>
### Add

New task added to current project. If `sprintId` is null, that means the task was added to the project backlog.

- **Event Name**
  + `task:add`
-  **Data Parameters**
  +  Always
    *  `id=[number]`
    *  `projectId=[number]`
    +  `name=[string]`
    +  `description=[string]`
    +  `score=[number]`
    +  `sprintId=[number] || null`
    +  `userId=[number] || null`
    +  `message=[string]`
-  **Example Data**

```json
{
  "event": "task:add",
  "data": {
    "id": 1,
    "name": "Rest API documentation",
    "description": "",
    "score": 40,
    "sprintId": 1,
    "userId": null,
    "message": "Bojack added a new task to project Awesome Project."
  }
}
```

<a name="tasks-change"/>
### Change

Change in a tasks's details for current project.

- **Event Name**
  + `task:change`
- **Data Parameters**
  + Always
    * `id=[number]`
    * `projectId=[number]`
    * `name=[string]`
    * `description=[string]`
    * `status=[string]`
    * `score=[number]`
    * `userId=[number] || null`
    * `sprintId=[number] || null`
    * `message=[string]`
-  **Example Data**

```json
{
  "event": "task:change",
  "data": {
    "id": 1,
    "status": 2,
    "score": 25,
    "userId": 3,
    "message": "Bojack modified a task in project Awesome Project."
  }
}
```

<a name="tasks-delete"/>
### Delete

Task deleted from current project.

- **Event Name**
  + `task:delete`
- **Data Parameters**
  + Always
    * `id=[number]`
- **Example Data**

```json
{
  "event": "task:delete",
  "data": {
    "id": 1,
    "message": "Bojack deleted a task from project Awesome Project."
  }
}
```