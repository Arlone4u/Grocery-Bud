import React, { useState, useEffect } from 'react';
import List from './List';
import Alert from './Alert';

/* A function that saves the value or a local storage of the list which
has two option if the list exist or if doesn't */
const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return (list = JSON.parse(localStorage.getItem('list')));
  } else {
    return [];
  }
};

function App() {
  /* Value to be used */
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });
  
  /* Handles the Submit button where we edit name of the items, shows the alert and success portion */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name) {
      showAlert(true, 'danger', 'Please Enter Item To Added To Basket'); // displays the alert message if no item is being added
    } else if (name && isEditing) { 
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        }) // deals with editting the item in the list
      );
      setName('');
      setEditID(null);
      setIsEditing(false);
      showAlert(true, 'success', 'Item Changed To ' + (name));
    } // then shows the value is changed if success
    else {
      showAlert(true, 'success', (name) + ' Added to The Basket');
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName('');
      setIsEditing(false);
    } // showing the alert message if an item is being added into the list
  };
  /* A function that finds the parameter that is needed, clearing the list,
    removing and editing the list function*/
  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };
  const clearList = () => {
    showAlert(true, 'danger', 'empty list');
    setList([]);
  };
  const removeItem = (id) => {
    showAlert(true, 'danger', ' Removed From The Basket');
    setList(list.filter((item) => item.id !== id));
  };
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };
  
  /* Use effect that save the latest value in the list */
  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]);
  
  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}

        <h3>grocery bud</h3>
        <div className='form-control'>
          <input
            type='text'
            className='grocery'
            placeholder='e.g. banana'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type='submit' className='submit-btn'>
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className='grocery-container'>
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className='clear-btn' onClick={clearList}>
            clear items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
