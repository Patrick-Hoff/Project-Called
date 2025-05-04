import { useState, useContext } from 'react'
import './signin.css'

import logo from '../../assets/img-logo.png'
import { Link } from 'react-router-dom'
import {AuthContext} from '../../contexts/auth'

function SignIn() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { signIn, loadingAuth } = useContext(AuthContext)

    async function handleSignIn(event){
        event.preventDefault()
        if(email !== '' && password !== '') {
            await signIn(email,password)
        }
    }

    return (
        <div className='container-center'>
            <div className='login'>
                <div className='login-area'>
                    <img src={logo} alt='Logo do sistema de chamados ' />
                </div>

                <form onSubmit={handleSignIn}>
                    <h1>Entrar</h1>
                    <input
                        type='text'
                        placeholder='email@email.com'
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <input
                        type='password'
                        placeholder='*******'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />

                    <button type='submit'>{loadingAuth ? 'Carregando...' : 'Acessar'}</button>
                </form>

                <Link to='/register'>Criar uma conta</Link>

            </div>
        </div>
    )
}

export default SignIn