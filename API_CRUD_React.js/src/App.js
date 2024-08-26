import { useEffect, useState } from 'react';
import './App.css';
import { Button ,EditableText, InputGroup, Toaster} from '@blueprintjs/core';


const AppToaster = Toaster.create({
  position:"top" })
function App() {
    const [Users,setUsers] = useState([]);

    useEffect(()=>{
      fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then (json => setUsers(json))
},[])

    const [newName,setNewName] = useState("");
    const [newEmail,setNewEmail] = useState("");
    const [newWebsite,setNewWebsite] = useState("");

    function addUser(){
      const name = newName.trim();
      const email= newEmail.trim();
      const website = newWebsite.trim();
      
      if ( name && email && website) {
          fetch('https://jsonplaceholder.typicode.com/users',
           { 
            method :"POST",
            body : JSON.stringify({
              name,email,website
            }),
            headers:{
               "Content-Type":"application/json ; Charset =UTF-8"
               
            }
           }
          ).then((response) => response.json() )
           .then(jsondata =>{ 
                 setUsers([...Users,jsondata]);
                 AppToaster.show({
                  message:"User added Successfully",
                  intent:'success',
                  timeout:3000
                })
                setNewName("");
                setNewEmail("");
                setNewWebsite("");
           })
      }   
    }
function onChangeHandler(id,key,value){
     setUsers((Users) => {return Users.map(User => {
      return User.id === id ? {...User,[key]:value } : User ;
      // Ternary OPerator used above
    })
  })
}
function updateUser(id) {
  const User = Users.find((User) => User.id === id );
  fetch( 'https://jsonplaceholder.typicode.com/users/1',
    { 
     method :"PUT",
     body : JSON.stringify(User),
     headers:{
        "Content-Type":"application/json ; Charset =UTF-8"
     }
    }
  ).then((response) => response.json() )
    .then(jsondata =>{ 
          AppToaster.show({
           message:"User updated Successfully",
           intent:'success',
           timeout:3000
          })   
    })
}

function deleteUser(id){
  fetch( 'https://jsonplaceholder.typicode.com/users/${id}',
    { 
     method :"DELETE"
    }
  ).then((response) => response.json() )
    .then(jsondata =>{ 
      setUsers((Users) =>{
         return Users.filter(User => User.id !== id )
      })
          AppToaster.show({
           message:"User deleted Successfully",
           intent:'danger',
           timeout:3000
          })   
    })

}

  return (
    <div className="App">
      <table className='bp4-html-table modifier'>
        <thead>
          <th>ID</th>
          <th>Name</th>
          <th>Email ID</th>
          <th>Website</th>
          <th>Action</th>
        </thead>
        <tbody>
         { Users.map((User) =>  
              <tr key={User.id}>
                  <td>{User.id}</td>
                  <td>{User.name}</td>
                  <td><EditableText  onChange={value => onChangeHandler(User.id , 'email',value) } value = {User.email}  />  </td>
                  <td><EditableText  onChange={value => onChangeHandler(User.id , 'website',value) } value = {User.website}  />  </td>
            
                  <td><Button intent = 'primary' onClick={ () =>   { updateUser(User.id) } }>Update</Button>
                          &nbsp;
                      <Button intent = 'danger' onClick={ () => {deleteUser(User.id)} }>Delete</Button>
                  </td>
              </tr>  
          )}        
        </tbody> 

        <tfoot>
          <tr>
            <td></td>
             <td>
              <InputGroup 
                   value={newName}
                   onChange={(event)=>setNewName (event.target.value)}
                   placeholder='Enter Name...'
                    />
             </td>
             <td>
              <InputGroup 
                   value={newEmail}
                   onChange={(event)=>setNewEmail (event.target.value)}
                   placeholder='Enter Email ID...'
                    />
             </td>
             <td>
              <InputGroup 
                   value={newWebsite}
                   onChange={(event)=>setNewWebsite (event.target.value)}
                   placeholder='Enter Website...'
                    />
             </td>
             <td> 
               <Button intent='success' onClick={addUser}> Add User</Button>
             </td>
          </tr>
        </tfoot>
      </table>

    </div>
  );
}

export default App;
