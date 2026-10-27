(function(){
  var form = document.querySelector('[data-contact-form]');
  if(!form){ return; }
  var status = form.querySelector('.form-status');
  form.addEventListener('submit', function(event){
    event.preventDefault();
    status.textContent = 'Sending your enquiry...';
    status.className = 'form-status is-pending';
    fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function(response){
      if(!response.ok){ throw new Error('Submission failed'); }
      form.reset();
      status.textContent = 'Thank you. Your enquiry has been sent.';
      status.className = 'form-status is-success';
    }).catch(function(){
      status.textContent = 'We could not send your enquiry. Please try again shortly.';
      status.className = 'form-status is-error';
    });
  });
})();