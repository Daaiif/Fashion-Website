var iconSearch = document.querySelector('.icons-search')
var body = document.querySelector('body')

iconSearch.addEventListener('click', function(event) {
    event.stopPropagation();
    this.classList.add('active');
});

body.addEventListener('click', function() {
    iconSearch.classList.remove('active');
});