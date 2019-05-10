// xoxs-252255834967-591627168021-592733315942-11afb8e81ce999e04899c81472d8f1f15943f9aee3aec27039db6cc882ee4c7b
let token = prompt('DIME TU TOKEN');

function generateCards() {
  $('#contenedor-card').html('');
  $.get(`https://slack.com/api/conversations.history?token=${token}&channel=GHR6U88FN&pretty=1`,
    function(data) {
      /*
      Obtenemos de la petición GET el mensaje, userId y time de publicación
      */
      for (var i = 0; i < data["messages"].length; i++) {
        let userId = data["messages"][i]["user"];
        let message = data["messages"][i]["text"];
        let date = data["messages"][i]["ts"];
        /*let url;
        let image;
        if (data["messages"][i]["attachments"] > [0]) {
          url =  data["messages"][i]["attachments"][0]["from_url"];
        }
        if (data["messages"][i]["attachments"] > [0]) {
          image = data["messages"][i]["attachments"][0]["image_url"];
        }*/
        getUserInfo(userId, message, date);
      }
    }
  )
}

function getUserInfo(userId, message, date) {
  /*
  Del userId volvemos a realizar una llamada para obtener el Real Name
  */
  $.get(`https://slack.com/api/users.info?token=${token}&user=${userId}&pretty=1`,
    function(userData) {
      printData(userData["user"]["real_name"], message, date, userData["user"]["profile"]["image_original"]);
    })
}

function printData(userName, message, date, avatar) {
  /*
  Imprime la información obtenida en el DOM
  */
  var res = (date.split(".")[0]) * 1000;
  let fecha = new Date(res);
  var dateString = fecha.getDate() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getFullYear() + " " + "|" + " " +
    fecha.getHours() + ":" + fecha.getMinutes();

  $('#contenedor-card').append(`
    <div class="card">
      <div class="card-header">
        Date: ${dateString}
      </div>
      <div class="card-body">
        <h5 class="card-title"><span><img src="${avatar}" width="50px"></span> ${userName} dice:</h5>
        <p class="card-text">${message}</p>
      </div>
    </div>
    <br>
    `);
}

function sendMessage() {
  let myMessage = $("#contenedor-text").val();
  $.post(`https://slack.com/api/chat.postMessage?token=${token}&channel=GHR6U88FN&pretty=1`, {
      "text": `${myMessage}`
    },
    function() {
      console.log("Mensaje publicado");
      generateCards();
    }
  )
}
// BIND y llamada POST para publicar mensaje
console.log("hola");
$('#chat-button').click(sendMessage);

generateCards();

// TODO - Insertar los links y las imágenes
/*<a href="${url}">${url}</a>
<img src="${image}" width="400px">*/
//
