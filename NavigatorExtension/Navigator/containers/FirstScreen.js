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
import SecondScreen from './SecondScreen';

const backImage = require('./img/navigator_back.png');
const rightArr = [{ title: '热点' }, { title: '提示' },];

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
        margin: 20,
    },


});

class FirstScreen extends BaseComponent {

    static propTypes = {
        route: React.PropTypes.object,
        navigator: React.PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.props.route.pageName = '新闻';
        this.title = '新闻';
        this.leftImage = backImage;
        this.rightArray = rightArr;
    }

    render() {
        return (
            <ScrollView style={styles.container} >
            </ScrollView>);
    }

    rightButtonAction(navigator, index) {
        if (index === 0) {
            this.props.navigator.push({ screen: SecondScreen });
        } else {
            alert('index=1');
        }
    }

}

export default FirstScreen;
