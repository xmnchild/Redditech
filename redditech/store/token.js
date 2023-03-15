import * as SecureStore from "expo-secure-store";

const setToken = (token) => {
  return SecureStore.setItemAsync("secure_token", token);
};

const getToken = async () => {
  try {
    const result = await SecureStore.getItemAsync("secure_token");
    return result;
  } catch (error) {
    return null;
  }
};

const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync("secure_token");
  } catch (error) {
    console.log(error);
  }
};

export { setToken, getToken, removeToken };
