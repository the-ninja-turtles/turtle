import _ from 'lodash';
import Reflux from 'reflux';
import projects from '../ajax/projects';
import {ProjectActions, TaskActions, TaskContainerActions, EventActions} from '../actions/actions';

const ProjectStore = Reflux.createStore({
  listenables: [ProjectActions, TaskActions, TaskContainerActions],

  onFetchProject(id) {
    if (!this.project || this.project.id !== id) {
      this.registerEventHandlers(id);
    }
    projects.id(id).fetch().then((project) => {
      if (project.currentSprint) {
        let sortedSprint = [];
        _.each(project.currentSprint.tasks, (task) => {
          sortedSprint[task.status] = sortedSprint[task.status] || [];
          sortedSprint[task.status].push(task);
        });
        project.currentSprint.tasks = _.flatten(_.compact(sortedSprint));
      }
      this.project = project;
      this.trigger(project);
    });
  },

  registerEventHandlers(id) {
    projects.id(id).sprints.on('start', (event) => {
      EventActions.notify(event);
      this.onFetchProject(id);
    });
    projects.id(id).sprints.on('end', (event) => {
      EventActions.notify(event);
    });
    projects.id(id).tasks.on('add', (event) => {
      EventActions.notify(event);
      let sprint = this.findSprint(event.sprintId);
      sprint.push(_.pick(event, 'id', 'name', 'score', 'description', 'userId', 'sprintId', 'status'));
      this.trigger(this.project);
    });
    projects.id(id).tasks.on('change', (event) => {
      EventActions.notify(event);
      let task = this.findTask(event.id);
      let oldStatus = task.status;
      _.extend(task, _.pick(event, 'name', 'score', 'description', 'userId', 'sprintId', 'status'));
      if (task.status === oldStatus) { // if not equal, changes will be made on `reorder` event
        this.trigger(this.project);
      }
    });
    projects.id(id).tasks.on('delete', (event) => {
      EventActions.notify(event);
      let task = this.findTask(event.id);
      task.container.splice(_.indexOf(task.container, task), 1);
      this.trigger(this.project);
    });
    projects.id(id).tasks.on('reorder', (event) => {
      EventActions.notify(event);
      let task = this.findTask(event.id);
      let destination = event.sprintId ? this.findSprint(event.sprintId) : this.project.backlog;
      task.container.splice(_.indexOf(task.container, task), 1);
      destination.splice(event.newIndex, 0, task);
      this.trigger(this.project);
    });
    projects.id(id).sprints.on('assign', (event) => {
      EventActions.notify(event);
      if (event.add.length) {
        _.each(event.add, (taskId) => {
          let task = this.findTask(taskId);
          task.sprintId = event.sprintId;
          let index = _.indexOf(this.project.backlog, task);
          if (index > -1) {
            this.project.backlog.splice(index, 1);
            this.project.nextSprint.tasks.push(task);
          }
        });
      }
      if (event.remove.length) {
        _.each(event.remove, (taskId) => {
          let task = this.findTask(taskId);
          task.sprintId = null;
          let index = _.indexOf(this.project.nextSprint.tasks, task);
          if (index > -1) {
            this.project.nextSprint.tasks.splice(_.indexOf(this.project.nextSprint.tasks, task), 1);
            this.project.backlog.push(task);
          }
        });
      }
      this.trigger(this.project);
    });
  },

  onStartSprint(cb) {
    projects.id(this.project.id).sprints.start()
      .then(() => {
        cb();
      });
  },

  onEndSprint() {
    projects.id(this.project.id).sprints.end()
      .then(() => {
        return projects.id(this.project.id).fetch();
      })
      .then((project) => {
        this.project = project;
        this.project.currentSprint = {};
        this.trigger(this.project);
      });
  },

  onUpdateTaskPosLocally(params) {
    let draggedTask = this.findTask(params.draggedTaskId);
    let targetTask = this.findTask(params.targetTaskId);

    if (draggedTask && targetTask) {
      // remove the dragged task from its previous place in the tasks array
      draggedTask.container.splice(draggedTask.container.indexOf(draggedTask), 1);

      // and then insert the dragged task before the target task
      targetTask.container.splice(targetTask.container.indexOf(targetTask), 0, draggedTask);

      this.trigger(this.project);
    }
  },

  onAddTaskToContainerLocally(params) {
    let task = this.findTask(params.taskId);

    task.container.splice(task.container.indexOf(task), 1);

    if (params.tasks === this.project.backlog) {
      this.project.backlog.push(task);
    } else {
      this.project.nextSprint.tasks.push(task);
    }

    this.trigger(this.project);
  },

  onUpdateTaskOnServer(taskId) {
    let task = this.findTask(taskId);
    let change = {
      add: [],
      remove: []
    };
    if (task.sprintId && task.container === this.project.backlog) {
      change.remove.push(task.id);
    } else if (!task.sprintId && task.container === this.project.nextSprint.tasks) {
      change.add.push(task.id);
    }
    new Promise((resolve) => {
      if (change.add.length || change.remove.length) {
        return projects.id(this.project.id).sprints.id(this.project.nextSprint.id).assigntasks(change).then(resolve);
      }
      resolve();
    }).then((res) => {
      let ids = _.pluck(task.container, 'id');
      let index = _.indexOf(ids, taskId);

      if (task.container === this.project.backlog) {
        return projects.id(this.project.id).positions({id: taskId, index: index});
      } else {
        return projects.id(this.project.id).sprints.id(this.project.nextSprint.id).positions({id: taskId, index: index});
      }
    });
  },

  findTask(taskId) {
    let task = _.findWhere(this.project.backlog, {id: taskId});
    if (task) {
      task.container = this.project.backlog;
      return task;
    }
    task = _.findWhere(this.project.nextSprint.tasks, {id: taskId});
    if (task) {
      task.container = this.project.nextSprint.tasks;
      return task;
    }
    if (this.project.currentSprint) {
      task = _.findWhere(this.project.currentSprint.tasks, {id: taskId});
      if (task) {
        task.container = this.project.currentSprint.tasks;
        return task;
      }
    }
  },

  findSprint(sprintId) {
    if (this.project.nextSprint.id === sprintId) {
      return this.project.nextSprint.tasks;
    }
    if (this.project.currentSprint && this.project.currentSprint.id === sprintId) {
      return this.project.currentSprint.tasks;
    }
    return this.project.backlog;
  }

});

export default ProjectStore;
