import React, { useState, useContext, useEffect } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
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
    font-size: ${props => props.isMobileDevice ? 'initial' : ''}
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
  padding: 5% 0;
`

export default function RegisterPage () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [nickname, setNickname] = useState('')
  const { setUser } = useContext(AuthContext)
  const history = useHistory()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const handleRegister = () => {
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        updateProfile(auth.currentUser, {
          displayName: nickname
        }).then(() => {
        }).catch((error) => {
          return error
        })
        setUser(user.auth.currentUser)
        if (user) {
          history.push('/')
        }
      })
      .catch((error) => {
        const errorCode = error.code
        if (errorCode === 'auth/invalid-email') {
          setErrorMessage('信箱格式錯誤')
        }
        if (errorCode === 'auth/internal-error') {
          setErrorMessage('密碼格式錯誤')
        }
      })
  }
  const handleKeyPressRegister = (e) => {
    if (e.key === 'Enter') {
      handleRegister()
    }
  }
  return (
    <Container isMobileDevice={ getUserDeviceType() }>
      <LoginSection>
        <h2>註冊</h2>
        <label>帳號：</label>
        <input onChange={ (e) => { setUsername(e.target.value) } } onKeyPress={ (e) => { handleKeyPressRegister(e) } } placeholder="電郵" type="email" /><br />
        <label>密碼：</label>
        <input onChange={ (e) => { setPassword(e.target.value) } } onKeyPress={ (e) => { handleKeyPressRegister(e) } } placeholder="密碼" type="password" /><br />
        <label>暱稱：</label>
        <input onChange={ (e) => { setNickname(e.target.value) } } onKeyPress={ (e) => { handleKeyPressRegister(e) } } placeholder="請輸入暱稱" type="text" /><br />
        <ErrorMessage>{errorMessage}</ErrorMessage>
        <button onClick={ handleRegister }>註冊</button>
      </LoginSection>
    </Container>

  )
}
