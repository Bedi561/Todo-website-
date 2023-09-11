import {useEffect, useState} from '';
import { authState } from '../store/authState.js';
import {useRecoilValue} from "recoil";


const TodoList = () =>{
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const authStateValue = useRecoilValue(authState);

    useEffect(()=>{
        const getTodos = async ()=>{
            const response = await fetch('http://localhost:3000/todo/todos',{
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            });

            const data = await response.json();
            setTodos(data);
        };
        getTodos();// ye yaha isiliye  kiya hai cuz useeffect ke andr hm async await nahi kr skte thsu alg se function banake and then we have to call it
    },[]);



const addTodo = async()=>{
    const response = await fetch('http://localhost:3000/todo/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ title, description })
    });
    const data = await response.json();
    setTodos([...todos, data]);// iska mtlb hai ki want the previous todos along with the new 1 that are added
};


const markDone = async (id) => {
    const response = await fetch(`http://localhost:3000/todo/todos/${id}/done`,{
        method: 'PATCH',//ye bhi mtlb update wala put hi hai
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
    });
    const updatedTodo = await response.json();
    setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));//mtlb ye hai ki agr todo wali ki id and updated ki id same hai then to udpate krdo ki its done vrna same todo hi render rehne do  
};

return (<div>
    <div style={{display: "flex"}}>
        <h2>Welcome {authStateValue.username}</h2>
        <div style={{marginTop: 25, marginLeft: 20}}>
            <button onClick={() => {
                localStorage.removeItem("token");
                window.location = "/login";
            }}>Logout</button>
        </div>
    </div>
    <h2>Todo List</h2>
    <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Title' />
    <input type='text' value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Description' />
    <button onClick={addTodo}>Add Todo</button>
    {todos.map((todo) => (
        <div key={todo._id}>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <button onClick={() => markDone(todo._id)}>{todo.done ? 'Done' : 'Mark as Done'}</button>
        </div>
    ))}
</div>
);
};


export default TodoList;