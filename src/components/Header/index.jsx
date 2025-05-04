import { useContext } from 'react'
import avatar from '../../assets/img-sem-fundo.jpg'
import { Link } from 'react-router-dom'

import { AuthContext } from '../../contexts/auth'
import { FiHome, FiUser, FiSettings } from 'react-icons/fi'

import './header.css'
function Header() {
    const { user } = useContext(AuthContext)

    return (
        <div className="sidebar">
            <div>
                <img src={user.avatarUrl === null ? avatar : user.avatarUrl} alt="Foto do usuario" />
            </div>

            <Link to='/dashboard'>
                <FiHome color="#FFF" size={24} />
                Chamado
            </Link>
            <Link to='/customers'>
                <FiUser color="#FFF" size={24} />
                Clientes
            </Link>
            <Link to='/profile'>
                <FiSettings color="#FFF" size={24} />
                Perfil
            </Link>
        </div>
    )
}

export default Header