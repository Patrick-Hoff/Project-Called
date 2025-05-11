import { useState, useEffect } from 'react'

import Header from '../../components/Header'
import Title from '../../components/Title'

import { FiUser } from 'react-icons/fi'

import { db } from '../../services/firebaseConnection'
import { addDoc, collection, query, getDocs, onSnapshot } from 'firebase/firestore'

import { toast } from 'react-toastify'

const listRef = collection(db, 'customers')

function Customers() {

    const [nome, setNome] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [endereco, setEndereco] = useState('')

    // Clientes
    const [clientes, setClientes] = useState()


    async function handleRegister(e) {
        e.preventDefault();

        if (nome !== '' && cnpj !== '' && endereco !== '') {
            await addDoc(collection(db, "customers"), {
                nomeFantasia: nome,
                cnpj: cnpj,
                endereco: endereco,
            })
                .then(() => {
                    setNome('');
                    setEndereco('');
                    setCnpj('');
                    toast.success("Empresa registrada!");
                })
                .catch((error) => {
                    console.log(error)
                    toast.error("Erro ao fazer o cadastro.");
                })
        } else {
            toast.error("Erro ao fazer o cadastro.")
        }
    }

    useEffect(() => {

        // Aqui, substituímos o getDocs por onSnapshot
        const unsub = onSnapshot(listRef, (snapshot) => {
            let lista = []

            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    nomeFantasia: doc.data().nomeFantasia,
                    cnpj: doc.data().cnpj,
                    endereco: doc.data().endereco,
                })
            })

            setClientes(lista)
        })

        return () => unsub()

    }, [])

    console.log(clientes)

    return (
        <div>

            <Header />

            <div className='content'>
                <Title name="Clientes">
                    <FiUser size={25} />
                </Title>


                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Nome fantasia</label>
                        <input
                            type='text'
                            placeholder='Nome da empresa'
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />

                        <label>CNPJ</label>
                        <input
                            type='text'
                            placeholder='Digite o CNPJ'
                            value={cnpj}
                            onChange={(e) => setCnpj(e.target.value)}
                        />

                        <label>Endereço</label>
                        <input
                            type='text'
                            placeholder='Endereço da empresa'
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                        />

                        <button type="submit">
                            Cadastrar
                        </button>
                    </form>
                </div>

                <div className="container">
                    {clientes && clientes.length > 0 ? (
                        <table className="clientes-table">
                            <thead>
                                <tr>
                                    <th>Nome Fantasia</th>
                                    <th>CNPJ</th>
                                    <th>Endereço</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientes.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.nomeFantasia}</td>
                                        <td>{item.cnpj}</td>
                                        <td>{item.endereco}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Nenhum cliente cadastrado.</p>
                    )}
                </div>


            </div>



        </div>
    )
}

export default Customers