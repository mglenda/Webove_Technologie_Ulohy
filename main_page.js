function on_mouse_up(event){
    sessionStorage.setItem('quizType', event.target.id);
}

function get_name(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function on_mouse_over(event){
    event.target.style.transform = 'scale(1.1)';
    event.target.style.backgroundImage = "url('Graphics/" + get_name(event.target.id) + "Hovered.png')";
}

function on_mouse_out(event){
    var name = event.target.id.charAt(0).toUpperCase() + event.target.id.slice(1);
    event.target.style.transform = 'scale(1)';
    event.target.style.backgroundImage = "url('Graphics/" + name + "Normal.png')";
}

function on_load() {
    //AJAX call, nacitavanie dat z .json suboru
    fetch("Data/QuizData.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(json => load_data(json))
        .catch(error => {
            console.error("Error loading JSON file:", error);
        });
}

document.addEventListener('DOMContentLoaded', on_load);

function load_data(json){
    console.log(json);
    sessionStorage.setItem('quizData', JSON.stringify(json));

    for(quiz_name in json){
        console.log(quiz_name);
        create_quiz_div(quiz_name);
    }
}

function create_quiz_div(quiz_name){
    var container = document.getElementById("quizContainer");

    var item = document.createElement('div');
    item.classList.add('quiz-menu-item');

    var caption = document.createElement('div');
    caption.classList.add('quiz-caption');
    caption.textContent = get_name(quiz_name);

    var hyper = document.createElement('a');
    hyper.href = 'quiz_page.html';

    var btn = document.createElement('button')
    btn.classList.add('quiz-btn');
    btn.id = quiz_name;

    hyper.append(btn);
    item.append(caption);
    item.append(hyper);
    container.append(item);

    btn.style.backgroundImage = "url('Graphics/" + get_name(quiz_name) + "Normal.png')";

    btn.addEventListener('mouseup', on_mouse_up);
    btn.addEventListener('mouseover', on_mouse_over);
    btn.addEventListener('mouseout', on_mouse_out);
}