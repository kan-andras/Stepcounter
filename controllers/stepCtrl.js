async function getallSteps(){
    //
    let luid = loadUser().ID;
    //
    const response = await fetch(`http://localhost:3000/users/${luid}/steps`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        //
        body: JSON.stringify({ luid })
        //
    });
    if (response.status != 200){
        const res = await response.json();
        showMessage('danger', 'ERROR', res.error)
    }
    else{
        const steps = await response.json();
        // console.log(users);
        drawStepsTable(steps);
        initChart(steps);
        initCalendar(steps);
    }
   
}
 
function drawStepsTable(steps){
    document.querySelector('#stepCount').innerHTML = steps.length;
    document.querySelector('#stepsList').innerHTML = '';
    steps.forEach((step, index) => addStepRow(step, index));
}
function addStepRow(step, index){
    const tr = document.createElement('tr');
    //Megkapjuk a values-okat és tömbben eltároljuk.
    const values = [
        (index + 1) + '.',
        step.step_count,
        moment(step.created_at).format('YYYY-MM-DD HH:mm:ss'),
        moment(step.updated_at).format('YYYY-MM-DD HH:mm:ss'),
        step.date
    ];
    //Bejárjuk a values-t a step adatait.
    values.forEach(v => {
        const td = document.createElement('td');
        td.textContent = v;
        tr.appendChild(td);
    });
    //Jobbra igazítjuk a tábla szövegeit és hozzá adunk 2 gombot.
    const tdActions = document.createElement('td');
    tdActions.classList.add('text-end');
    tdActions.innerHTML = `
        <button class="btn btn-sm btn-warning" onclick="editStep(${step.id})">Szerkesztés</button>
        <button class="btn btn-sm btn-danger" onclick="deleteStep(${step.id})">Törlés</button>`;
    tr.appendChild(tdActions);

    document.querySelector('#stepsList').appendChild(tr);
}

async function editStep(id) {
    let newCount = prompt('Új lépésszám:');
    if (newCount === null || newCount === '' || isNaN(newCount)) return;

    let luid = loadUser() ? loadUser().ID : 0;

    const response = await fetch(`http://localhost:3000/users/${luid}/steps/${id}`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ luid, step_count: Number(newCount) })
    });

    const res = await response.json();
    if (response.status != 200) {
        showMessage('danger', 'ERROR', res.error);
    } else {
        showMessage('success', 'OK', res.message);
        getallSteps();
    }
}

async function deleteStep(id) {
    if (!confirm('Biztosan törlöd ezt a bejegyzést?')) return;

    let luid = loadUser() ? loadUser().ID : 0;

    const response = await fetch(`http://localhost:3000/users/${luid}/steps/${id}`, {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ luid })
    });

    const res = await response.json();
    if (response.status != 200) {
        showMessage('danger', 'ERROR', res.error);
    } else {
        showMessage('success', 'OK', res.message);
        getallSteps();  
    }
}

async function newStep() {
    let step_count = document.querySelector('#step_ct').value;
    let date = document.querySelector('#nw_date').value;

    let luid = loadUser() ? loadUser().ID : 0;

    const response = await fetch(`http://localhost:3000/steps/${luid}`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ luid, step_count: Number(step_count), date })
    });

    const res = await response.json();
    if (response.status != 200) {
        showMessage('danger', 'ERROR', res.error);
    } else {
        showMessage('success', 'OK', res.message);
        document.querySelector('#step_ct').value = '';
        document.querySelector('#nw_date').value = '';
        getallSteps();
    }

}

function initChart(steps){
    const ctx = document.getElementById('myChart');
    let labels = [];
    let datas = [];

    steps.sort((a,b) => new Date(a.date) - new Date(b.date));

    steps.forEach((results) => {
        labels.push(moment(results.date).format('YYYY-MM-DD'));
        datas.push(results.step_count);
    })
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Steps',
          data: datas,
          borderWidth: 2,
          pointStyle: 'circle',
          pointRadius: 10,
          pointHoverRadius: 15
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
}

function initCalendar(steps){
    var calendarEl = document.getElementById('calendar');
    loadTheme();
    colorScheme = localStorage.getItem('SCT') || 'light';
    let myEvents = steps.map((steps) =>{
        return{
            title: steps.step_count + 'steps',
            start: steps.date,
        }
    })

    var calendar = new FullCalendar.Calendar(calendarEl, {
      colorScheme: colorScheme,
      initialDate: new Date(),
      initialView: 'dayGridMonth',
      nowIndicator: true,
      headerToolbar: {
        left: 'prevYear,prev,today,next,nextYear',
        center: 'title',
        right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      navLinks: true, // can click day/week names to navigate views
      editable: false,
      selectable: false,
      selectMirror: true,
      dayMaxEvents: true, // allow "more" link when too many events
      events: myEvents,
    });

    calendar.render();

};