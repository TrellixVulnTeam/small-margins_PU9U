const flashMessage = document.querySelector('.flash-message');
const closeFlashMessage = document.querySelector('.flash-btn');

closeFlashMessage.addEventListener('click', () => {
    flashMessage.classList.add('hidden');
})