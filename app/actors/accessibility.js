
import {
  NativeModules,
  NativeEventEmitter,
} from 'react-native';

import { updateScreenReaderStatus } from '../actions/accessibility';

export default class AccessibilityActor {
  constructor(store) {
    this.dispatch = store.dispatch;

    this.AccessibilityManager = NativeModules.CMSAccessibilityManager;
    this.AccessibilityManagerObserver = new NativeEventEmitter(this.AccessibilityManager);

    const {
      screenReaderStatusChanged,
    } = this.AccessibilityManager.Events;

    this.AccessibilityManagerObserver.addListener(screenReaderStatusChanged, (body) => {
      this.dispatch(updateScreenReaderStatus(body.screenReaderStatus));
    });

    this.checkStatus();
  }

  killActor() {
    this.AccessibilityManagerObserver.removeEventListener();
  }

  async checkStatus() {
    try {
      const screenReaderStatus = await this.AccessibilityManager.screenReaderStatus();
      this.dispatch(updateScreenReaderStatus(screenReaderStatus[0]));
    } catch (e) {
      console.log(e);
    }
  }
}
