const sidebar = document.querySelector('.sidebar');

document.querySelector('button').onclick = function () {
    sidebar.classList.toggle('sidebar_expand');
}