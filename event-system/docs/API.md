Event system overview
===

Microservices can publish events to clients by using `POST /publish/:namespace/:room`. The
namespace should uniquely identify the microservice. It is used to determine where to send
acl requests to when determining if a user is authorized to subscribe to an event stream.

The event system writes the event to the redis datastore. All connected event system
instances are subscribed to the redis notification stream. When redis notifies an
event system about a new event, it writes the new event to all subscribed clients.

Clients are required to send an `Authorization` header for identification with every
request.

Clients receive push notifications by opening a connection to `/feed`. The event
system responds by sending a keep-alive message to keep the connection open.

Clients manage their subscriptions through `GET /subscriptions/:namespace/:room`
and `DELETE /subscriptions/:namespace/:room`. When the event system receives a
`GET` request, it checks if the client is authorized to subscribe to that room by
sending a `GET /acl/:namespace/:room/:userId` to the project service.

The project service can revoke permission by sending a `DELETE /acl/:namespace/:room/:userId`
to the event system.


Public API Reference
===

**Feed**
---

Open connection for server sent push notifications.

* **Url:**

  `/feed`

* **Method:**

  `GET`

* **Success Response:**

  * **Code:** 200

* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "No Authorization header" }`

    OR

  * **Code:** 405 METHOD NOT ALLOWED <br />
    **Content:** `{ error : "Use GET to receive event stream" }`

    OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{ error : "Try again later" }`

* **Sample Call:**

  ```javascript
  var source = new EventSource('/feed');
  source.addEventListener('message', function(e) {
    console.log(e);
    $('ul').append('<li>' + e.data + ' (message id: ' + e.lastEventId + ')</li>');
  }, false);
  ```

* **Notes:**

  How SSE are implemented on the server:
  ```javascript
  res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
  });
  res.write('\n');
  ```


**Subscribe**
---

Subscribe to a room.

* **Url:**

  `/subscriptions/:namespace/:room`

* **Method:**

  `GET` `DELETE`

* **Success Response:**

  * **Code:** 200

* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "Log in" }`

    OR

  * **Code:** 405 METHOD NOT ALLOWED <br />
    **Content:** `{ error : "Use GET to subscribe and DELETE to unsubscribe" }`

    OR

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "Unknown namespace" }`
    **Content:** `{ error : "Unknown room" }`

    OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{ error : "Try again later" }`

* **Sample Call:**

  <_Just a sample call to your endpoint in a runnable format ($.ajax call or a curl request) - this makes life easier and more predictable._>

* **Notes:**

  <_This is where all uncertainties, commentary, discussion etc. can go. I recommend timestamping and identifying oneself when leaving comments here._>


Internal API Reference
===

**Publish**
---

Emit a message to a room.

* **Url:**

  `/publish/:namespace/:room`

* **Method:**

  `POST`

* **Data Parameters:**

  * **event** a string to identify the event
  * **data** an optional payload to send to the client

  ```json
  {
    "event": "task status changed",
    "data": {
      "status": "complete"
    }
  }
  ```

* **Success Response:**

  * **Code:** 201

* **Error Response:**

  * **Code:** 405 METHOD NOT ALLOWED <br />
    **Content:** `{ error : "Use POST to publish an event" }`

    OR

  * **Code:** 422 UNPROCESSABLE ENTITY <br />
    **Content:** `{ error : "Expected application/json" }`

    OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{ error : "Try again later" }`

* **Sample Call:**

  <_Just a sample call to your endpoint in a runnable format ($.ajax call or a curl request) - this makes life easier and more predictable._>

* **Notes:**

  <_This is where all uncertainties, commentary, discussion etc. can go. I recommend timestamping and identifying oneself when leaving comments here._>


TODO: Specify acls can be skipped for now...
DELETE /acl/:namespace/:room/:userId
