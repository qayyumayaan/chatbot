window.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('input[type="submit"]');
    const inputBox = document.querySelector('#input');
  
    const processInputText = (text) => {
      if (text === 'password') {
        console.log('yay!');
      }
    };
  
    const printInputText = () => {
      const text = inputBox.value;
      console.log(text);
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
  