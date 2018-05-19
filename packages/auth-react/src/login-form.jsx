import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withAuth } from './index';

class LoginForm extends PureComponent {
  constructor(props) {
    super(props);
    if (!props.children || typeof props.children !== 'function') {
      throw new Error('LoginForm only accepts function as a child');
    }
    this.state = {
      email: '',
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
      .login('email', {
        ...this.state,
      })
      .then((user) => {
        console.log('logged in');
        console.log(user);
      })
      .catch((error) => {
        console.error(error);
      });

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

LoginForm.propTypes = {
  auth: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired,
};

export default withAuth(LoginForm);
