import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withAuth } from './index';

class Logout extends PureComponent {
  constructor(props) {
    super(props);
    if (!props.children || typeof props.children !== 'function') {
      throw new Error('Logout only accepts function as a child');
    }
    this.logout = this.logout.bind(this);
  }
  logout() {
    this.props.auth
      .logout()
      .then(() => {
        console.log('logged out');
      })
      .catch((error) => {
        console.error(error);
      });

    console.log('loging out');
  }
  render() {
    const { children } = this.props;
    return children({
      logout: this.logout,
    });
  }
}

Logout.propTypes = {
  auth: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired,
};

export default withAuth(Logout);
