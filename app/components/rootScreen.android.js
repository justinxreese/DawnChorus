import React, { Component, PropTypes } from 'react';

import * as Animatable from 'react-native-animatable';

import {
  StyleSheet,
  View,
  Image,
  Alert,
  Text,
  Dimensions,
  StatusBar,
  ViewPagerAndroid,
} from 'react-native';

import TabBar from './tabBar';
import NavBar from './navBar';
import Fab from './fab';

import AboutBirds from '../containers/aboutBirds';
import AlarmList from '../containers/alarmList';
import EditAlarm from '../containers/editAlarm';
import Alarm from '../containers/alarm';
import InfoCards from '../containers/infoCards';

import {
  ABOUT_THE_BIRDS_SCREEN,
  ALARM_LIST_SCREEN,
  EDIT_ALARM_SCREEN,
  NEW_ALARM_SCREEN,
  ALARM_SCREEN,
  INFO_CARDS_SCREEN,
} from '../actions/navigator';

import {
  NOTIFICATION_PERMISSIONS_STATUS_AUTHORIZED,
  NOTIFICATION_PERMISSIONS_STATUS_NOTDETERMINED,
} from '../actions/notifications';

import { OFFWHITE, OFFBLACK, OFFBLACKTRANSPARENT, OFFWHITETRANSPARENT, DARKGREEN, YELLOW, RED } from './../styles.js';

