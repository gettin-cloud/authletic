import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export class LoginForm extends PureComponent {
  constructor(props) {
    super(props);
    if (!props.children || typeof props.children !== 'function') {
      throw new Error('LoginForm only accepts function as a child');
    }
    this.state = {
      username: '',
      password: '',
    };
    this.inputProps = this.inputProps.bind(this);
    this.buttonProps = this.buttonProps.bind(this);
  }
  inputProps(fieldName) {
    return {
      value: this.state[fieldName],
      onChange: (event) => {
        this.setState({
          [fieldName]: event.target.value,
        });
      },
    };
  }
  buttonProps(buttonName) {
    return {
      onClick: (event) => {
        console.log(buttonName);
        console.log(this.state);
      },
    };
  }
  render() {
    const { children } = this.props;
    return children({
      inputProps: this.inputProps,
      buttonProps: this.buttonProps,
    });
  }
}
