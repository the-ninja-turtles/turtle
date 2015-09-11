# Turtle

Turtle is an issue tracker for software developers. It is

- easy to use (tasks are controlled by dragging and dropping them around)
- built for agile development methodology
- self-sufficient (does not require third-party services to function)
- free and open-source

Check it out at [https://turtly.co](https://turtly.co)

## Getting started

1. Clone the project

  ```bash
  git clone https://github.com/the-ninja-turtles/turtle.git -b develop && cd turtle
  ```

1. Configure environment variables in .env file

  Create a .env file in the project root folder with an AUTH0_SECRET,
  AUTH0_AUDIENCE, POSTGRES_USER and POSTGRES_PASSWORD.

  ```bash
  export AUTH0_SECRET=<secret>
  export AUTH0_AUDIENCE=<audience>
  export POSTGRES_USER=<user>
  export POSTGRES_PASSWORD=<password>
  ```
  ```bash
  source .env
  ```

1. Prerequisites

  - [iojs 2.3.1][avn]
  - [gulp][gulp-install] has to be installed globally
  - [docker][docker-install] and [docker-compose][docker-compose-install]

1. Run the project using npm

  ```bash
  npm install
  npm test
  npm start
  ```

  The web interface should be available at [http://localhost:8080](http://localhost:8080)

## Contribution guidelines and style guide
  - [Styleguide][styleguide]
  - [Contribution guidelines][contributing]

## Architecture and API references
  - Learn more about our [microservice][microservice] architecture and project layout
  - [Project service API][psapi] Reference
  - [Event system API][esapi] Reference

## License
Copyright (c) 2015, - Andrey Azov, David Craven, Wesley Tsai

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

[styleguide]: STYLE-GUIDE.md
[contributing]: CONTRIBUTING.md
[microservice]: docs/MICROSERVICE.md
[psapi]: project-service/docs/api.md
[esapi]: event-system/docs/api.md
[avn]: https://www.npmjs.com/package/avn
[gulp-install]: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
[docker-install]: https://docs.docker.com/installation/
[docker-compose-install]: https://docs.docker.com/compose/install/
