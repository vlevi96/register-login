import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [todo, setTodo] = useState('');
  const [page, setPage] = useState('reg');

  const login = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/login', {}, {
        headers: {
          'Authorization': authUsername + '&&&' + authPassword
        }
      })
      localStorage.setItem("sessionId", response.data);
      setPage("todo");
      console.log(response.data);
    }
    catch (e) {
      alert("wrong username/password");
    }

  }
  const createTodo = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/todo', { msg: todo }, {
        headers: {
          'Authorization': localStorage.getItem("sessionId")
        }
      });
      setTodo('');
      alert('todo created');
    }
    catch (error) {
      if (error.response.status===401) {
        alert('your session has expired')
        setPage('log');
        localStorage.removeItem("sessionId");
      }
    }
  }

  const signup = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/signup', { username, password });
      setPassword('');
      setUsername('');
      setPage('log');
      alert('yay');

    } catch (e) {
      if (e.response.status === 400) {
        alert('missing credentials');
      }
      else if (e.response.status === 409) {
        alert('username already exists');
      }
    }

    //post request to backend (Localhost something)
    //request body: username, password

    //successful: reset input, show msq 'yay'
    //error: show error(different messages), no reset
  }

  useEffect(() => {
    if (localStorage.getItem("sessionId")) {
      setPage("todo");
      
    }
  }, [])

  return (
    <div className="App">
      {page == "reg" &&
        <div className="card">
          <h1>Registration</h1>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={(e) => signup()}>SIGN UP!!!</button>
          <button onClick={(e) => setPage("log")}>I already have a user</button>
        </div>
      }
      {
        page == "todo" &&
        <div className='card'>
          <h1>To-do's</h1>
          <input type="text" value={todo} onChange={(e) => setTodo(e.target.value)} placeholder="Todo" />
          <button onClick={(e) => createTodo()} disabled={!todo}>Create todo</button>
          <button onClick={(e) => { setPage("log"); setAuthUsername(''); setAuthPassword(''); localStorage.clear() }}>Log out</button>
        </div>
      }
      {
        page == "log" &&
        <div className='card'>
          <h1>Login</h1>
          <input type="text" value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} placeholder="Username" />
          <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="Password" />
          <button onClick={(e) => setPage("reg")}>Back to registration</button>
          <button onClick={(e) => login()}>Login</button>

        </div>
      }
    </div>
  );
}

export default App;
