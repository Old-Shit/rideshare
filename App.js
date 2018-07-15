import React, { Component } from 'react'
import { NavigatorIOS, View } from 'react-native'
import {
  apiKey,
  authDomain,
  databaseURL,
  messagingSenderId,
  projectId,
  storageBucket,
} from 'react-native-dotenv'
import * as firebase from 'firebase'

import Destination from './components/Destination'
import Login from './components/Login'
import PickupLocation from './components/PickupLocation'

import styles from './styles'

export default class App extends Component {
  constructor() {
    super()
    this.state = { layout: null }
  }

  componentWillMount() {
    firebase.initializeApp({
      apiKey,
      authDomain,
      databaseURL,
      messagingSenderId,
      projectId,
      storageBucket,
    })
  }

  onLayout = ({ nativeEvent: { layout } }) => {
    this.setState({ layout })
  }

  // renderScene = (route, navigator) => {
  //   const { layout } = this.state
  //   const props = {
  //     layout,
  //     route,
  //     navigator,
  //   }

  //   // console.log(props)
  //   Object.assign(props, route.passProps || {})

  //   switch (route.id) {
  //     case 'Login':
  //       return <Login {...props} />
  //     case 'PickupLocation':
  //       return <PickupLocation {...props} />
  //     case 'Destination':
  //       return <Destination {...props} />
  //     default:
  //       return null
  //   }
  // }

  render() {
    const { layout } = this.state
    return (
      <View onLayout={this.onLayout} style={styles.container}>
        {layout ? (
          <NavigatorIOS
            initialRoute={{ component: Login, passProps: { layout }, title: 'Login' }}
            // renderScene={this.renderScene}
            style={styles.navigator}
          />
        ) : null}
      </View>
    )
  }
}
