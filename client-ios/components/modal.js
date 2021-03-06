// @flow

import React, { Component } from "react";
import {
  TouchableWithoutFeedback,
  ActivityIndicatorIOS,
  Text,
  View,
  Modal,
  Image,
  Linking,
  TouchableOpacity,
  NativeAppEventEmitter,
  AlertIOS
} from 'react-native';
import RNCalendarReminders from 'react-native-calendar-reminders';
import DatePicker from './datePicker.js';
import styles from '../styles/styles.js'

export default class SingleListScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    RNCalendarReminders.authorizeEventStore((error, auth) => {
        console.log('authorizing EventStore...');
    });
  }

  handleClick() {
  Linking.canOpenURL(this.props.modal.item.url)
    .then(supported => {
      if (supported) {
        Linking.openURL(this.props.modal.item.url);
      } else {
        Linking.openURL(`https://www.google.com/#q=${this.props.modal.item.title}`);
      }
    });
  }

  addToReminders() {
    var date = this.props.date;
    var item = this.props.modal.item.title;

    RNCalendarReminders.saveReminder(item, {
      dueDate: date.toISOString(),
      alarms: [{
        date: -1 // or absolute date
      }],
      recurrence: 'daily'
    });
    AlertIOS.alert(item + ' is added to Reminders');
  }

  render() {
    const {
      modal,
      pressHandler,
      toggler,
      deleteConfirm,
      deleteConfirmOn,
      deleteConfirmOff,
      dateChange,
      date
    } = this.props;
    let categoryOption = {
      "WATCH" : 'Rotten Tomatoes',
      "LISTEN" : 'Spotify',
      "READ" : 'Amazon',
      "EAT" : 'Yelp',
      "BUY" : 'Amazon'
    }
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modal.isOpen}
        onRequestClose={() => {toggler(false)}}
      >
        <TouchableWithoutFeedback
          onPress={deleteConfirmOff}
        >
          <View style={[styles.container, styles.modalBackground]}>
            <View style={styles.innerContainer}>
              {modal.item.category === 'DO' ?
                <DatePicker
                  date={date}
                  dateChange={dateChange}
                />
                  : <Image
                    style={this.props.filter === "LISTEN" ? styles.modalMuiscImage : styles.modalImage}
                    source={{uri: modal.item.img}}
                    />
              }
              <Text style={styles.innerContainerText}>
                {modal.item.content}
              </Text>
              {modal.item.category === 'DO' ?
                <TouchableOpacity
                  onPress={this.addToReminders.bind(this)}>
                  <View style={styles.modalButton}>
                    <Text style={styles.buttonText}>Add to Reminders</Text>
                  </View>
                </TouchableOpacity>
                  : <TouchableOpacity
                    onPress={this.handleClick.bind(this)}>
                    <View style={styles.modalButton}>
                      <Text style={styles.buttonText}>Open in {categoryOption[modal.item.category]}</Text>
                    </View>
                  </TouchableOpacity>
              }
              <TouchableOpacity
                style={styles.modalButton}
                onPress={toggler.bind(null, false)}
                underlayColor='black'
              >
                <Text style={styles.buttonText}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}
