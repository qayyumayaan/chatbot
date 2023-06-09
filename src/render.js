const { PythonShell } = require('python-shell');

let options = {
  mode: 'text',
  pythonOptions: ['-u'], // get print results in real-time
};

let pyshell = new PythonShell('src/localGPT/run_localGPT.py', options);

window.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.querySelector('input[type="submit"]');
  const inputBox = document.querySelector('#input');
  const messageContainer = document.querySelector('#message-container');
  const clearButton = document.querySelector('#clear-button');
  const copyButton = document.querySelector('#copy-button'); 

  const createMessageElement = (message) => {
    const messageElement = document.createElement('p');
    const user = message.split(' ')[0] + ' ';
    messageElement.setAttribute('data-user', user);
    messageElement.textContent = message.slice(user.length);
    messageContainer.appendChild(messageElement);
  };

  pyshell.on('message', function (message) {
    try {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.response !== undefined) {
        createMessageElement('Bot: ' + parsedMessage.response);
      }
    } catch (error) {
      console.log(message);
    }
  });

  const processInputText = (text) => {
    createMessageElement('You: ' + text);
    pyshell.send(text); 

    if (text.startsWith('exit')) {
      createMessageElement('Bot: Bye!');
      pyshell.end(function (err, code, signal) {
        if (err) throw err;
      });
    }
  };

  const printInputText = () => {
    const text = inputBox.value.trim();
    if (text !== '') {
      processInputText(text);
      inputBox.value = '';
    }
  };

  const clearConversation = () => {
    messageContainer.innerHTML = '';
  };

  const copyConversation = () => {
    const conversation = messageContainer.innerText.trim();
    if (conversation !== '') {
      navigator.clipboard.writeText(conversation)
        .then(() => {
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
            copyButton.textContent = 'Copy';
          }, 3000);
        })
        .catch((error) => {
          console.error('Failed to copy conversation: ', error);
        });
    }
  };  

  submitButton.addEventListener('click', printInputText);

  inputBox.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      printInputText();
    }
  });

  clearButton.addEventListener('click', clearConversation);
  copyButton.addEventListener('click', copyConversation);
});