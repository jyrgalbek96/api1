var initialization = {
  data: '',

  "counter-posts": {
    start: 0,
    finish: 20
  }
};

$(document).ready(function() {
  getData("https://jsonplaceholder.typicode.com/photos");

  setTimeout(function() {
    getPost(initialization["counter-posts"]["start"], checkCounter());
    getCountRecords();
  }, 2000);

  $(".pagination__button:eq(0)").on("click", previousPosts);
  $(".pagination__button:eq(1)").on("click", nextPosts);
  $(".overlap:eq(0)").on("click", closeModalWindow);
});

/* ---------- Функция для получения данных с API ---------- */

function getData(url) {
  fetch(url)
    .then(function(response) {
      if (response.status !== 200) {
        console.log(
          "Looks like there was a problem. Status Code: " + response.status
        );
        return;
      }

      response.json().then(function(data) {
        initialization["data"] = data;
      });
    })
    .catch(function(err) {
      console.log("Fetch Error :-S", err);
    });
}

/* ---------- Функция для заполнения контента постами ---------- */

function getPost(start, finish) {
  let out = "";

  for (let i = start; i < finish; i++) {
    out +=
      '<article class="box-post" data-id="' +
      initialization["data"][i]["id"] +
      '">';
    out +=
      '<img class="box-post__img" src="' +
      initialization["data"][i]["url"] +
      '">';
    out +=
      '<div class="box-post__title">' +
      initialization["data"][i]["title"] +
      "</div>";
    out +=
      '<div class="box-post__album">Album: ' +
      initialization["data"][i]["albumId"] +
      "</div>";
    out += "</article>";
  }

  $(".container-post:eq(0)").append(out);
  $(".box-post").on("click", showModalWindow);
}

/* ---------- Функция считывания количество постов на странице ---------- */

function getCountRecords() {
  let count = $(".box-post").length;

  $(".counter-post__counter").text(count);
  return count;
}

function clearContent() {
  $(".container-post:eq(0)").html("");
}

/* ---------- Функция для проверки количество свойств в данных (API) ---------- */

function checkCounter() {
  if (initialization["data"].length > 20) {
    $(".pagination__button:eq(1)").css("display", "block");
    return initialization["counter-posts"]["finish"];
  } else {
    return initialization["data"].length;
  }
}

/* ---------- Функция проверяет - загрузить след. +20 постов или же только остаток постов, если остаток составляет меньше 20 ---------- */

function checkCounterFinish() {
  if (
    initialization["counter-posts"]["finish"] + 20 >
    initialization["data"].length
  ) {
    return initialization["data"].length;
  } else {
    return initialization["counter-posts"]["finish"] + 20;
  }
}

/* ---------- Функция для загрузки след. 20 постов ---------- */

function nextPosts() {
  let start = (initialization["counter-posts"]["start"] =
    initialization["counter-posts"]["finish"]);
  let finish = (initialization["counter-posts"][
    "finish"
  ] = checkCounterFinish());

  checkCounterPosts("next", finish);
  clearContent();
  getPost(start, finish);
  getCountRecords();
}

/* ---------- Функция для загрузки пред. 20 постов ---------- */

function previousPosts() {
  let finish = (initialization["counter-posts"]["finish"] =
    initialization["counter-posts"]["start"]);
  let start = (initialization["counter-posts"]["start"] =
    initialization["counter-posts"]["start"] - 20);

  checkCounterPosts("previous", start);
  clearContent();
  getPost(start, finish);
  getCountRecords();
}

/* ---------- Функция скрытия/показа кнопки(ок) перелистывания ---------- */

function checkCounterPosts(name, counter) {
  switch (name) {
    case "previous":
      $(".pagination__button:eq(1)").css("display", "block");

      if (counter == 0) {
        $(".pagination__button:eq(0)").css("display", "none");
      }
      break;

    case "next":
      $(".pagination__button:eq(0)").css("display", "block");

      if (counter == initialization["data"].length) {
        $(".pagination__button:eq(1)").css("display", "none");
      } else {
        $(".pagination__button:eq(1)").css("display", "block");
      }
      break;
  }
}

/* ---------- Функция показа модального окна ---------- */

function showModalWindow() {
  $(".overlap:eq(0)").css("display", "block");

  let out = "";
  let id = $(this).data("id");

  data = findPropertyInData(id);

  out += '<span class="modal-window__close">&#10008;</span>';
  out += '<article class="modal-container" style="clear: both;">';
  out += '<div class="modal-container__box">';
  out += '<img class="modal-container__img" src="' + data["url"] + '">';
  out += "</div>";
  out += '<div class="modal-container__title">' + data["title"] + "</div>";
  out +=
    '<div class="modal-container__album">Album: ' + data["albumId"] + "</div>";
  out += "</article>";

  $(".modal-window").html(out);
  $(".modal-window__close:eq(0)").on("click", closeModalWindow);
}

/* ---------- Функция для поиска элемента в данных(API) по id ---------- */

function findPropertyInData(id) {
  for (let i = 0; i < initialization["data"].length; i++) {
    if (initialization["data"][i]["id"] == +id) {
      return initialization["data"][i];
    }
  }
}

/* ---------- Функция для закрытия модального окна ---------- */

function closeModalWindow() {
  $(".overlap").css("display", "none");
}

/* ---------- Функция для прелоадера ---------- */

var hellopreloader = $("#hellopreloader_preload");

function fadeOutnojquery(el) {
  el.css("opacity", "1");

  var interhellopreloader = setInterval(function() {
    el.css("opacity", el.css("opacity") - 0.05 );
    if (el.css("opacity") <= 0.05) {
      clearInterval(interhellopreloader);
      hellopreloader.css("display", "none");
    }
  }, 16);
}

window.onload = function() {
  setTimeout(function() {
    fadeOutnojquery(hellopreloader);
  }, 3000);
};
