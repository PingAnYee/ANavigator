/**
 * Created by guopengwen on 16/11/1.
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { BaseComponent, ANavigator } from './containers/component';
import HomeScreen from './containers/HomeScreen';

class TestNavigator extends BaseComponent {

    render() {
        const route = { screen: HomeScreen, props: this.props };
        return (
            <ANavigator
                initialRoute={route}
                hideNavBar={false}
            />);
    }
}

AppRegistry.registerComponent('TestNavigator', () => TestNavigator);

export default TestNavigator;
