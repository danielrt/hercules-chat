import { Preferences } from '@capacitor/preferences';

export const setLogin = async (user, password) => {
    await Preferences.set({
        key: 'user',
        value: user,
    });
    await Preferences.set({
        key: 'password',
        value: password,
    });
};
  
export const getUser = async () => {
    const login = await Preferences.get({ key: 'user' });
    return login.value;
};

export const getPassword = async () => {
    const password = await Preferences.get({ key: 'password' });
    return password.value;
};
  
export const logout = async () => {
    await Preferences.remove({ key: 'user' });
    await Preferences.remove({ key: 'password' });
};

export const setHerculesAddress = async (address) => {
    await Preferences.set({
        key: 'hercules_ip',
        value: address,
    });
};
  
export const getHerculesAddress = async () => {
    const ip = await Preferences.get({ key: 'hercules_ip' });
    console.log(ip);
    return ip.value;
};
