package com.citrus_sdk_sample;

import android.content.Context;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableNativeMap;
import com.facebook.react.bridge.Callback;

//import com.citrus.sdk.Callback;
import com.citrus.sdk.CitrusClient;
import com.citrus.sdk.TransactionResponse;
import com.citrus.sdk.classes.Amount;
import com.citrus.sdk.classes.CashoutInfo;
import com.citrus.sdk.classes.CitrusConfig;
import com.citrus.sdk.classes.CitrusException;
import com.citrus.sdk.payment.PaymentType;
import com.citrus.sdk.response.CitrusError;
import com.citrus.sdk.response.CitrusResponse;
import com.citrus.sdk.response.PaymentResponse;
import com.citrus.sdk.classes.LinkUserExtendedResponse;
import com.citrus.sdk.classes.LinkUserSignInType;
import com.citrus.sdk.classes.LinkUserPasswordType;
import com.citrus.sdk.classes.Amount;

import java.util.Map;
import java.util.HashMap;

public class CitrusSDKModule extends ReactContextBaseJavaModule {
    private CitrusClient citrusClient = null;
    private CitrusConfig citrusConfig = null;
    private Context mContext = null;
    private LinkUserExtendedResponse mlinkUserExtendedResponse = null;

    public CitrusSDKModule(ReactApplicationContext reactContext){
        super(reactContext);
        mContext = reactContext;
    }

    @Override
    public String getName(){
        return "CitrusSDK";
    }

    @Override
    public Map<String,Object> getConstants(){
        final Map<String, Object> constants = new HashMap<>();
        return constants;
    }

    @ReactMethod
    public void initializeCitrusClient(){
        citrusClient = CitrusClient.getInstance(mContext);
        citrusClient.enableLog(Constants.enableLogging);
        citrusClient.init(Constants.SIGNUP_ID, Constants.SIGNUP_SECRET, Constants.SIGNIN_ID, Constants.SIGNIN_SECRET, Constants.VANITY, Constants.environment);
        citrusClient.enableAutoOtpReading(true);
        citrusConfig = CitrusConfig.getInstance();
        citrusClient.enableLog(true);
    }

    @ReactMethod
    public void isUserSignedIn(final Callback success, final Callback failure){
        citrusClient.isUserSignedIn(new com.citrus.sdk.Callback<Boolean>() {
            @Override
            public void success(Boolean loggedIn) {
                success.invoke(loggedIn);
            }

            @Override
            public void error(CitrusError error) {
                failure.invoke(error.getMessage());
            }
        });
    }

    @ReactMethod
    public void linkUserExtended(ReadableMap args,final Callback success, final Callback failure){
        citrusClient.linkUserExtended("", "9164478258", new com.citrus.sdk.Callback<LinkUserExtendedResponse>(){
            @Override
            public void success(LinkUserExtendedResponse linkUserExtendedResponse) {
                // User Linked!
                mlinkUserExtendedResponse = linkUserExtendedResponse;
                success.invoke(linkUserExtendedResponse.getLinkUserSignInType().toString());
            }
            @Override
            public void error(CitrusError error) {
                // Error case
                failure.invoke(error.getMessage());
            }
        });
    }

    @ReactMethod
    public void signInUser(final String otp, final Callback success, final Callback failure){
        LinkUserSignInType linkUserSignInType = mlinkUserExtendedResponse.getLinkUserSignInType();
        LinkUserPasswordType linkUserPasswordType = LinkUserPasswordType.None;
        switch(linkUserSignInType){
            case SignInTypeMOtp :
                linkUserPasswordType = LinkUserPasswordType.Otp;
                citrusClient.linkUserExtendedSignIn(mlinkUserExtendedResponse, linkUserPasswordType, otp,
                        new com.citrus.sdk.Callback<CitrusResponse>(){
                            @Override
                            public void success(CitrusResponse citrusResponse) {
                                // User Signed In!
                                success.invoke("user signed in with otp : "+otp);
                            }
                            @Override
                            public void error(CitrusError error) {
                                // Error case
                                String errorMessasge = error.getMessage();
                                failure.invoke("otp is  "+otp);
                            }
                        });
                break;
            case None : success.invoke("signed in "); break;
        }
    }

    @ReactMethod
    public void getBalance(final Callback success,final Callback failure){
        citrusClient.getBalance(new com.citrus.sdk.Callback<Amount>() {
            @Override
            public void success(Amount amount) {
                success.invoke(amount.getValue());
            }

            @Override
            public void error(CitrusError error) {
                failure.invoke(error.getMessage());
            }
        });
    }

}