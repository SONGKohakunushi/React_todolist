import React, { Component } from 'react'
import './index.css'

export default class Item extends Component {

    state ={mouse:false}

    handleMouse = (flag) =>{
        return ()=>{
            this.setState({mouse:flag})
        }
    }

    handleChecked = (id) =>{
        return (event) =>{
            // console.log(id,event.target.checked)
            this.props.updateTodo(id,event.target.checked)
        }
    }

    handleDelete =(id)=>{
        return ()=>{
            if(window.confirm('delete ?')){
            this.props.deleteTodo(id)
            }
        }
    }

    render() {
        const {id,name,done} = this.props
        const {mouse} = this.state
        return (
            <li style={{backgroundColor:mouse?'#ddd':'white' }} onMouseLeave={this.handleMouse(false)} onMouseEnter={this.handleMouse(true)} >
                <label>
                    <input type="checkbox" checked={done} onChange={this.handleChecked(id)} />
                    <span>{name}</span>
                </label>
                <button onClick={this.handleDelete(id)} className="btn btn-danger" style={{display:mouse?'block':'none'}}>delete</button>
            </li>
        )
    }
}
