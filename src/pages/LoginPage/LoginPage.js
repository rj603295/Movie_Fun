import React, { useEffect, useState, useRef, useContext } from 'react'
import styled from 'styled-components'
import { Link, useLocation, useHistory, useParams } from 'react-router-dom'
import { getPeopleDetail, getPeopleMovies } from '../../WebAPI'
import Carousel from '../../components/Carousel'
import Color, { useColor } from 'color-thief-react'
import RatingList from '../../components/Rating'
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, inMemoryPersistence} from "firebase/auth"

import { getDatabase, ref, set } from "firebase/database"
import { firebase } from "firebase/app"

import { setAuthToken } from '../../utils'
import AuthContext from '../../context'

const Container = styled.div`
  
  color: white;
  padding-top: 300px;
  background-image: linear-gradient(rgba(28, 28, 28, 0.7), rgba(28, 28, 28, 0.7)), url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-itemsL center;
  width: 100vw;
  backdrop-filter: blur(10px);
`
const LoginSection = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid white;
  max-width: 20%;
  max-height: 20%;
  padding: 60px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  a{
    color: white;
  }
  input{
    
  }
  input[type="password"] {
    margin-bottom: 30px;
  }
`
export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { setUser } = useContext(AuthContext)
  const history = useHistory()

  const auth = getAuth();

  const handleLogin = () => {
    const auth = getAuth();
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('auth',auth)
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return signInWithEmailAndPassword(auth, username, password).
    then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user)
        setUser(user.auth.currentUser)
        if(user) {
          history.push('/')
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    });


    // console.log(username, password)
    // signInWithEmailAndPassword(auth, username, password)
    // .then((userCredential) => {
    //   // Signed in 
    //   const user = userCredential.user;
    //   console.log(user)
    //   setUser(user.auth.currentUser)
    //   if(user) {
    //     history.push('/')
    //   }
    // })
    // .catch((error) => {
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    // });
  }

  
  return (
    <Container>
      <LoginSection>
      <h2>登入</h2>
      <label>帳號：</label>
      <input type="email" onChange={(e) => {setUsername(e.target.value)}} placeholder="電郵"/><br />
      <label>密碼：</label>
      <input type="password" onChange={(e) => {setPassword(e.target.value)}} placeholder="密碼"/><br />
      <button onClick={handleLogin}>登入</button><br />
      <Link to="/register">還沒有帳號嗎？點我註冊</Link>
      </LoginSection>
      
    </Container>


  )
}