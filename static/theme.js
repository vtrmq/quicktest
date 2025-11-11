const theme = localStorage.getItem("theme");
const elementHTML = document.querySelector("html");
if (theme && elementHTML) {
  elementHTML.classList.add('dark');
}