const styles = StyleSheet.create({
  navTitleText: {
    color: OFFBLACK,
    fontFamily: 'SourceSerifPro',
    fontSize: 20,
    textAlign: 'center',
  },
  navBar: {
    backgroundColor: OFFWHITE,
    borderBottomWidth: 1,
    borderBottomColor: YELLOW,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButtonText: {
    color: DARKGREEN,
    fontFamily: 'SourceSerifPro-Regular',
    fontSize: 17,
  },
  navButtonImage: {
    tintColor: DARKGREEN,
    width: 20,
    height: 20,
  },
  actionButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  actionButtonImage: {
    width: 70,
    height: 70,
  },
  viewPager: {
    flex: 1,
  },
  fullScreen: {
    backgroundColor: OFFWHITETRANSPARENT,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

class RootScreen extends Component {

  static propTypes = {
    navigator: PropTypes.object.isRequired,
    notificationPermission: PropTypes.string.isRequired,
    activeAlarm: PropTypes.object,
    editAlarm: PropTypes.object,
    loaded: PropTypes.bool,
    actions: PropTypes.shape({
      navigatorPush: PropTypes.func.isRequired,
      navigatorPop: PropTypes.func.isRequired,
      newAlarm: PropTypes.func.isRequired,
      deleteAlarm: PropTypes.func.isRequired,
      saveAlarm: PropTypes.func.isRequired,
      closeInfoCards: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    page: 0,
    progress: {
      position: 0,
      offset: 0,
    },
  };

  onPageScroll = (e) => {
    this.setState({ progress: e.nativeEvent });
    if (e.nativeEvent.offset === 0) {
      if (e.nativeEvent.position === 0 && this.props.navigator.routes[this.props.navigator.index].key === 'ABOUT_THE_BIRDS_SCREEN') {
        this.props.actions.navigatorPop();
      } else if (e.nativeEvent.position === 1 && this.props.navigator.routes[this.props.navigator.index].key === 'ALARM_LIST_SCREEN') {
        this.props.actions.navigatorPush(ABOUT_THE_BIRDS_SCREEN);
      }
      this.setState({ page: e.nativeEvent.position });
    } else if (this.state.page === 0) {
      this.props.actions.navigatorPush(ABOUT_THE_BIRDS_SCREEN);
    } else if (this.state.page === 1) {
      this.props.actions.navigatorPop();
    }
  };

  go = (page) => { this.viewPager.setPage(page); };

  render() {
    const { width } = Dimensions.get('window');

    const sceneKey = this.props.navigator.routes[this.props.navigator.index].key;
    const prevSceneKey = this.props.navigator.index > 0 ?
                         this.props.navigator.routes[this.props.navigator.index - 1].key :
                         null;

    return (
      <View style={{ flex: 1, backgroundColor: OFFWHITE }} >
        <StatusBar
          backgroundColor={OFFWHITE}
          barStyle="dark-content"
        />

        {/** *** TAB VIEW *** **/}
        <TabBar
          tabStyle={{ height: 60 }}
          underlineStyle={{ backgroundColor: YELLOW }}
          backgroundColor={OFFWHITE}
          activeTextColor={OFFBLACK}
          inactiveTextColor={OFFBLACKTRANSPARENT}
          textStyle={styles.navTitleText}
          goToPage={(page) => { this.go(page); }}
          activeTab={this.state.page}
          tabs={['Alarms', 'Birds']}
          scrollValue={this.state.progress}
          containerWidth={width}
          visible={sceneKey === ALARM_LIST_SCREEN || sceneKey === ABOUT_THE_BIRDS_SCREEN}
        />
        <ViewPagerAndroid
          importantForAccessibility="no"
          style={styles.viewPager}
          initialPage={0}
          scrollEnabled={true}
          onPageScroll={this.onPageScroll}
          pageMargin={0}
          ref={(viewPager) => { this.viewPager = viewPager; }}
        >
          <View
            tabLabel="Alarms"
            style={{ flex: 1 }}
            importantForAccessibility={sceneKey === ALARM_LIST_SCREEN ? 'yes' : 'no-hide-descendants'}
          >
            <AlarmList />
          </View>
          <View
            importantForAccessibility={sceneKey === ABOUT_THE_BIRDS_SCREEN ? 'yes' : 'no-hide-descendants'}
            tabLabel="Birds"
            style={{ flex: 1 }}
          >
            <AboutBirds />
          </View>
        </ViewPagerAndroid>

        { /* New Alarm FAB (On Alarm List Screen) */ }
        {this.props.loaded &&
        this.props.notificationPermission !== NOTIFICATION_PERMISSIONS_STATUS_NOTDETERMINED &&
        <Fab
          color={OFFBLACK}
          onPress={() => { this.props.actions.newAlarm(); }}
          image={require('../assets/NewAlarmButton.png')}
          accessibilityLabel={'New Alarm. Button.'}
          position={{ position: 'absolute', bottom: 30, right: 30 }}
          enabled={sceneKey === ALARM_LIST_SCREEN &&
                   this.props.notificationPermission === NOTIFICATION_PERMISSIONS_STATUS_AUTHORIZED}
        />
        }

        {/** *** MODALS *** **/}
        { /** New Alarm Modal **/}
        {sceneKey === NEW_ALARM_SCREEN &&
          <Animatable.View
            animation="fadeIn"
            easing="ease-out"
            duration={200}
            style={styles.fullScreen}
          >
            <NavBar
              style={styles.navBar}
              navTitle={'New Alarm'}
              leftButton={(<Image
                style={[styles.navButtonImage, { height: 20, width: 20 }]}
                source={require('../assets/CancelButton.png')}
              />)}
              leftPress={() => { this.props.actions.navigatorPop(); }}
            />
            <EditAlarm />
          </Animatable.View>
        }

        { /** Edit Alarm Modal **/}
        {sceneKey === EDIT_ALARM_SCREEN &&
          <Animatable.View
            animation="fadeIn"
            easing="ease-out"
            duration={200}
            style={styles.fullScreen}
          >
            <NavBar
              style={styles.navBar}
              navTitle={'Edit Alarm'}
              leftButton={(<Image
                style={[styles.navButtonImage, { height: 20, width: 20 }]}
                source={require('../assets/CancelButton.png')}
              />)}
              leftPress={() => { this.props.actions.navigatorPop(); }}
              rightButton={(
                <Text style={[styles.navButtonText, { color: RED }]}>
                  Delete
                </Text>
              )}
              rightPress={() => {
                Alert.alert(
                  'Delete Alarm',
                  'Are you sure you want to delete this alarm?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', onPress: () => this.props.actions.deleteAlarm(this.props.editAlarm.uuid), style: 'destructive' },
                  ],
                );
              }}
            />
            <EditAlarm />
          </Animatable.View>
        }

        { /** Alarm Modal **/}
        {(sceneKey === ALARM_SCREEN ||
          (prevSceneKey === ALARM_SCREEN &&
           sceneKey === INFO_CARDS_SCREEN)
          ) &&
            <Animatable.View
              animation="fadeIn"
              easing="ease-out"
              duration={200}
              style={styles.fullScreen}
            >
              <Alarm />
            </Animatable.View>
        }

        { /** Info Cards Modal **/}
        {sceneKey === INFO_CARDS_SCREEN &&
          <Animatable.View
            animation="fadeIn"
            easing="ease-out"
            duration={200}
            style={styles.fullScreen}
          >
            <InfoCards />
          </Animatable.View>
        }

      </View>
    );
  }

}

export default RootScreen;
