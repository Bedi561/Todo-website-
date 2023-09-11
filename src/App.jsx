import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import Login from '/components/Login';
import Signup from '/components/Signup';
import TodoList from '/components/TodoList';
import { useNavigate } from 'react-router-dom';
import { authState } from '/store/authState.js';



// ye iinnit state is the intial rendered website
function App() {
  return (
    <RecoilRoot>
      <Router>
        <InitState />
        <Routes>
          {/* This is the component that should be rendered when the URL path matches '/login'.  */}
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/todos' element={<TodoList />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}


function InitState() {
  const setAuth = useSetRecoilState(authState);// hook is used to obtain a function that allows you to set the value of a Recoil atom or selector state. 
  const navigate = useNavigate();


  const init = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch('htttp://localhost:3000/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.username) {
        setAuth({ token: data.token, username: data.username });
        navigate("/todos");
      } else {
        navigate("/login");
      }
    } catch (e) {
      navigate("/login");
    }
  }
  useEffect(()=>{
    init();
  },[])
  return<></>

}

export default App;