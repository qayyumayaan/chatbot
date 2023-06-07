window.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('input[type="submit"]');
    const inputBox = document.querySelector('#input');
  
    const printInputText = () => {
      const text = inputBox.value;
      console.log(text);
      inputBox.value = ''; // Clear the input box
    };
  
    submitButton.addEventListener('click', printInputText);
  
    inputBox.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        printInputText();
      }
    });
  });
  