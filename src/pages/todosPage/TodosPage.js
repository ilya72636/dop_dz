import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './todo.module.css';

function TodoPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [emailError, setEmailError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    fetchUsers(); 
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/todos');
      setUsers(response.data); 
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleAddUser = async () => {
    if (name && email && username) {
      if (validateEmail(email)) {
        const newUser = {
          name: name,
          email: email,
          username: username
        };

        try {
          const response = await axios.post('http://localhost:8000/todos', newUser);
          setUsers([...users, response.data]);
          resetForm(); 
          setModalTitle('Пользователь успешно создан');
          setModalOpen(true);
        } catch (error) {
          console.error('Failed to add user:', error);
          alert('Failed to add user. Please try again.');
        }
      } else {
        setEmailError('Некорректный формат email');
      }
    } else {
      alert('Пожалуйста, заполните все поля');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/todos/${id}`);
      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers);
      setModalTitle('Пользователь успешно удален');
      setModalOpen(true);
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setUsername('');
    setEmailError('');
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const validateEmail = (inputEmail) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(inputEmail);
  };

  return (
    <div className={styles.todoPage}>
      <div className={styles.container}>
        <div className={styles.inputContainer}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={styles.input} placeholder="NAME" />
        </div>
        <div className={styles.inputContainer}>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} placeholder="EMAIL" />
          {emailError && <p className={styles.error}>{emailError}</p>}
        </div>
        <div className={styles.inputContainer}>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={styles.input} placeholder="USERNAME" />
        </div>
        <button onClick={handleAddUser} className={styles.addButton}>CREATE</button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.todoTable}>
          <thead>
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>USERNAME</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className={styles.emptyMessage}>Список пуст</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td className={styles.deleteText} onClick={() => handleDeleteUser(user.id)}>delete</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>{modalTitle}</h3>
            <button onClick={closeModal} className={styles.modalButton}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoPage;
