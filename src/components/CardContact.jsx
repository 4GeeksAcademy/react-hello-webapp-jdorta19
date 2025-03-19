import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";


type Contact = {
  id?: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
};

const ContactContext = createContext({
  contacts: [],
  fetchContacts: () => {},
  addContact: (contact: Contact) => {},
  deleteContact: (id: number) => {},
});

const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const API_URL = "https://playground.4geeks.com/contact/";

 
  const fetchContacts = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setContacts(data);
  };

  
  const addContact = async (contact) => {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });
    fetchContacts();
  };

  
  const deleteContact = async (id) => {
   
    if (id) {
      await fetch(`${API_URL}${id}/`, { method: "DELETE" });
      fetchContacts(); 
    }
  };

  
  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <ContactContext.Provider value={{ contacts, fetchContacts, addContact, deleteContact }}>
      {children}
    </ContactContext.Provider>
  );
};

const useContacts = () => useContext(ContactContext);


const ContactCard = ({ contact }) => {
  const { deleteContact } = useContacts();

  return (
    <div>
      <h3>{contact.full_name}</h3>
      <p>{contact.email}</p>
      <p>{contact.phone}</p>
      <p>{contact.address}</p>
      
      <button onClick={() => deleteContact(contact.id)}>Eliminar</button>
    </div>
  );
};

const ContactList = () => {
  const { contacts } = useContacts();
  return (
    <div>
      <h2>Lista de Contactos</h2>
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
      <Link to="/add">Añadir Contacto</Link>
    </div>
  );
};

const AddContact = () => {
  const { addContact } = useContacts();
  const navigate = useNavigate();
  const [contact, setContact] = useState({ full_name: "", email: "", phone: "", address: "" });

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addContact(contact);
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="full_name" placeholder="Nombre" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="phone" placeholder="Teléfono" onChange={handleChange} required />
      <input name="address" placeholder="Dirección" onChange={handleChange} required />
      <button type="submit">Guardar</button>
    </form>
  );
};

const App = () => {
  return (
    <ContactProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ContactList />} />
          <Route path="/add" element={<AddContact />} />
        </Routes>
      </Router>
    </ContactProvider>
  );
};

export default App;
