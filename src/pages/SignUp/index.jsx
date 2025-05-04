import { useState, useContext } from 'react';

import logo from '../../assets/img-logo.png'
import { Link } from 'react-router-dom'

import { AuthContext } from '../../contexts/auth'

function SignUp() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { signUp, loadingAuth } = useContext(AuthContext)

    async function handleSubmit(event) {
        event.preventDefault();

        if(name !== '' && email !== '' && password !== '') {
            await signUp( email, password, name  )
        }
    }


    return (
        <div className='container-center'>
            <div className='login'>
                <div className='login-area'>
                    <img src={logo} alt='Logo do sistema de chamados ' />
                </div>

                <form onSubmit={handleSubmit}>
                    <h1>Nova conta</h1>
                    <input
                        type='text'
                        placeholder='Seu nome'
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
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

                    <button type='submit'>
                        {loadingAuth ? 'Carregando...' : 'Cadastrar'}
                    </button>
                </form>

                <Link to='/'>Já possui uma conta? Faça login</Link>

            </div>
        </div>
    )
}

export default SignUp