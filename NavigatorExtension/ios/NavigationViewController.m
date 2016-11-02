//
//  NavigationViewController.m
//  NavigatorExtenSion
//
//  Created by guopengwen on 16/11/1.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "NavigationViewController.h"
#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"
#import "RCTBridge.h"

@interface NavigationViewController ()<RCTBridgeDelegate>

@end

@implementation NavigationViewController
- (void)loadView{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:nil];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"NavigatorExtension" initialProperties:nil];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  self.view = rootView;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  NSURL *sourceURL = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  
  sourceURL = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
  return sourceURL;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
