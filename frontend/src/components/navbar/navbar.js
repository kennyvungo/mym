import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './navbar.css';
import { logout } from '../../store/session';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
function NavBar () {
  const loggedIn = useSelector(state => !!state.session.user);
  const dispatch = useDispatch();
  const history = useHistory();
  

  const handleSign = () => {
    history.push('/signup')
  }
  const handleLog = () => {
    history.push('/')
  }
  const logoutUser = e => {
      e.preventDefault();
      dispatch(logout());
  }

  const getLinks = () => {
    if (loggedIn) {
      return (
        <div className="links-nav">
          <div className="logout-button" onClick={logoutUser}>Logout</div>
        </div>
      );
    } else {
      return (
        <div className="links-auth">
          <div className ="sign-button" onClick={handleSign}> Sign Up</div>
          <div className ="log-button" onClick={handleLog}> Log In</div>
        </div>
      );
    }
  }

  return (
    <>
      { getLinks() }
    </>
  );
}

export default NavBar;