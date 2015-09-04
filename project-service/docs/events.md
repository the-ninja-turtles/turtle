# Project Service - Events

The project service will `publish` events through the event system microservice under the namespace `projects`. The frontend will subscribe to the `projects` namespace and the room corresponding to the project `id` for each of the user's projects. Events for a project will only be published to users that belong to it.

Example subscription URL: `/subscribe/projects/1/:jwt`

The name of the events will be further namespaced, such as `project:change`, `task:change`, etc.

## Table of Contents

**URL**: `/projects/:projectId`
- [Projects](#projects)
  + [Change](#projects-change)
- [Sprints](#sprints)
  + [Add](#sprints-add)
  + [Change](#sprints-change)
  + [Delete](#sprints-delete)
- [Tasks](#tasks)
  + [Add](#tasks-add)
  + [Change](#tasks-change)
  + [Delete](#tasks-delete)

<a name="projects"/>
## Projects

<a name="projects-change"/>
### Change

Project level changes. If there are changes in which users belong to the current project, there will be a `users` array passed along with the new set of users.

- **Event Name**
  + `project:change`
- **Data Parameters**
  + OPTIONAL
    * `name=[string]`
    * `users=[array]`
- **Example Data**

```json
{
  "event": "project:change",
  "data": {
    "name": "8 bit videogames",
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
    ]
  }
}
```

<a name="sprints"/>
## Sprints

<a name="sprints-add"/>
### Add

New sprint added to current project.

- **Event Name**
  + `sprint:add`
-  **Data Parameters**
  +  ALWAYS
    *  `id=[number]`
    +  `name=[string]`
    +  `status=[string]`
    +  `startDate=[date]`
    +  `endDate=[date]`
-  **Example Data**

```json
{
  "event": "sprint:add",
  "data": {
    "id": 1,
    "name": "create mvp",
    "status": "Not Started",
    "startDate": "2004-10-19 10:23:54+02",
    "endDate": "2004-10-19 10:23:54+02"
  }
}
```

<a name="sprints-change"/>
### Change

Change in a sprint's details for current project.

- **Event Name**
  + `sprint:change`
- **Data Parameters**
  + ALWAYS
    * `id=[number]`
  + OPTIONAL
    *  `name=[string]`
    *  `status=[string]`
    *  `startDate=[date]`
    *  `endDate=[date]`
-  **Example Data**

```json
{
  "event": "sprint:change",
  "data": {
    "id": 1,
    "status": "In Progress",
    "endDate": "2004-10-27 10:23:54+02"
  }
}
```

<a name="sprints-delete"/>
### Delete

Sprint deleted from current project.

- **Event Name**
  + `sprint:delete`
- **Data Parameters**
  + ALWAYS
    * `id=[number]`
- **Example Data**

```json
{
  "event": "sprint:delete",
  "data": {
    "id": 1
  }
}
```

<a name="tasks"/>
## Tasks

<a name="tasks-add"/>
### Add

New task added to current project.

- **Event Name**
  + `task:add`
-  **Data Parameters**
  +  ALWAYS
    *  `id=[number]`
    +  `name=[string]`
    +  `description=[string]`
    +  `status=[string]`
    +  `score=[number]`
    +  `rank=[number]`
    +  `sprintId=[number] || null`
    +  `userId=[number] || null`
-  **Example Data**

```json
{
  "event": "task:add",
  "data": {
    "id": 1,
    "name": "Rest API documentation",
    "description": "",
    "status": "To Do",
    "score": 40,
    "rank": 1,
    "sprintId": 1,
    "userId": null
  }
}
```

<a name="tasks-change"/>
### Change

Change in a tasks's details for current project.

- **Event Name**
  + `task:change`
- **Data Parameters**
  + ALWAYS
    * `id=[number]`
  + OPTIONAL
    *  `name=[string]`
    *  `description=[string]`
    *  `status=[string]`
    *  `score=[number]`
    *  `rank=[number]`
    *  `userId=[number] || null`
    *  `sprintId=[number] || null`
-  **Example Data**

```json
{
  "event": "task:change",
  "data": {
    "id": 1,
    "status": "Review",
    "score": 25,
    "userId": 3
  }
}
```

<a name="tasks-delete"/>
### Delete

Task deleted from current project.

- **Event Name**
  + `task:delete`
- **Data Parameters**
  + ALWAYS
    * `id=[number]`
- **Example Data**

```json
{
  "event": "task:delete",
  "data": {
    "id": 1
  }
}
```