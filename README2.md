

-----------------------------------------------------------------------------
Componentized coding process for functional interfaces 
      
1. splitting components: splitting the interface, extracting components ----- analyse how many components the page can be divided into
2. Implement static components: use components to achieve static page effects ----- no search box, no interactive pages
3. Implementing dynamic components
   

### step 1 converted from a static component to react   
Number of components: overall component App.jsx
Header、List、Item、Footer
    
syntax from .js to the .jsx
* converted class to className
* converted from style ='' to style={{}} 
                                   style='display:none' to  style={{display:'none'}}
* import styles to each other   import './index.css'     
* finish static page

### step2 Dynamic initialization of lists
The Header input dynamically and the Item traversal loop is generated to render it out separately

List is a dynamic list, the data in the state drives the page, **the state is todos**

Now, it is currently not possible transfer Header state to the list 
(In the case of sibling components 
The state is placed in the App, the List is displayed, and the data can be passed between the parent and child components directly using props.

Afterwards the Header input also wants to add a piece of data to the state of App:

**Define a function in the App, and give the function to the component(.props)
When the child component wants to affect the state of the parent component, 
call this function in the component Header**)

#### App.jsx
* Initialization status    
* state is a object, todos is array 
```
state = {todos:[
	{id:'001',name:'eat',done:true},
	{id:'002',name:'play',done:true},
	{id:'003',name:'coding',done:false},
	{id:'004',name:'shopping',done:false}
]}
//pass state in List component   
<List todos={todos}>
const {todos} = this.state
        return (
			<div className="todo-container">
				<div className="todo-wrap">
					<Header/>
                    <List todos={todos}>
					<Footer/>
				</div>
			</div>
)
```

#### List

```
// receive the state from the App.jsx
const {todos} = this.props

//how many the Items dipende on the length of the todos, so traversal the state todos，use .map()
        
return (
	<ul className="todo-main">
		{
			// todos.map((todo,index)) is better to use todo.id instead of index
            // Attention: todos , todo are different  
			todos.map(todo =>{
			// key is unique 
			// spread operator:  {...todo}
		    return <Item key={todo.id} {...todo}/>
			})
		}
	</ul>
)
```

#### Items
```
// receive data of todo including id,name,done
const {id,name,done} = this.props
return (
	<li >
		<label>
			<input type="checkbox"/>
            // display name
			<span>{name}</span>
		</label>
		<button className="btn btn-danger" style={{display:'none'}}>delete</button>
	</li>
)
```

### step3 input todo from Header
* First create an input to index.jsx in the Header
* Bind a keyboard event to the input
* when hit enter, add todo to the state of App
#### Header 
```
render() {
		return (
			<div className="todo-header">
                // bind handleKeyUp evnet
               		<input onKeyUp={this.handleKeyUp} type="text" placeholder="input your task, then hit enter "/>
			</div>
		)
	}
```

* define handleKeyUp
* the element of bound and the element of operate is the same one
,so dont need to use ref, we can use event.target.value to get value
```
handleKeyUp = (event)=>{

		const {keyCode,target} = event
        // if not hit the enter, quit the event
		if(keyCode !== 13) return 
        if(target.value.trim() === ''){
			alert('cant input empty')
			return
		}
		// install library nanoid  npm i nanoid  
        // import {nanoid} from 'nanoid'
		// nanoid is a function that generate a unique string as id
		const todoObj = {id:nanoid(),name:target.value,done:false}
		
		// call the function 
		this.props.addTodo(todoObj)
		
		// clear the input 
		target.value = ''
}
```

* Communication between components, implement parent-child component interaction
* define a function addTodo in App.jsx, then call this function in Header to trasfer state
#### App.jsx 
```
addTodo = (todoObj)=>{
	const {todos} = this.state
	const newTodos = [todoObj,...todos]
    // update status
	this.setState({todos:newTodos})
}


    // pass this function to Header
	<Header addTodo={this.addTodo}/>
```

### step 4 Mouse movement interaction  
When mousing into a Todo, the Todo will become highlighted (change the background colour) and show the delete button

Add a mouse-in and mouse-out event to each todo item

#### Item  
bind mouse enter and leave event  
```
<li onMouseLeave={this.handleMouse(false)} onMouseEnter={this.handleMouse(true)}>
```

