import { View, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

const windowWidth = Dimensions.get('window').width;

const FilterDropdown = ({ setFilter }) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('new');
    const [items, setItems] = useState([
        { label: 'New', value: 'new', icon: () => <Icon name='rocket-sharp' /> },
        { label: 'Hot', value: 'hot', icon: () => <Icon name='flame-outline' /> },
        { label: 'Top', value: 'top', icon: () => <Icon name='ribbon-sharp' /> }
    ]);
    return (
        <View style={{ justifyContent: "center", flexDirection: 'column', alignItems: "center", alignContent: "center", backgroundColor: "#F2F2F2", height: 30, bottom: 10, zIndex: 1000 }}>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                placeholder={value}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                onChangeValue={(selectedValue) => {
                    setValue(selectedValue);
                    setFilter(selectedValue);
                }}
                style={{ backgroundColor: "#F2F2F2", borderWidth: 0, width: windowWidth, borderRadius: 0 }}
                dropDownContainerStyle={{ width: windowWidth, borderWidth: 0 }}
                textStyle={{ textTransform: 'uppercase', fontSize: 15, fontWeight: '500' }}
                showTickIcon={false}
                arrowIconContainerStyle={{ marginRight: 250 }}
            />
        </View>
    );
};


export default FilterDropdown;