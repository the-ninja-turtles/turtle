Introduction
===

Turtle uses a micro service architecture as opposed to a monolithic
architecture.

Turtle is structured into a frontend microservice that serves static files and
handles page rendering, a project service that provides a REST API for our
business logic and an event system used to send real time notifications to the
frontend.

```
-+- docs
 +-+ frontend
 | +- docs
 | +- src
 | +- tests
 | +- package.json
 | +- Dockerfile
 +-+ project-service
 +-+ event-system
```

Structure
===

A microservice runs in its own docker container has its own dependencies. A
microservice implements a public API and an internal API for communication
with other services. A service also uses an isolated datastore.
A microservice consists of a `docs` folder containing documentation about its
API and how it interacts with other microservices, a `src` folder containing the
source files and a `tests` folder containing tests for all API interfaces.
Additionaly a microservice consists of a package.json and a Dockerfile.

Optionally it can contain a gulp file for build related tasks.

Authentication
===

Authentication is handled by Auth0. Microservices expect an `Authorization` header
starting with 'Bearer' followed by an Auth0 issued json web token.

Example `Authorization` header:
`Authorization: Bearer <json web token>`
