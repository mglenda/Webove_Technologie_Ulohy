var quiz_data = null;
var current_question = -1;
var correct_answers = 0;

function on_load() {
    var caption = document.getElementById("caption");
    var quizType = sessionStorage.getItem('quizType');
    caption.textContent = quizType.charAt(0).toUpperCase() + quizType.slice(1);
    document.title = quizType.charAt(0).toUpperCase() + quizType.slice(1);

    //AJAX call, nacitavanie dat z .json suboru
    fetch("Data/QuizData.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => load_quiz(data))
        .catch(error => {
            console.error("Error loading JSON file:", error);
        });
}

function animate_text(element,text){
    element.textContent = "";
    var index = 0;
    var interval = setInterval(function() {
        element.textContent += text[index];
        index++;
        if (index >= text.length) {
            clearInterval(interval);
        }
    }, 15);
}

function load_quiz(data){
    quiz_data = data[sessionStorage.getItem('quizType')];
    refresh_score();
    load_next_question();
}

function load_next_question(){
    if (quiz_data != null && ++current_question < quiz_data.length){
        for(var i = 0; i < 4; i++){
            document.getElementById(i).addEventListener('mouseup',option_click);
            document.getElementById(i).classList.remove('disable-hover');
        }
        animate_text(document.getElementById("questionText"),quiz_data[current_question].question);
        document.getElementById('questionImage').style.backgroundImage = "url('Graphics/" + quiz_data[current_question].image + "')";

        var options = quiz_data[current_question].options;
        for (var i = 0; i < options.length; i++) {
            document.getElementById(i).textContent = options[i];
        }
    }
}

function option_click(event){
    for(var i = 0; i < 4; i++){
        var element = document.getElementById(i);
        element.removeEventListener('mouseup',option_click);
        element.classList.add('disable-hover');
        console.log(quiz_data[current_question].answer);
        element.style.backgroundImage = i == quiz_data[current_question].answer ? "url('Graphics/OptionButtonCorrect.png')" : "url('Graphics/OptionButtonWrong.png')";
    }
    animate_text(document.getElementById("questionText"),quiz_data[current_question].info);
    if(parseInt(event.target.id,10) == quiz_data[current_question].answer){
        correct_answers++;
        refresh_score();
    }
}

function refresh_score(){
    var score = document.getElementById('score');
    score.textContent = correct_answers + ' / ' + quiz_data.length;
}

document.addEventListener('DOMContentLoaded', on_load);