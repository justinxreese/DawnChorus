import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Platform } from 'react-native';

import Sound from 'react-native-sound';

import Root from './containers/root';
import configureStore from './store';

import NotificationActor from './actors/notifications';
import { loadAlarms } from './actions/alarm';

import AccessibilityActor from './actors/accessibility';

const store = configureStore();

async function loader() {
  await (store.dispatch(loadAlarms()));
  this.notificationActor = new NotificationActor(store);
  if (Platform.OS === 'ios') {
    this.accessibilityActor = new AccessibilityActor(store);
  }
  Sound.enableInSilenceMode(true);
  return;
}

class App extends Component {

  constructor(opts) {
    super(opts);
  }

  componentDidMount() {
    loader();
  }

  componentWillUnmount() {
    this.notificationActor.killActor();
    if (this.accessibilityActor) {
      this.accessibilityActor.killActor();
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}

export default App;
