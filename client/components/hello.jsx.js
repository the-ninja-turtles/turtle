import React from 'react/addons';

class HelloWorld extends React.Component {
  render() {
    return <p onClick={this.props.onClick}>Hello, {this.props.addressee}!</p>;
  }
}

export default HelloWorld;
