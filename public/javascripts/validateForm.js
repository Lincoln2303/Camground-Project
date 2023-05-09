// XXXV.05. Moving here bootstrap validation function:
(function () {
    'use strict'
    // LXXIII.03. Adding bsCustomFileInput.init() from bootsrap DOCS:
    // AFTER: We change the file input in /campgrounds/edit.ejs too (LXXIII.04.)
    bsCustomFileInput.init();
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form');
  
    // Loop over them and prevent submission: (NOTE: This is technically making an array)
    Array.from(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
})()