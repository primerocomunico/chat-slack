function generateCards(urlAccess, token) {
$('#contenedor-card').html('');
$.get(urlAccess,

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
    getUserInfo(token, userId, message, date);

  }
}
)
}

function getUserInfo(token, userId, message, date) {
/*
Del userId volvemos a realizar una llamada para obtener el Real Name
*/
$.get(`https://slack.com/api/users.info?token=${token}&user=${userId}&pretty=1`,
function(userData) {
  console.log(userData);
  printData(userData["user"]["real_name"], message, date, userData["user"]["profile"]["image_original"]);
})
}

function printData(userName, message, date, avatar) {
console.log(token);
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

function sendMessage(urlAccess) {
  /*
  Publica en mensaje con una llamada POST
  */
let myMessage = $("#contenedor-text").val();
$.post(urlAccess, {
  "text": `${myMessage}`
},
function() {
  console.log("Mensaje publicado");
  generateCards();
}
)
}
// BIND y llamada POST para publicar mensaje
$('#chat-button').click(sendMessage);

// BIND - obtener token y channel para abrir el chat
let submitButton = document.querySelector('#token-submit-button');
submitButton.addEventListener('click', function(){
  let token = document.querySelector('#token').value;
  let channel = document.querySelector('#channel').value;
  const urlAccess = `https://cors-anywhere.herokuapp.com/https://slack.com/api/conversations.history?token=${token}&channel=${channel}&pretty=1`;
  generateCards(urlAccess, token);
});

//BIND - Acción de upload las conversaciones
$('#update-button').click(generateCards);

// TODO - Insertar los links y las imágenes
/*<a href="${url}">${url}</a>
<img src="${image}" width="400px">*/
//
