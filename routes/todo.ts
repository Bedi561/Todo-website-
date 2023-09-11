import express from 'express';
import { authenticateJwt, SECRET } from '../middleware';
import {Todo}  from '../db';

const router = express.Router();




interface CreateTodoInput {
    title: string;
    description: string;
}

// eventually to this will help us ki koi bi typo hai to pehle hi compile time mei pta chl jaye rather than run time pe pta chale
//  but this wont solve all ur problems, user could get down ur backend by sending null or not even sending something
// soln for this is in the zod lecture


router.post('/todos', authenticateJwt, (req,res)=>{
    const inputs: CreateTodoInput = req.body;
    const done = false;// cuz when we create a todo its not initially done
    const userId = req.headers["userId"];
    
    
    const newTodo = new Todo({title: inputs.title, description: inputs.description, done, userId});

    //ab is naye todo ko database mei save krdo
    newTodo.save()
       .then((savedTodo)=>{
        res.status(201).json(savedTodo);
       })
       .catch((err)=>{
        res.status(500).json({error: 'Failed to create nw todo'});
       });
});


// The very reason we are storing the userid in newtodo is ki when we make a get request then just cuz its saved we can get all the todos specific to thatuser
// basically this is piece is imp for the platform

router.get('/todos', authenticateJwt, (req,res)=>{
    const userId = req.headers["userId"];

    Todo.find({userId})
    .then((todos)=>{
        res.json(todos);
    })
    .catch((err)=>{
        res.status(500).json({error: 'Failed to get todos'});
    });
});



// request to change some data
// VVVIMMPP
// is ki the user that is made the todo is the 1 thats gets to change it thats y we pass userid along with
router.put('/todos/:todoId/done', authenticateJwt, (req,res)=>{
    const { todoId } = req.params;
    const userId = req.headers["userId"];


    // is ki the user that has made the todo is the 1 thats gets to change it thats y we pass userid along with
    Todo.findOneAndUpdate({id: todoId, userId}, {done: false}, {new: true})
    .then((updateTodo)=>{
        if(!updateTodo){
            return res.status(404).json({error: 'Todo not found'});
        }
        res.json(updateTodo);
    })
    .catch((err)=>{
        res.status(500).json({error: 'Failed to update todo'});
    });
});



export default router;



