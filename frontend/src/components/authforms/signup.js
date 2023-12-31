import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './authform.css';
import { signup, clearSessionErrors } from '../../store/session';

function SignupForm () {
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const errors = useSelector(state => state.errors.session);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
        dispatch(clearSessionErrors());
        };
    }, [dispatch]);

    const update = field => {
        let setState;

        switch (field) {
        case 'fname':
            setState = setFname;
            break;
        case 'lname':
            setState = setLname;
            break;
        case 'username':
            setState = setUsername;
            break;
        case 'password':
            setState = setPassword;
            break;
        default:
            throw Error('Unknown field in Signup Form');
        }

        return e => setState(e.currentTarget.value);
    }

    const handleSubmit = e => {
        e.preventDefault();
        const user = {
        fname,
        lname,
        username,
        password
        };

        dispatch(signup(user)); 
    }

    return (
        <form className="session-form" onSubmit={handleSubmit}>
            <div className='signup-background'>
                <h2 className='sign-up-form'>Sign Up</h2>
                <div className="errors">{errors?.username}</div>
                <div className="errors">{errors?.password}</div>
                <label>
                    <span className='first-name-container'>
                        <span className='signup-fname'>First Name</span>
                        <input className='signup-fname-box'type="text"
                        value={fname}
                        onChange={update('fname')}
                        placeholder="First Name"
                        />
                    </span>
                </label>
                <label>
                    <span className='last-name-container'>
                        <span className='signup-lname'>Last Name</span>
                        <input className='signup-lname-box'type="text"
                        value={lname}
                        onChange={update('lname')}
                        placeholder="Last Name"
                        />
                    </span>
                </label>
                <label>
                    <span className='signup-username-container'>
                        <span className='signup-username'>Username</span>
                        <input className='signup-username-box' type="text"
                        value={username}
                        onChange={update('username')}
                        placeholder="Username"
                        />
                    </span>
                </label>
                <label>
                    <span className='signup-password-container'>
                        <span className='signup-password'>Password</span>
                        <input className='signup-password-box' type="password"
                        value={password}
                        onChange={update('password')}
                        placeholder="Password"
                        />
                    </span>
                </label>
                <div className='signup-button-container'>
                    <input className='signup-button'
                        type="submit"
                        value="Signup"
                        disabled={!fname || !lname || !username || !password }
                    />
                </div>
            </div>
        </form>
    );
}

export default SignupForm;