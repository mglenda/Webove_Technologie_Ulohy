function on_mouse_up(event){
    sessionStorage.setItem('quizType', event.target.id);
}

document.getElementById('cities').addEventListener('mouseup', on_mouse_up);
document.getElementById('history').addEventListener('mouseup', on_mouse_up);
document.getElementById('computers').addEventListener('mouseup', on_mouse_up);