```
//mantein a state in a variable 
state = {mouse:false}

// define function handleMouse 
handleMouse = (flag) =>{   
    return ()=>{
        this.setState({mouse:flag})
    }
}
```
**Attention:** 
* {this.handleMouse(false)}, you need to use a higher-order function that returns a function  'return ()=>{}'
* If the binding is ()=>this.handleDelete(id), there is no need to return a function 

change the style dipende on mouse
```
const {mouse} = this.state
<li style = {{backgroundColor: mouse ? '#ddd' : 'white' }} onMouseLeave={this.handleMouse(false)} onMouseEnter={this.handleMouse(true)}>
```

when the mouse enter, show the delete button
```
<button className="btn btn-danger" style={{display:mouse? 'block' : 'none'}}>delete</button>
```
### step 5 checkbox in a Todo

#### Item
```
<input type="checkbox" checked={done} onChange={this.handleCheck(id)}/>
handleCheck = (id)=>{
    return (event) =>{
      this.props.updateTodo(id, event.target.checked)                                            
    }
}
```
You've got the id and the value, in the Item, you notify App to update the state of the Todo with the specified id.

#### App.jsx
```
updateTodo = (id, done) =>{
    const {todos} = this.state
    const newTodos = todos.maps((todoObj) =>{                           
            if(todoObj.id === id)   return {...todoObj, done}     //done:done ==> done
            else return todoObj                     
    })
    this.setState({todos: newTodos})  
}

<List todos={todos} updateTodo={this.updateTodo}> 
```

#### List
```
const {todos,updateTodo} = this.props  
return <Item key={todo.id} {...todo} updateTodo = {updateTodo} />
```                                 

### step 6 .props for type and required restrictions
#### Header
// import prop-types library   install npm add prop-types
```
import PropTypes from 'prop-types'
static propTypes = {
    addTodo: PropTypes.func.isRequired
}  
```
#### List
```
import PropTypes from 'prop-types'
static propTypes = {
    todos: PropTypes.array.isRequired,
    updateTodo: PropTypes.func.isRequired,
}
```

### delete the todo  
#### Item
```
<button onClick={this.handleDelete(id)} className="btn btn-danger" style={{display:mouse?'block': 'none' }} >delete</button>


handleDelete = (id)=>{
		if(window.confirm('are u sure to delete？')){
			this.props.deleteTodo(id)
		}
	}
```
### App.jsx define a function deleteTodo
```
deleteTodo =(id)=>{
    const {todos} = this.state
    const newTodos = todos.filter((todoObj)=>{
        return todoObj.id !== id
    })
    this.setState({todos:newTodos})
}

const {todos,updateTodo,deleteTodo} = this.props 
<Item key={todo.id} {...todo} updateTodo={updateTodo} deleteTodo={deleteTodo}/>
```

### step7  Footer
#### App.jsx
```
<Footer todos={todos}/>
```
#### Footer
* Based on the todos it is possible to  calculate how many tasks are completed and what the total number is
```
render({
    const {todos} = this.props  
})
const doneCount = todos.reduce((pre,todo)=> pre+ (todo.done? 1:0),0)
const total = todos.length

<span>finish{doneCount}</span> / total {total}
```

* checkbox in Footer, Check the box when the number of completed is equal to the total number
* uncheck when all completed tasks are deleted  ==> && total! == 0  
```     
<input type="checkbox" onChange={this.handleCheckAll} checked={doneCount === total && total! == 0 ? true : false} /> 

handleCheckAll = (event)=>{  
    this.props.checkAllTodo(event.target.checked)
}
```
#### App.jsx
```
checkAllTodo =(done)=>{
    const {todos} = this.state
    const newTodos = todos.map((todoObj)=>{
        return {...todoObj, done}
    })
    this.setState = ({todos:newTodos})
}
<Footer todos={todos} checkAllTodo={this.checkAllTodo}>
```
#### Footer
```
<input type="checkbox" onChange={this.handleCheckAll} checked={doneCount === total && total !== 0 ? true : false}/>

<button onClick={this.handleClearALLDone} className="btn btn-danger">clear all the completed tasks</button>

handleClearAllDone=()=>{
    this.props.clearAllDone()
}
```
#### App.jsx
``` 
clearAllDone = () =>{
    const {todos} = this.state
    const newTodos = todos.filter((todoObj)=>{
        //return todoObj.done === false   
        return !todoObj.done
    })
    this.setState({todos:newTodos})
}
<Footer todos={todos} checkAllTodo={this.checkAllTodo} clearAllDone={this.clearAllDone}/>
```