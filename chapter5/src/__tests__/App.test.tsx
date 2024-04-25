import { render, screen } from "@testing-library/react";
import App from "../App.tsx";
import WS from "jest-websocket-mock";

it("페이지가 제대로 뜨나요?", async () => {
  render(<App />);
  const buttonTest = await screen.findByRole("button");
  expect(buttonTest.textContent).toBe("test");
});

describe("업비트 ", () => {
  let server: WS;
  let client: WebSocket;
  beforeAll(async () => {
    server = new WS("ws://localhost:1234");
    client = new WebSocket("ws://localhost:1234");
    await new Promise((resolve) => (client.onopen = resolve));
  });

  afterEach(() => {
    WS.clean();
  });

  it("서버로 메시지를 보내고 응답을 받는다", async () => {
    client.send('[{"ticket":"test example"},{"type":"myTrade"}]');
    await expect(server).toReceiveMessage(
      '[{"ticket":"test example"},{"type":"myTrade"}]',
    );

    server.send('[{"ticket":"test example"},{"type":"myTrade"}]');
    const messagePromise = new Promise((resolve) => {
      client.onmessage = (event) => {
        resolve(event.data);
      };
    });

    server.send(
      `{type:ticker,code:KRW-BTC,opening_price:93518000.00000000,high_price:94319000.00000000,low_price:91701000.00000000,trade_price:92177000.00000000,prev_closing_price:93534000.00000000,acc_trade_price:195498217304.2664900000000000,change:FALL,change_price:1357000.00000000,signed_change_price:-1357000.00000000,change_rate:0.0145080933,signed_change_rate:-0.0145080933,ask_bid:BID,trade_volume:0.04280000,acc_trade_volume:2107.02758913,trade_date:20240425,trade_time:113737,trade_timestamp:1714045057249,acc_ask_volume:1250.63235651,acc_bid_volume:856.39523262,highest_52_week_price:105000000.00000000,highest_52_week_date:2024-03-14,lowest_52_week_price:32510000.00000000,lowest_52_week_date:2023-06-15,market_state:ACTIVE,is_trading_suspended:false,delisting_date:null,market_warning:NONE,timestamp:1714045057284,acc_trade_price_24h:422365331754.05733000,acc_trade_volume_24h:4518.06111732,stream_type:REALTIME}`,
    );
    const message = await messagePromise;
    expect(message).toBe(
      `{type:ticker,code:KRW-BTC,opening_price:93518000.00000000,high_price:94319000.00000000,low_price:91701000.00000000,trade_price:92177000.00000000,prev_closing_price:93534000.00000000,acc_trade_price:195498217304.2664900000000000,change:FALL,change_price:1357000.00000000,signed_change_price:-1357000.00000000,change_rate:0.0145080933,signed_change_rate:-0.0145080933,ask_bid:BID,trade_volume:0.04280000,acc_trade_volume:2107.02758913,trade_date:20240425,trade_time:113737,trade_timestamp:1714045057249,acc_ask_volume:1250.63235651,acc_bid_volume:856.39523262,highest_52_week_price:105000000.00000000,highest_52_week_date:2024-03-14,lowest_52_week_price:32510000.00000000,lowest_52_week_date:2023-06-15,market_state:ACTIVE,is_trading_suspended:false,delisting_date:null,market_warning:NONE,timestamp:1714045057284,acc_trade_price_24h:422365331754.05733000,acc_trade_volume_24h:4518.06111732,stream_type:REALTIME}`,
    );
  });
});
