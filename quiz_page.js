var quiz_data = null;
var current_question = -1;
var correct_answers = 0;
var question_timer = null;
const question_timeout = 15;
var time = question_timeout;
var total_time = 0;

/*Json na storovanie textovych animacii elementov, aby sa pri vytvarani novej animacie stara znicila pokial este stale bezi.*/
var text_anims = {};

function get_name(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function refresh_score(){
    var score = document.getElementById('score');
    score.textContent = correct_answers + ' / ' + quiz_data.length;
}

function refresh_time(){
    var text = document.getElementById('timer');
    text.textContent = time;

    var wheel = document.getElementById('wheel');

    if (typeof time === 'number'){
        var hue = Math.round((time / question_timeout) * 105);
        wheel.style.setProperty('--hue',hue);
        text.style.setProperty('--hue',hue);
    }
}

function on_load() {
    var caption = document.getElementById("caption");
    var quizType = sessionStorage.getItem('quizType');
    quiz_data = JSON.parse(sessionStorage.getItem('quizData'))[quizType];
    caption.textContent = get_name(quizType);
    document.title = get_name(quizType);
    document.getElementById("wheel").addEventListener('mouseup',load_next_question);
    refresh_score();
    load_next_question();
}

document.addEventListener('DOMContentLoaded', on_load);

function animate_text(element,text){
    if (text_anims.hasOwnProperty(element)){
        clearInterval(text_anims[element]);
    }
    element.textContent = "";
    var index = 0;
    var interval = setInterval(function() {
        element.textContent += text[index];
        index++;
        if (index >= text.length) {
            clearInterval(interval);
            text_anims[element] = null;
        }
    }, 15);
    text_anims[element] = interval;
}

function stop_timer(){
    if (question_timer != null){
        clearInterval(question_timer);
    }
}

function start_timer(){
    time = question_timeout;
    refresh_time();
    stop_timer();
    question_timer = setInterval(timer_tick,1000);
}

function timer_tick(){
    if(--time <= 0){
        end_timer();
    }
    total_time++;
    refresh_time();
}

function load_next_question(){
    if (quiz_data != null && ++current_question < quiz_data.length){
        for(var i = 0; i < 4; i++){
            var element = document.getElementById(i);
            element.addEventListener('mouseup',option_click);
            element.style.setProperty('--img',"url('Graphics/OptionButton.png')")
            element.classList.remove('disable-hover');
        }
        animate_text(document.getElementById("questionText"),quiz_data[current_question].question);
        document.getElementById('questionImage').style.backgroundImage = "url('Graphics/" + quiz_data[current_question].image + "')";

        var options = quiz_data[current_question].options;
        for (var i = 0; i < options.length; i++) {
            document.getElementById(i).textContent = options[i];
        }

        var wheel = document.getElementById("wheel");
        wheel.style.animation = 'loading-animation 1.2s linear infinite';
        wheel.classList.add('disable-hover');
        start_timer();
    }else{
        sessionStorage.setItem('correctAnswers',correct_answers);
        sessionStorage.setItem('totalAnswers',current_question);
        sessionStorage.setItem('totalTime',total_time);

        if(sessionStorage.getItem('nickName')){
            store_data();
            return;
        }
        window.location.href = 'result_page.html';
    }
}

function store_data(){
    var quiz_type = sessionStorage.getItem('quizType');
    var data = JSON.parse(sessionStorage.getItem('scoreData'));

    data[quiz_type].push({
        "nickname": sessionStorage.getItem('nickName')
        ,"correct_answers": Number(correct_answers)
        ,"total_answers": Number(current_question)
        ,"total_time": Number(total_time)
    });

    sessionStorage.setItem('scoreData',JSON.stringify(data));
    window.location.href = 'score_page.html';
}

function end_timer(){
    stop_timer();
    for(let i = 0; i < 4; i++){
        var element = document.getElementById(i);
        element.removeEventListener('mouseup',option_click);
        element.classList.add('disable-hover');
        element.style.setProperty('--img',i == quiz_data[current_question].answer ? "url('Graphics/OptionButtonCorrect.png')" : "url('Graphics/OptionButtonWrong.png')");
    }
    animate_text(document.getElementById("questionText"),quiz_data[current_question].info);

    var wheel = document.getElementById("wheel");
    wheel.style.animation = 'none';
    wheel.classList.remove('disable-hover');

    time = (current_question + 1) < quiz_data.length ? 'Next' : 'End';
    refresh_time();
}

function option_click(event){
    end_timer();
    if(parseInt(event.target.id,10) == quiz_data[current_question].answer){
        correct_answers++;
        refresh_score();
    }
}