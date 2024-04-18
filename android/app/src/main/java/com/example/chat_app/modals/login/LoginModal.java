package com.example.chat_app.modals.login;

import androidx.annotation.Nullable;

import org.json.JSONException;
import org.json.JSONObject;

public class LoginModal {
    public String message;
    public boolean success;
    public int statusCode;
    @Nullable
    public Data data;

    LoginModal(JSONObject object) throws JSONException {
        this.message = object.getString("message");
        this.success = object.getBoolean("success");
        this.statusCode = object.getInt("statusCode");
        if (this.success)
            this.data = new Data(object.getJSONObject("data"));
    }

    public static LoginModal fromJson(String json) throws JSONException {
        JSONObject object = new JSONObject(json);
        return new LoginModal(object);
    }
}