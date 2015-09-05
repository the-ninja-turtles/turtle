Event System overview
===

An event has an id, a name, used by the client to listen for it, and data that the
event listener processes. The browser uses the event id to set the `Last-Event-ID`
http header in case the connection is lost. Reconnecting and setting `Last-Event-ID`
is handled automatically by the browser and requires no special handling on the
client.

Example of a client subscribing to a project feed `/subscribe/projects/0/:jwt`
and adding an event listener for the task:change event.

```javascript
let source = new EventSource('/subscribe/projects/0/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9');
source.addEventListener('task:change', (e) => {
  console.log(e.data);
}, false);
```

Event System architecture
===

When a client subscribes `/subscribe/:namespace/:room/:jwt`:
  - Normalize request for express-jwt middleware
  - Check user authorization
  - Respond with 200 text/event-stream, keep-alive \n
  - Subscribe to {namespace}:{room}
  - When an event is received
    - if userId is in acl
      - send event to client

  - if Last-Event-ID header is set
    - get all events between Last-Event-ID and current-event-id (MGET)
    - filter by {namespace}:{room} and acl
    - send events to client

  - When client disconnects
    - Close subscription

When a service publishes an event `POST /publish/:namespace/:room`:
  - Increment the current event id (INCR current-event-id)
  - Create an event (SETEX eventId 300 "{event, acl, data, namespace:room}")
  - Publish event to all instances (PUBLISH {namespace}:{room} "{event, acl, data, namespace:room}")


API Reference
===

**Subscribe**
---

Clients receive push notifications by opening a connection to `/subscribe/:namespace/:room/:jwt`.
The event system responds by sending a keep-alive message to keep the connection open.

* **Url:**

  `/subscribe/:namespace/:room/:jwt`

* **Method:**

  `GET`

* **Success Response:**

  * **Code:** 200 OK

* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ "error": "No Authorization header" }`

    OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{ "error": "Try again later" }`

* **Sample Call:**

  ```javascript
  let source = new EventSource('/subscribe/projects/0/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9');
  source.addEventListener('task:change', (e) => {
    console.log(e.data);
  }, false);
  ```

* **Notes:**

  NOTE: The Server Sent Events specification doesn't allow for custom http headers or
  sending POST data. Since cookies don't work for cors, the only option is to send the
  jwt as a url parameter when using EventSource.


**Publish** (internal)
---

Microservices can publish events to clients by using `POST /publish/:namespace/:room`. By
default the event is sent to all subscribed clients. Optionally an acl parameter can be
passed, in that case the event is only sent to the users contained within the acl array.

* **Url:**

  `/publish/:namespace/:room`

* **Method:**

  `POST`

* **Data Parameters:**

  * **event** a string to identify the event (required)
  * **acl** an array of auth0 user_id (optional)
  * **data** a payload to send to the client (optional)

  ```json
  {
    "event": "task:change",
    "acl": ["auth0|55e1c8c9cf1e612d550bcc45"],
    "data": {
      "status": "complete"
    }
  }
  ```

* **Success Response:**

  * **Code:** 201 CREATED

* **Error Response:**

  * **Code:** 405 METHOD NOT ALLOWED <br />
    **Content:** `{ "error": "Use POST to publish an event" }`

    OR

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ "error": "Expected application/json" }`

    OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{ "error": "Try again later" }`

* **Example request:**
  `curl -H "Content-Type: application/json" -X POST -d '{"event":"task:change"}'  http://127.0.0.1:4001/publish/n/r`
