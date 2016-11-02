/**
 * Created by guopengwen on 16/11/1.
 */


import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    Image,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';

import { BaseComponent } from './component';
const backImage = require('./img/navigator_back.png');

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
    backView: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 12,
    },
    backText: {
        marginLeft: 5,
        marginRight: 5,
        fontSize: 16,
        color: '#4A4A4A',
    },

});

class SecondScreen extends BaseComponent {

    static propTypes = {
        route: React.PropTypes.object,
        navigator: React.PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.title = '热点';
        this.leftImage = backImage;
        this.leftButtonAction = this.leftButtonAction.bind(this);

    }

    render() {
        return (
            <ScrollView style={styles.container} >
            </ScrollView>);
    }

    leftButton(route, navigator) {
        return (
            <TouchableOpacity onPress={this.leftButtonAction} >
                <View style={styles.backView} >
                    <Image source={backImage} />
                    <Text style={styles.backText} >返回</Text>
                </View>
            </TouchableOpacity>
        );
    }
    leftButtonAction() {
        this.props.navigator.pop();
    }

}

export default SecondScreen;
