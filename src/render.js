const { PythonShell } = require('python-shell');

window.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.querySelector('input[type="submit"]');
  const inputBox = document.querySelector('#input');
  const messageContainer = document.querySelector('#message-container');

  const processInputText = (text) => {
    createMessageElement('You: ' + text);

    let pyshell = new PythonShell('src/localGPT/main.py');

    pyshell.send(text);

    pyshell.on('message', function (message) {
      createMessageElement('Bot: ' + message);
    });

    // Handle the script execution end
    pyshell.end(function (err, code, signal) {
      if (err) throw err;
    //   console.log('The exit code was: ' + code);
    //   console.log('The exit signal was: ' + signal);
    //   console.log('finished');
    });
  };

  const createMessageElement = (message) => {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
  };

  const printInputText = () => {
    const text = inputBox.value;
    processInputText(text);
    inputBox.value = '';
  };

  submitButton.addEventListener('click', printInputText);

  inputBox.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      printInputText();
    }
  });
});
