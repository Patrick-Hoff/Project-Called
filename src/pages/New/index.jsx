import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiPlusCircle } from 'react-icons/fi'

import './style.css'
import { useState, useEffect, useContext } from 'react'

import { AuthContext } from '../../contexts/auth'
import { db } from '../../services/firebaseConnection'
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore'

import { useParams, useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'

function New() {

    const listRef = collection(db, 'customers');

    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([])
    const [loadCustomers, setLoadCustomers] = useState(true)
    const [customerSelected, setCustomersSelecter] = useState(0)

    const [complemento, setComplemento] = useState('')
    const [assunto, setAssunto] = useState('Suporte')
    const [status, setStatus] = useState('Aberto')

    const [idCustomer, setIdCustomer] = useState(false)


    useEffect(() => {


        async function loadCustomers() {
            const querySnapshot = await getDocs(listRef)
                .then((snapshot) => {
                    let lista = [];

                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            nomeFantasia: doc.data().nomeFantasia
                        })
                    })

                    if (snapshot.docs.size === 0) {
                        console.log("nenhuma empresa emcontrada")
                        setCustomers([{ id: '1', nomeFantasia: 'FREELA' }])
                        setLoadCustomers(false)
                        return;
                    }

                    setCustomers(lista);
                    setLoadCustomers(false);

                    if (id) {
                        loadId(lista);
                    }

                })
                .catch((error) => {
                    console.log(error)
                    setLoadCustomers(false);
                    setCustomers([{ id: '1', nomeFantasia: 'FREELA' }])
                })
        }

        loadCustomers();
    }, [id])

    async function loadId(lista) {
        const docRef = doc(db, 'chamados', id);
        await getDoc(docRef)
            .then((snapshot) => {
                setAssunto(snapshot.data().assunto);
                setStatus(snapshot.data().status);
                setComplemento(snapshot.data().complemento);

                let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
                setCustomersSelecter(index)
                setIdCustomer(true);

            })
            .catch((error) => {
                console.log(error)
                setIdCustomer(false)
            })
    }


    function handleIptionChange(e) {
        setStatus(e.target.value);
    }

    function handleChangeSelect(e) {
        setAssunto(e.target.value)
    }

    function handleChangeCustomer(e) {
        setCustomersSelecter(e.target.value)
        console.log(customers[e.target.value])
    }

    async function handleRegister(e) {
        e.preventDefault();

        if (idCustomer) {
            // Atualizando chamado
            const docRef = doc(db, 'chamados', id)
            await updateDoc(docRef, {
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                userId: user.uid,
            })
            .then(() => {
                toast.info('Chamado atualizado com sucesso!')
                setCustomersSelecter(0);
                setComplemento('');
                navigate('/dashboard');
            })
            .catch((error) => {
                console.log(error)
                toast.error('Ops erro ao atualizar esse chamado!')
            })
            return;
        }


        // Registrar chamado
        await addDoc(collection(db, "chamados"), {
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid,
        })
            .then((e) => {
                toast.success('Chamdo registrado!')
                setComplemento('');
                setCustomersSelecter(0);
                navigate('/dashboard');
            })
            .catch((error) => {
                toast.error('Ops erro ao regostrar, tente mais tarde!')
                console.log(error);
            })
    }


    return (

        <div>

            <Header />

            <div className='content'>

                <Title name={id ? 'Editando chamado' : 'Novo chamado'}>
                    <FiPlusCircle size={25} />
                </Title>

                <div className='container'>

                    <form className='form-profile' onSubmit={handleRegister}>

                        <label>Clientes</label>
                        {
                            loadCustomers ? (
                                <input type='text' disabled={true} value='Carregando...' />
                            ) : (
                                <select value={customerSelected} onChange={handleChangeCustomer}>
                                    {
                                        customers.map((item, index) => {
                                            return (
                                                <option key={index} value={index}>
                                                    {
                                                        item.nomeFantasia
                                                    }
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            )
                        }

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita Tecnica">Visita Tecnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className='status'>

                            <input
                                type='radio'
                                name='radio'
                                value="Aberto"
                                onChange={handleIptionChange}
                                checked={status === 'Aberto'}
                            />

                            <span>Em aberto</span>
                            <input
                                type='radio'
                                name='radio'
                                value="Progresso"
                                onChange={handleIptionChange}
                                checked={status == 'Progresso'}
                            />

                            <span>Progresso</span>

                            <input
                                type='radio'
                                name='radio'
                                value="Atendido"
                                onChange={handleIptionChange}
                                checked={status == 'Atendido'}
                            />
                            <span>Atendido</span>

                        </div>

                        <label>Complemento</label>
                        <textarea
                            type='text'
                            placeholder='Descreva seu problema (opcional).'
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)}
                        />

                        <button type='submit'>Registrar</button>

                    </form>

                </div>

            </div>

        </div>
    )
}

export default New