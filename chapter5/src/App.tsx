import "./App.css";

function App() {
  //
  const ws = new WebSocket("wss://api.upbit.com/websocket/v1");

  ws.onopen = () => {
    ws.send(
      JSON.stringify([
        { ticket: "test" },
        { type: "ticker", codes: ["KRW-BTC"] },
        { format: "DEFAULT" },
      ]),
    );
  };

  ws.onmessage = async (event) => {
    if (event.data instanceof Blob) {
      const reader = new FileReader();
      reader.onload = function () {
        console.log(reader.result);
      };
      reader.readAsText(event.data);
    }
  };

  return (
    <>
      <button>test</button>
    </>
  );
}

export default App;
