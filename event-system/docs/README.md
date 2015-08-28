Event system
===

1. client logs in
1. client gets a token
1. client opens a websocket connection to events.proheadset.ch
1. client sends token
1. event system asks auth system for userId
1. event system asks API for all projects userId is associated with
1. client makes a change - POST api.proheadset.ch/sprint/task
1. api system saves to db
1. api system makes a POST to events.proheadset.ch/projectId/userId/event
1. event system emits an event to all team members
1. client update ui
