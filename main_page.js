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

/*Pri spusteni stranky sa AJAXOM nacitavaju data o kvizoch a tiez data o skore, kedze pracujem len na front-ende data o skore.*/
function on_load() {
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

    fetch("Data/QuizScore.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(json => load_score(json))
        .catch(error => {
            console.error("Error loading JSON file:", error);
        });
}

document.addEventListener('DOMContentLoaded', on_load);

function load_score(json){
    if(!sessionStorage.getItem('scoreData')){
        sessionStorage.setItem('scoreData', JSON.stringify(json));
    }
}

/*Tu si data o kvizoch ulozim aj do sessionStorage nakolko ich budem vyuzivat aj v dalsich castiach webu. Nasledne loopujem cez vsetky vrchne kluce JSONU a vytvaram k nim kviz_div. Tlacidlo s obrazkom a nadpisom. 
  Taketo dynamicke nacitavanie zabezpecuje, ze v pripade potreby pridania noveho ci odobratia stareho kvizu, staci zeditovat vstupny .json subor a nemusi sa vobec zasahovat do kodu.
*/
function load_data(json){
    sessionStorage.setItem('quizData', JSON.stringify(json));

    for(quiz_name in json){
        console.log(quiz_name);
        create_quiz_div(quiz_name);
    }
}

/*Vytvorenie quiz_divu.*/
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