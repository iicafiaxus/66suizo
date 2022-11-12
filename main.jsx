"REQUIRE game.jsx";
"REQUIRE util.jsx";

const dom = document.createElement("div");
const root = ReactDOM.createRoot(dom);
document.body.appendChild(dom);
root.render(<Game />);
