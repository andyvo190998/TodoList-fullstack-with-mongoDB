import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Typography, AppBar, CssBaseline, Toolbar, TextField } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const App = () => {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [openUpdateTodo, setOpenUpdateTodo] = useState(false);
  const [textUpdate, setTextUpdate] = useState();
  const [input, setInput] = useState('');
  const [selectionModel, setSelectionModel] = useState([])


  // const useStyles = makeStyles({
  //   table: {
  //     marginLeft: "45vh",
  //     marginRight: "45vh"
  //   },
  //   typography: {
  //     paddingTop: '10px',
  //     textAlign: 'center'
  //   }
  // })

  const rows = todos;

  const handleOnchange = (e) => {
    setTodo(e.target.value);
  };

  const handleOnchangeUpdate = (e) => {
    const {name, value} = e.target
    setInput((previous)=> ({...previous, [name]: value}));
  }

  const handleOnclick = (e) => {
    e.preventDefault();
    if (todo === '') {
      alert('you have to add something ....!');
    } else {
      const newTodo = {
        // id: Math.floor(Math.random() * 1000),
        todo: todo,
        completed: false
      }
      // setTodos((previous) => ([...previous, newTodo]))
      axios.post('/newtodo', newTodo)
      console.log(newTodo);
      setTodo('');
    }
  };

  // const checkBox = (id) => {
  //   const toggleCheckbox = todos.map((todo) => {
  //     if (todo.id === id) {
  //       todo.completed = !todo.completed
  //     };
  //     if (todo.id === id, todo.completed === true) {
  //       document.getElementById(todo.id).style.textDecoration = 'line-through';
  //     } else {
  //       document.getElementById(todo.id).style.textDecoration = 'none';
  //     };
  //     return todo;
  //   });
  //   setTodos(toggleCheckbox);
  // };

  const updateSomething = (id) => {
    axios.put("/update/" + id, input)
    setOpenUpdateTodo(false)
  }

  const columns = [
    { field: '_id', headerName: 'ID', width: 70, flex:0.5 },
    { field: 'todo', headerName: 'To Do', width: 300, flex: 2 },
    {
      field: "Action",
      width: 200,
      renderCell: (cellValues) => {
        // console.log("hi", cellValues.row.todo);
        // console.log(cellValues.row._id)
        const todoId = cellValues.row._id
        const handleDelete = () => {
          if(window.confirm("Do you want to delete this todo?")) {
            axios.delete('/delete/' + todoId)
          }
        };

        const handleEdit = () => {
          setOpenUpdateTodo(true);
          setTextUpdate(cellValues.row)
          setInput(cellValues.row);
        }
        return (
          <>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEdit}
            >
              Edit
            </Button>
          </>
        );
      }, flex: 1
    }
  ];

  useEffect(() => {
    fetch('/todos/')
    .then((res) => {
      return res.json();
    })
    .then ((jsonRes) => setTodos(jsonRes))
    .catch((err) => console.log(err))
    // console.log(todos)
   },[todos]);


  // const classes = useStyles();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <BorderColorIcon color="error" />
          <Typography variant="h5" align="right">
            Welcome to my to do list react app!
          </Typography>
        </Toolbar>
      </AppBar>
      <Typography style={{paddingTop: '10px',textAlign: 'center'}} variant="h2">My todo list ({todos.length})</Typography>
      {!openUpdateTodo ? (<form style={{ display: 'flex', justifyContent: 'center', padding: '20px 0px 20px 0px' }} onSubmit={handleOnclick}>
        <TextField
          label="What do you want to do?"
          size="small"
          variant="filled" type="text"
          onChange={handleOnchange}
          value={todo}
        />
        <Button size="large" onClick={handleOnclick} variant="contained">Add to do</Button>
      </form>) : (<form style={{ display: 'flex', justifyContent: 'center', padding: '20px 0px 20px 0px' }} onSubmit={()=> updateSomething(textUpdate._id)}>
        <TextField type="text" onChange={handleOnchangeUpdate} placeholder="what do you want to do?" name="todo" value={input.todo} />
        <Button onClick={()=> updateSomething(textUpdate._id)} variant="contained">update</Button>
      </form>)}
      <br />
        <DataGrid
          style={{marginLeft: "45vh", marginRight: "45vh"}}
          rows={rows}
          getRowId={(row) => row._id}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          // checkboxSelection
          disableSelectionOnClick
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          selectionModel={selectionModel}
          cell--textCenter
        />
    </div>
  )
}

export default App
