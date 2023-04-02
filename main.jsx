"REQUIRE game.jsx";
"REQUIRE style.js";

const dom = document.createElement("div");
dom.className = "root";
const root = ReactDOM.createRoot(dom);
document.body.appendChild(dom);
root.render(<Game />);
