function get_name(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/*Pri spusteni stranky sa nacitaju data o skore z jsonu a vytvoria sa riadky/bunky tabulky.*/
function on_load(){
    var data = JSON.parse(sessionStorage.getItem('scoreData'));
    var t_body = document.getElementById('table-body');

    for(quiz_type in data){
        console.log(quiz_type);
        if (data[quiz_type].length > 0){
            for(record of data[quiz_type]){
                var row = document.createElement('tr');
                add_cell(row,get_name(quiz_type));
                add_cell(row,record['total_answers']);
                add_cell(row,record['correct_answers']);
                add_cell(row,record['total_time'] + ' sec');
                t_body.appendChild(row);
            }
        }
    }
}

function add_cell(row,value){
    var cell = document.createElement('td');
    cell.textContent = value;
    row.appendChild(cell);
}

document.addEventListener('DOMContentLoaded', on_load);