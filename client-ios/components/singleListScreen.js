// @flow

import React, { Component } from "react";
import {
  TouchableHighlight,
  ActivityIndicatorIOS,
  StyleSheet,
  ListView,
  Text,
  View
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import Footer from './footer.js';
import ListItem from './listItem.js';
import styles from '../styles/styles.js'

export default class SingleListScreen extends Component {

  constructor(props) {
    super(props);

  }

  componentWillMount() {
    this.props.fetchUserSingleList();
  }

  renderItem(item) {
    return (
      <TouchableHighlight
        onLongPress={() => {this.props.deleteListItem(item)}}
      >
        <View>
          <ListItem itemTitle={ item.title } itemContent={ item.content } />
          <View style={ styles.separator } />
        </View>
      </TouchableHighlight>
    );
    }

  render() {
    const { lists, dataSource, isLoading } = this.props

//use this logic once client needs to fetch list from server over network
    // if(isLoading){
    //   return (
    //     <View style={styles.loading}>
    //       <ActivityIndicatorIOS
    //           size='large'/>
    //       <Text>
    //         Loading your list...
    //       </Text>
    //     </View>
    //   );
    // } else {
      return (
        <View style={styles.container}>
          <ListView
              dataSource={this.props.dataSource}
              renderRow={this.renderItem.bind(this)}
              style={styles.listView}
            />
          <View style={styles.container}>
            <Footer />
          </View>
        </View>
      );
    // }
  }
}
