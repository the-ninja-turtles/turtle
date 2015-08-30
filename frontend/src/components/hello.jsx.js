import React from 'react/addons';

class HelloWorld extends React.Component {
  render() {
    return <p className="helloworld" onClick={this.props.onClick}>Hello, {this.props.addressee}!</p>;
  }
}

export default HelloWorld;
