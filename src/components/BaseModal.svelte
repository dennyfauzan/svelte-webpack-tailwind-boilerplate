<style lang="scss">
  #modal-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s;

    &.active {
      visibility: visible;
      opacity: 1;
      pointer-events: auto;
    }
  }

  .overlay {
    background-color: rgb(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
  }

  .modal-box {
    width: 60%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 2em;
    background: #ffffff;
    border-left: 6px solid #c81322;
    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12),
      0 2px 4px -1px rgba(0, 0, 0, 0.3);
    z-index: 10;
  }
  .modal-close {
    color: #aaa;
    line-height: 50px;
    font-size: 80%;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
    width: 70px;
    text-decoration: none;
    z-index: 900;
  }
  p {
    color: gray;
  }
</style>

<script>
  let modalToggle = false;
  function handleModalToggle() {
    modalToggle = !modalToggle;
  }
  function closeModal() {
    modalToggle = false;
  }
</script>

<button on:click={handleModalToggle}>State: {modalToggle}</button>
<h1 on:click={()=> console.log('runn')}>
  Sweet Candy
</h1>
<div id="modal-container" class={modalToggle? 'active': ''} >
  <div class="overlay" on:click={()=> modalToggle = false}></div>
	<div class="modal-box">
		<span
      title="Close"
      class="modal-close"
      on:click={closeModal}>
      Close
    </span> 
		<h1>
			Hello Modal
		</h1>
		<p>
			this is the content of modal that can reusable!
		</p>
	</div>
</div>