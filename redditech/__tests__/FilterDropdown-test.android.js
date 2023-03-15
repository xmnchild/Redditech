import * as React from "react";
import renderer from "react-test-renderer";
import FilterDropdown from '../components/FilterDropdown';

jest.mock('react-native-vector-icons');
jest.mock('react-native-dropdown-picker');
it(`renders correctly`, () => {
    const tree = renderer.create(<FilterDropdown/>);
    expect(tree).toMatchSnapshot();
});
