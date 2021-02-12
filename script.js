'use strict';

const CONTACTS_URL = 'https://5dd3d5ba8b5e080014dc4bfa.mockapi.io/contacts/';
const DELETE_BTN_CLASS = 'delete-btn';
const CONTACT_ROW_SELECTOR = '.contact-row';
const CONTACT_ROW_CLASS = 'contact-row';

const contactForm = document.querySelector('#contact-form');
const formInputs = document.querySelectorAll('.form-input');
const buttonAdd = document.querySelector('#add-btn-id');
const contactTemplate = document.querySelector('#contact-Template').innerHTML;
const tableContactList = document.querySelector('#contact-list-id');

let contactList = [];

contactForm.addEventListener('submit', onContactFormSubmit);
tableContactList.addEventListener('click', onTableContactListClick);

const contactsResourse = new Resourse(CONTACTS_URL);

init();

function init(){
  fetchContacts();
}

function onTableContactListClick(event) {
  const contactElement = getContactElement(event.target)
  if(event.target.classList.contains(DELETE_BTN_CLASS)) {
    deleteContact(contactElement.dataset.id);
  }
}

function onContactFormSubmit(event) {
  event.preventDefault();
  const newContact = getContact();
  
  if(isContactValidForm(newContact)) {
    addContact(newContact);
    resetForm();
  } else {
    alert('Not valid!');
    resetForm();
  }
}

function fetchContacts() {
  contactsResourse.get()
  .then(setContacts)
  .then(renderContacts);
}

function setContacts(list) {
  return contactList = list;
}

function renderContacts(list) {
  const html = list.map(generateContactHtml).join('');
  tableContactList.innerHTML = html;
}

function generateContactHtml(contact) {
  return contactTemplate
    .replace('{{name}}', contact.name)
    .replace('{{surname}}', contact.surname)
    .replace('{{phone}}', contact.phone)
    .replace('{{id}}', contact.id);
}

function deleteContact(contactId) {
  contactList = contactList.filter((contact) => contact.id !== contactId)
  contactsResourse.delete(contactId)
  renderContacts(contactList);
}

function getContactElement(element) {
  return element.closest(CONTACT_ROW_SELECTOR);
}

function getContact() {
    const contact = {};
    formInputs.forEach((input) => {
      contact[input.name] = input.value;
      }
    );
    return contact;
  }

function isContactValidForm(contact) {
  return(
    isFieldValid(contact.name) && isNaN(contact.name) &&
    isFieldValid(contact.surname) && isNaN(contact.surname) &&
    isFieldValid(contact.phone) && !isNaN(contact.phone)
  ); 
}

function isFieldValid(value) {
  return value !== '';
}

function addContact(contact) {
  contactsResourse.post(contact)
  .then(data => {
    contactList.push(data);
    renderContacts(contactList);
  })
}
function resetForm() {
  contactForm.reset();
}