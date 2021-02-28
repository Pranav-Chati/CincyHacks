import { registerRootComponent } from 'expo';

//import App from './App';
import Home from './AppFiles/Home'
import Login from './AppFiles/Login'
import Food from './AppFiles/Food'

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(Login);
