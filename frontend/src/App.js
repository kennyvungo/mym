import logo from './logo.svg';
import './App.css';
import { Switch } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from './components/routes/routes'
import Landing from './components/landing/landing'
import LoginForm from './components/authforms/LoginForm';
import NavBar from './components/navbar/navbar';
import signup from './components/authforms/signup';
import { getCurrentUser } from './store/session';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Archive from './components/archive/archive';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCurrentUser()).then(() => setLoaded(true));
  }, [dispatch]);
  return (
   <>
   <NavBar/>
   <Switch>
      <AuthRoute exact path ='/login' component={LoginForm} />
      <AuthRoute exact path ='/signup' component={signup} />
      <ProtectedRoute exact path='/images' component={Archive}/>
      <ProtectedRoute exact path='/landing' component={Landing} />
   </Switch>

   </>
  );
}

export default App;
