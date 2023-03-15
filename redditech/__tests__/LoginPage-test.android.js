import * as React from "react";
import LoginPage from "../screen/LoginPage"
import renderer from "react-test-renderer";
import { RecoilRoot } from "recoil";
import { NavigationContainer } from "@react-navigation/native";
import { tokenAtom, settingsAtom } from "../helpers/UserState";


/*
//jest.useFakeTimers()
it(`renders correctly`, () => {
    const tree = renderer.create(<RecoilRoot><NavigationContainer><LoginPage/></NavigationContainer></RecoilRoot>);
    expect(tree).toMatchSnapshot();
});
*/
import App from '../App';

describe('<App />', () => {
    it('has 1 child', () => {
        const tree = renderer.create(<App />).toJSON();
        expect(tree.children.length).toBe(1);
    });
});
