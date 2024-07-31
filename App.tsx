import MyApp from './src';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <MyApp />
  </GestureHandlerRootView>
);  

export default App;