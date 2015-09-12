import projects from '../ajax/projects';

projects.on('add', (event) => {
  console.log(event);
});

projects.id(28).tasks.on('add', (event) => {
  console.log(event);
});
