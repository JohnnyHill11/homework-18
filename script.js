'use strict';

const CONTACTS_URL = 'https://5dd3d5ba8b5e080014dc4bfa.mockapi.io/contacts/';
const EDIT_BTN_CLASS = 'edit-btn';
const DELETE_BTN_CLASS = 'delete-btn';
const CONTACT_ROW_SELECTOR = '.contact-row';
const CONTACT_ROW_CLASS = 'contact-row';

const contactForm = document.querySelector('#contact-form');
const formInputs = document.querySelectorAll('.form-input');
const contactId = document.querySelector('#contactId');
const inputName = document.querySelector('#first-name');
const inputSurname = document.querySelector('#last-name');
const inputPhone = document.querySelector('#phone-number');

const buttonAdd = document.querySelector('#add-btn-id');
const contactTemplate = document.querySelector('#contact-Template').innerHTML;
const tableContactList = document.querySelector('#contact-list-id');

let contactList = [];

contactForm.addEventListener('submit', onContactFormSubmit);
tableContactList.addEventListener('click', onTableContactListClick);

const contactsResourse = new Resourse(CONTACTS_URL);

init();

function onContactFormSubmit(event) {
  event.preventDefault();
  const newContact = getContact();
  if (newContact.id) {
    updateContact(newContact);
  } else  if(isContactValidForm(newContact)) {
  addContact(newContact);
  } else {
    alert('Not valid!');
    resetForm();
  } 
}

function onTableContactListClick(event) {
  const contactElement = getContactElement(event.target)
  switch (true) {
    case (event.target.classList.contains(DELETE_BTN_CLASS)):
      deleteContact(contactElement.dataset.id);
      break;
    case (event.target.classList.contains(EDIT_BTN_CLASS)):
      editContact(contactElement.dataset.id);
      break;
  }
}

function init(){
  fetchContacts();
}

function fetchContacts() {
  contactsResourse.list()
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

function editContact(contactId) {
  const contact = contactList.find((contact) => contact.id === contactId);
  fillForm(contact);
  console.log(contact)
}

function fillForm(obj) {
  contactId.value = obj.id;
  inputName.value = obj.name
  inputSurname.value = obj.surname
  inputPhone.value = obj.phone;
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
  contactsResourse.add(contact)
  .then(data => {
    contactList.push(data);
    renderContacts(contactList);
    resetForm();
  })
}

function updateContact(contact) {
  contactList = contactList.map((el) => (el.id != contact.id ? el : contact));
  contactsResourse.put(contact.id, contact)
  renderContacts(contactList);
  resetForm();
}

function resetForm() {
  contactForm.reset();
}