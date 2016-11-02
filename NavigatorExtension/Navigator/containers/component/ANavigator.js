/**
 * Created by peijingwu on 16/8/31.
 */

import React, { Component, PropTypes } from 'react';
import { StyleSheet, Navigator, BackAndroid, Platform, NativeModules, Dimensions, findNodeHandle, NativeAppEventEmitter, View } from 'react-native';
const NativeManagerModule = NativeModules.NativeManagerModule;
const { width } = Dimensions.get('window');

const NavigationBarRouteMapper = {
    // 左边Button
    LeftButton(route, navigator) {
        if (route.leftView) {
            return route.leftView(route, navigator);
        }
        return <View />;
    },
    // 右边Button
    RightButton(route, navigator) {
        if (route.rightView) {
            return route.rightView(route, navigator);
        }
        return <View />;
    },
    // 标题 route, navigator, index, navState
    Title(route, navigator) {
        if (route.titleView) {
            return route.titleView(route, navigator);
        }
        return <View />;
    },
};

class ANavigator extends Component {
    static propTypes = {
        initialRoute: PropTypes.object,
        navigationBar: PropTypes.object,
        configureScene: PropTypes.func,
        renderScene: PropTypes.func,
        tag: React.PropTypes.string,
        hideNavBar: PropTypes.bool,
    };

    static defaultProps = {
        hideNavBar: false,
    };

    // used for page event tracking
    lastPageIn;

    // the navigator object
    navigator;

    constructor(props) {
        super(props);
        this._renderScene = this._renderScene.bind(this);
        this._configureScene = this._configureScene.bind(this);
        this._onDidFocus = this._onDidFocus.bind(this);
        this.pageOut = this.pageOut.bind(this);
        this.pageIn = this.pageIn.bind(this);
        this.tag = props.tag;
        const self = this;

        this.pushHandler = NativeAppEventEmitter.addListener('_push_', (pageInfo) => {
            if (self.tag && pageInfo && self.tag === pageInfo.tag) {
                // push a native page, which means this navigator stops
                const tempPage = self.lastPageIn;
                self.pageOut();
                self.currentPage = tempPage;
            }
        });

        // the the page info contains the tag which is the vc's tag of the current navigator, mark the page as page in.
        this.popHandler = NativeAppEventEmitter.addListener('_pop_', (pageInfo) => {
            if (self.tag && pageInfo && self.tag === pageInfo.tag) {
                if (self.currentPage) {
                    self.pageIn(self.currentPage);
                }
            }
        });

        this.androidBackHandler = BackAndroid.addEventListener('hardwareBackPress', () => this.handleBackEvent());
    }

    componentWillUnmount() {
        this.pushHandler.remove();
        this.popHandler.remove();
        BackAndroid.removeEventListener('hardwareBackPress', this._handleBackEvent);
    }

    render() {
        return (
            <Navigator
                initialRoute={this.props.initialRoute}
                navigationBar={this._navigationBar()}
                renderScene={this._renderScene}
                configureScene={this._configureScene}
                onDidFocus={this._onDidFocus}
            />
        );
    }

    /* hideNavBar 表示是否隐藏navigationBar,默认不隐藏 */
    _navigationBar() {
        if (this.props.hideNavBar) {
            return undefined;
        }
        if (this.props.navigationBar) {
            return this.props.navigationBar;
        }
        return (
            <Navigator.NavigationBar
                routeMapper={NavigationBarRouteMapper}
                style={styles.navBar}
            />
        );
    }

    _renderScene(route, navigator) {
        this.navigator = navigator;
        this.overrideNavigatorMethod(navigator);
        return this.renderScene(route, navigator);
    }

    renderScene(route, navigator) {
        if (this.props.renderScene) {
            return this.props.renderScene(route, navigator);
        }
        let Screen = route.screen;
        route.props = route.props || {};
        return (
            <Screen
                navigator={navigator}
                route={route}
                {...route.props}
            />
        );
    }

    _configureScene(route) {
        // route can have SceneConfigs, or pass configureScene from outside.
        const customizedConfig = route.SceneConfigs || this.props.configureScene;
        if (customizedConfig) {
            return customizedConfig;
        }
        return this.configureScene();
    }

    configureScene() {
        const sceneConfigs = ANavigator.configLeftToRightPopRange(0.5);
        return sceneConfigs;
    }

    handlePageEventTracking(route) {
        const pageName = route.pageName || route.title || 'not specified';
        // handle page in/out
        this.pageOut(route);
        this.pageIn(pageName, route);
    }

    /*
     *  该方法目前只支持iOS, 用于处理左滑返回中的 native 和 RN 中的手势冲突问题
     * */
    handleLeftPanGesture(navigator) {
        if (Platform.OS !== 'android') {
            const routes = navigator.getCurrentRoutes();
            const len = routes.length;

            // open native LefToRight Gesture
            NativeManagerModule && NativeManagerModule.configNativeLeftToRightGesture(
                    findNodeHandle(navigator),
                    len === 1
                );
        }
    }

    _onDidFocus(route) {
        this.handlePageEventTracking(route);
        this.handleLeftPanGesture(this.navigator);
    }

    /*
     *   该方法目前只支持iOS, 用于改变左滑返回时的手势响应区域
     *   range 决定滑动范围[0, 1]
     * */
    static configLeftToRightPopRange(range) {
        if (Platform.OS !== 'android') {
            let edgeHitWidth = 0.5 * width;
            if (range >= 0 && range <= 1) {
                edgeHitWidth = range * width;
            }
            const pushFromRight = Navigator.SceneConfigs.PushFromRight;
            pushFromRight.gestures.pop.edgeHitWidth = edgeHitWidth;
            return pushFromRight;
        }
        return { ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: {} };
    }

    pageOut(route) {
        if (this.lastPageIn) {
            // pop
            NativeManagerModule && NativeManagerModule.onPageEnd(this.lastPageIn);
            this.lastPageIn = undefined;
        }
        this.currentPage = undefined;
        if (route && route.component && route.component.pageOut) {
            route.component.pageOut();
        }
    }

    pageIn(pageName, route) {
        this.lastPageIn = pageName;
        NativeManagerModule && NativeManagerModule.onPageStart(pageName);
        if (route && route.component && route.component.pageIn) {
            route.component.pageIn();
        }
    }

    popLastPage() {
        if (Platform.OS === 'android') {
            BackAndroid.exitApp();
        } else if (Platform.OS === 'ios') {
            NativeManagerModule && NativeManagerModule.popViewControllerAnimated(true);
        }
    }

    overrideNavigatorMethod(navigator) {
        if (navigator.overrideMethod) {
           return;
        }
        const { pop } = navigator;
        navigator.pop = () => {
            const length = navigator.getCurrentRoutes().length;
            if (length > 1) {
                pop.apply(this);
            } else {
                this.popLastPage();
            }
        };
        navigator.overrideMethod = true;
    }

    handleBackEvent() {
        this.navigator.pop();
        return true;
    }
}

const styles = StyleSheet.create({
    navBar: {
        backgroundColor: 'rgb(129,192,77)',
    },
});

export default ANavigator;
