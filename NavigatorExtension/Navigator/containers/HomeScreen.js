/**
 * Created by guopengwen on 16/11/1.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    Text,
} from 'react-native';
import { BaseComponent } from './component';
import FirstScreen from './FirstScreen';

const nextRoute = { screen: FirstScreen };


const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        marginTop: 64,
        backgroundColor: '#FFFFFF',
    },
    contentText: {
        fontSize: 18,
        color: '#4A4A4A',
        padding: 10,
    },
});

class HomeScreen extends BaseComponent {

    static propTypes = {
        route: React.PropTypes.object,
        navigator: React.PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.props.route.pageName = '首页';
        this.title = '首页';
        this.leftTitle = '欢迎';
        this.rightTitle = '下一页';
        this.rightRoute = nextRoute;
    }

    render() {
        return (
            <ScrollView style={styles.container} >
            </ScrollView>);
    }

    leftButtonAction(navigator) {

        alert(`非常欢迎了解和使用 !`);
    }

}

export default HomeScreen;
