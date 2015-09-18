import React from 'react/addons';
import {Navigation} from 'react-router';
import Reflux from 'reflux';
import Item from './item.jsx';
import CreateProject from './projectForm.jsx';
import {DashboardActions} from '../../actions/actions';
import DashboardStore from '../../stores/dashboardStore';

let ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

let Dashboard = React.createClass({
  // `ListenerMixin` will unsubscribe components from stores upon unmounting
  mixins: [Navigation, Reflux.ListenerMixin],

  getInitialState() {
    return {
      projects: [],
      showModal: false,
      editProject: null
    };
  },

  componentDidMount() {
    this.listenTo(DashboardStore, this.onStoreUpdate);
    DashboardActions.fetchProjects();
  },

  onStoreUpdate(data) {
    if (data.editProject) {
      data.showModal = true;
    }
    this.setState(data);
  },

  enterProject(id) {
    this.transitionTo('project', {id: id});
  },

  deleteProject(id) {
    DashboardActions.deleteProject(id);
  },

  close() {
    this.setState({showModal: false});
  },

  open() {
    this.setState({
      editProject: null,
      showModal: true
    });
  },

  render() {
    return (
      <div className='dashboard'>
        <CreateProject showModal={this.state.showModal} project={this.state.editProject} close={this.close}/>

        <ul>
          <Item id='0' name='+ New Project' click={this.open} isCreateProject='true'/>
          <ReactCSSTransitionGroup transitionName='project'>
            {
              this.state.projects.map((project) => {
                return (
                  <Item
                    key={project.id}
                    id={project.id}
                    name={project.name}
                    click={this.enterProject}
                    delete={this.deleteProject}
                  />
                );
              })
            }
          </ReactCSSTransitionGroup>
        </ul>
      </div>
    );
  }
});

export default Dashboard;
