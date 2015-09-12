import React from 'react';
import {Navigation} from 'react-router';
import Reflux from 'reflux';
import Item from './item.jsx';
import CreateProject from './createProject.jsx';
import {DashboardActions} from '../../actions/actions';
import DashboardStore from '../../stores/dashboardStore';

let Dashboard = React.createClass({
  // `ListenerMixin` will unsubscribe components from stores upon unmounting
  mixins: [Navigation, Reflux.ListenerMixin],

  getInitialState() {
    return {
      projects: [],
      showModal: false
    };
  },

  componentDidMount() {
    this.listenTo(DashboardStore, this.onStoreUpdate);
    DashboardActions.fetchProjects();
  },

  onStoreUpdate(projects) {
    this.setState({projects: projects});
  },

  enterProject(id) {
    this.transitionTo('project', {id: id});
  },

  close() {
    this.setState({showModal: false});
  },

  open() {
    this.setState({showModal: true});
  },

  render() {
    return (
      <div className='dashboard'>
        <CreateProject showModal={this.state.showModal} close={this.close}/>

        <ul>
          <Item id='0' name='+ New Project' click={this.open} isCreateProject='true'/>
          {
            this.state.projects.map((project) => {
              return <Item key={project.id} id={project.id} name={project.name} click={this.enterProject} />;
            })
          }
        </ul>
      </div>
    );
  }
});

export default Dashboard;
