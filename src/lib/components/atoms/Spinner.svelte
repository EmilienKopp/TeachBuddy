<!-- Spinner.svelte -->

  
<span class="spinner" role="status" aria-hidden="true"></span>

<style>
.spinner {
  display: inline-block;
  width: 35px;
  height: 35px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  border-top-color: #000;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

</style>
  

  