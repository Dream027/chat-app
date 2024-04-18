package com.example.chat_app.modals.login;

import org.json.JSONException;
import org.json.JSONObject;

public class Data {
    public String token;
    public User user;

    Data(JSONObject object) throws JSONException {
        this.token = object.getString("token");
        this.user = new User(object.getJSONObject("user"));
    }
}
