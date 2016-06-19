package com.citrus_sdk_sample;

import com.citrus.sdk.Environment;

/**
 * Created by salil on 13/6/15.
 */
public interface Constants {

    String BILL_URL = "https://salty-plateau-1529.herokuapp.com/billGenerator.sandbox.php";
    String RETURN_URL_LOAD_MONEY = "https://salty-plateau-1529.herokuapp.com/redirectUrlLoadCash.php";

    String SIGNUP_ID = "test-signup";
    String SIGNUP_SECRET = "c78ec84e389814a05d3ae46546d16d2e";
    String SIGNIN_ID = "test-signin";
    String SIGNIN_SECRET = "52f7e15efd4208cf5345dd554443fd99";
    String VANITY = "nativeSDK";
    Environment environment = Environment.SANDBOX;

    boolean enableLogging = true;

    String colorPrimaryDark = "#E7961D";
    String colorPrimary = "#F9A323";
    String textColor = "#ffffff";
}