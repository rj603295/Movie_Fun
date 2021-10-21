import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import { Link, useHistory } from 'react-router-dom'
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth"
import AuthContext from '../../context'
import { getUserDeviceType } from '../../utils'

const Container = styled.div`
  color: white;
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
  position: relative;
  input{
    font-size: ${props => props.isMobileDevice ? "initial" : ""}
  }
`
const LoginSection = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid white;
  min-width: 20%;
  min-height: 20%;
  padding: 5%;
  position: absolute;
  top:50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  font-size: 0.45rem;
  h2{
    font-size: 0.7rem;
  }
  a{
    color: white;
  }
  input{
    width: 70%;
  }
  input[type="password"] {
    margin-bottom: 5%;
  }
  @media (max-width: 415px) {
    min-width: 80%;
    padding: 60px 0;
    h2{
      font-size: 20px;
    }
    font-size: 16px;
  }
  
`
const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
`
export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { setUser } = useContext(AuthContext)
  const history = useHistory()
  const handleLogin = () => {
    const auth = getAuth()
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    return signInWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
        const user = userCredential.user;
        setUser(user.auth.currentUser)
        if(user) {
          history.push('/')
        }
      })
      .catch((error) => {
        const errorCode = error.code

        if(errorCode === 'auth/wrong-password'){
          setErrorMessage("密碼錯誤")
        }
        if(errorCode === 'auth/user-not-found'){
          setErrorMessage("找不到用戶")
        }
      });
    })
    .catch((error) => {
      return error
    });
  }
  return (
    <Container isMobileDevice={getUserDeviceType()}>
      <LoginSection>
        <h2>登入</h2>
        <label>帳號：</label>
        <input type="email" onChange={(e) => {setUsername(e.target.value)}} placeholder="電郵"/><br />
        <label>密碼：</label>
        <input type="password" onChange={(e) => {setPassword(e.target.value)}} placeholder="密碼"/><br />
        <ErrorMessage>{errorMessage}</ErrorMessage>
        <button onClick={handleLogin}>登入</button><br />
        <Link to="/register">還沒有帳號嗎？點我註冊</Link>
      </LoginSection> 
    </Container>
  )
}