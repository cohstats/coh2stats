const url = window.location.href;
const splitUrl = url.split("/");
const endpoint = splitUrl[0] + "//" + splitUrl[2];
console.log(endpoint);
// eslint-disable-next-line no-undef
const socket = io(endpoint);
socket.on("broadcast", (data) => {
  if (data.type === "reloadPage") {
    // eslint-disable-next-line no-restricted-globals
    location.reload();
    console.log("reload");
  }
});
