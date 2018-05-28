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
      formData: {
        email: '',
        password: '',
      },
      isLogginIn: false,
      error: undefined,
    };
    this.onFormDataChange = this.onFormDataChange.bind(this);
    this.login = this.login.bind(this);
  }
  onFormDataChange(formData) {
    this.setState({
      formData: {
        ...this.state.formData,
        ...formData,
      },
    });
  }
  login() {
    this.setState({
      isLogginIn: true,
      error: undefined,
    });
    return this.props.auth
      .login('email', {
        ...this.state.formData,
      })
      .then(() => {
        this.setState({
          isLogginIn: false,
        });
      })
      .catch((error) => {
        this.setState({
          error,
          isLogginIn: false,
        });
      });
  }
  render() {
    const { children } = this.props;
    return children({
      onFormDataChange: this.onFormDataChange,
      login: this.login,
      ...this.state,
    });
  }
}

LoginForm.propTypes = {
  auth: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired,
};

export default withAuth(LoginForm);
