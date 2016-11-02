/**
 * Created by guopengwen on 16/9/22.
 */

import React, { Component } from 'react';
import { DeviceEventEmitter, StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    leftButtonContainer: {
        flexDirection: 'row',
        paddingLeft: 10,
    },
    rightButtonContainer: {
        flexDirection: 'row',
        paddingRight: 10,
    },
    textPaddingTopAndBottom: {
        paddingTop: 14,
        paddingBottom: 16,
        textAlign: 'center',
        alignSelf: 'center',
    },
    rightText: {
        fontSize: 16,
        color: '#4A4A4A',
        marginLeft: 5,
        marginRight: 5,
        paddingTop: 12,
        paddingBottom: 12,
    },
    rightImage: {
        marginTop: 10,
        marginLeft: 4,
        marginBottom: 10,
        marginRight: 4,
        width: 24,
        height: 24,
    },
    titleText: {
        fontSize: 18,
        color: '#4A4A4A',
        paddingTop: 12,
        paddingBottom: 8,
        textAlign: 'center',
    },
    titleImage: {
        width: 133,
        height: 32,
    },
    backImage: {
        marginTop: 14,
        marginLeft: 10,
        marginBottom: 14,
        marginRight: 10,
        width: 10,
        height: 16,
    },
    backText: {
        marginLeft: 5,
        marginRight: 5,
        fontSize: 16,
        color: '#4A4A4A',
    },
    paddingRight: {
        paddingRight: 5,
    },
});

class BaseComponent extends Component {

    /* 设置navigatorBar时会用到的属性 */
    title = '';
    titleImage = '';
    leftTitle = '';
    leftImage = '';
    rightTitle = '';
    rightImage = '';
    rightArray = []; // image , title, route

    static propTypes = {
        route: React.PropTypes.object,
        navigator: React.PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.leftButton = this.leftButton.bind(this);
        this.rightButton = this.rightButton.bind(this);
        this.titleView = this.titleView.bind(this);
        if (props.route) {
            props.route.leftView = this.leftButton;
            props.route.rightView = this.rightButton;
            props.route.titleView = this.titleView;
            props.route.component = this;
        }
    }

    titleView(route, navigator) {
        let content = <View />;
        if (this.title) {
            content = <Text style={styles.titleText} >{this.title}</Text>;
        } else if (this.titleImage) {
            content = this.createImageWithImgAndStyle(this.titleImage, styles.titleImage);
        }
        return (
            <View style={styles.center}>
                {content}
            </View>
        );
    }

    leftButton(route, navigator) {
        let item = <View />;
        if (this.leftTitle) {
            item = <Text style={[styles.backText, styles.textPaddingTopAndBottom]} >{this.leftTitle}</Text>;
        } else if (this.leftImage) {
            item = this.createImageWithImgAndStyle(this.leftImage, styles.backImage);
        }
        return (
            <View style={[styles.leftButtonContainer, styles.center]}>
                <TouchableOpacity onPress={() => { this.leftTitle || this.leftImage ? this.leftButtonAction(navigator) : ''; }} >
                    {item}
                </TouchableOpacity>
            </View>
        );
    }

    rightButton(route, navigator) {
        if (this.rightArray.length === 0) {
            const item = { image: this.rightImage, title: this.rightTitle, route: this.rightRoute };
            this.rightArray.push(item);
        }
        const last = this.rightArray.length;
        const list = this.rightArray.map((p, i) => {
            const { image, title } = p;
            const padStyle = i === last - 1 ? { } : styles.paddingRight;
            let content = <View />;
            if (title) {
                content = <Text style={styles.rightText} >{title}</Text>;
            } else if (image) {
                content = this.createImageWithImgAndStyle(image, styles.rightImage);
            }
            return (
                <TouchableOpacity key={i} style={padStyle} onPress={() => { title || image ? this.rightButtonAction(navigator, i) : ''; }} >
                    {content}
                </TouchableOpacity>
            );
        });
        return (
            <View style={[styles.rightButtonContainer, styles.center]}>
                {list}
            </View>
        );
    }

    leftButtonAction(navigator) {
        if (navigator) {
            navigator.pop();
        }
    }

    rightButtonAction(navigator, index) {
        if (navigator) {
            if (this.rightArray.length) {
                const { route } = this.rightArray[index];
                if (route && route.screen) {
                    navigator.push(route);
                }
            }
        }
    }

    createImageWithImgAndStyle(img, imgStyle) {
        let imgSource = <View />;
        if (img) {
            const type = typeof this.img;
            if (type !== 'string') {
                imgSource = <Image source={img} style={imgStyle} resizeMode={'contain'} />;
            }
        }
        return imgSource;
    }

    pageIn() {

    }

    pageOut() {

    }
}

export default BaseComponent;
