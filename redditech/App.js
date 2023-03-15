import * as React from "react";
import * as WebBrowser from "expo-web-browser";

//* ------- Components ------- *//
import Route from "./routes";

//* ------- Recoil ------- *//
import { RecoilRoot } from "recoil";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  // removeToken("secure_token");
  return (
    <RecoilRoot>
      <Route />
    </RecoilRoot>
  );
}
