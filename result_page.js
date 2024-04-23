var nickname = null;

function verify_input(){
    var error_txt = document.getElementById('error');
    var selectedGender = document.querySelector('input[name="gender"]:checked');
    if(!selectedGender){
        error_txt.textContent = '*I need you to specify your gender, even in 2024 ...'
        return false;
    }

    var email = document.getElementById('email').value;
    if(!String(email).toLowerCase()
    //regex na verifikaciu ci bola zadany validny email
    .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
    {
        error_txt.textContent = '*Wrong email format';
        return false;
    }

    nickname = document.getElementById('nickname').value;
    if(nickname.length < 5 || nickname.length > 15){
        error_txt.textContent = '*Nickname needs to have 5-15 characters';
        return false;
    }

    var birthday = document.getElementById('birthday').value;
    if(!birthday){
        error_txt.textContent = '*Birthday is empty';
        return false;
    }

    var robot = document.getElementById('robot')
    if(!robot.checked){
        error_txt.textContent = '*You need to confirm a robot check';
        return false;
    }
    return true;
}

function submit(){
    if(verify_input()){
        store_data();
    }
}

function store_data(){
    var correct_answers = sessionStorage.getItem('correctAnswers');
    var total_answers = sessionStorage.getItem('totalAnswers');
    var total_time = sessionStorage.getItem('totalTime');
    var quiz_type = sessionStorage.getItem('quizType');
    var data = JSON.parse(sessionStorage.getItem('scoreData'));

    data[quiz_type].push({
        "nickname": nickname
        ,"correct_answers": Number(correct_answers)
        ,"total_answers": Number(total_answers)
        ,"total_time": Number(total_time)
    });

    sessionStorage.setItem('nickName',nickname);
    sessionStorage.setItem('scoreData',JSON.stringify(data));
    window.location.href = 'score_page.html';
}

function on_load(){
    nickname = sessionStorage.getItem('nickName');
    if(nickname){
        store_data();
    }
}

document.getElementById('submit').addEventListener('mouseup',submit);
document.addEventListener('DOMContentLoaded', on_load);