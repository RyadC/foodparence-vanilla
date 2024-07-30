const el_Body = document.querySelector("body");
const el_BurgerButton = document.querySelector(".burger-icon");
const el_BoutonArrow = document.querySelector(".arrow-icon");
const el_OverlayDiv = document.querySelector(".overlay");
const el_BurgerMenu = document.querySelector(".div-menu-burger");

// On burger menbu click
el_BurgerButton.addEventListener("click", function (e) {
  el_BurgerMenu.classList.remove("disabled");
  setTimeout(() => {
    el_OverlayDiv.classList.add("darken");
    el_Body.classList.add("overflow-stop");
    el_BurgerMenu.classList.add("display-burgerMenu");
  }, 100);
});

// On back arrow click
el_BoutonArrow.addEventListener("click", function (e) {
  el_BurgerMenu.classList.remove("display-burgerMenu");
  el_OverlayDiv.classList.remove("darken");
  setTimeout(() => {
    el_Body.classList.remove("overflow-stop");
    el_BurgerMenu.classList.add("disabled");
  }, 700);
});

// On screen click
el_OverlayDiv.addEventListener("click", function (e) {
  el_BurgerMenu.classList.remove("display-burgerMenu");
  el_OverlayDiv.classList.remove("darken");
  el_Body.classList.remove("overflow-stop");
});
