function main() {
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault(); 
    connexion();
  });
  const iconeOeil = document.querySelector(".fa-eye");
  iconeOeil.addEventListener("click", visionMotDePasse);
}

function visionMotDePasse(e) {
  e.target.classList.toggle("fa-eye-slash");
  e.target.classList.toggle("fa-eye");

  const input = e.target.parentNode.querySelector("input");

  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}

function fForm(e) {
  e.preventDefault();
}

main();
