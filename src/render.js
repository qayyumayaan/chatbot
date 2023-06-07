window.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('input[type="submit"]');
    const inputBox = document.querySelector('#input');
    const messageContainer = document.querySelector('#message-container');
  
    const processInputText = (text) => {
      createMessageElement('You: ' + text);
      if (text === 'password') {
        createMessageElement('Bot: yay!');
      }
    };
  
    const createMessageElement = (message) => {
      const messageElement = document.createElement('p');
      messageElement.textContent = message;
      messageContainer.appendChild(messageElement);
    };
  
    const printInputText = () => {
      const text = inputBox.value;
      processInputText(text);
      inputBox.value = ''; // Clear the input box
    };
  
    submitButton.addEventListener('click', printInputText);
  
    inputBox.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        printInputText();
      }
    });
  });
  