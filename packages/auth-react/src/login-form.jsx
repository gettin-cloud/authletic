import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withAuth } from './index';

class LoginForm extends PureComponent {
  constructor(props) {
    super(props);
    if (!props.children || typeof props.children !== 'function') {
      throw new Error('LoginForm only accepts function as a child');
    }
    this.state = {
      username: '',
      password: '',
    };
    this.onFormDataChange = this.onFormDataChange.bind(this);
    this.login = this.login.bind(this);
  }
  onFormDataChange(formData) {
    this.setState(formData);
  }
  login() {
    this.props.auth
      .login('local', {
        ...this.state,
      })
      .then((user) => {
        console.log('logged in');
        console.log(user);
      })
      .catch(error => {});

    console.log('login');
    console.log(this.state);
  }
  render() {
    const { children } = this.props;
    return children({
      formData: this.state,
      onFormDataChange: this.onFormDataChange,
      login: this.login,
    });
  }
}

export default withAuth(LoginForm);
