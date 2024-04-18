package com.example.chat_app.modals.login;

import org.json.JSONException;
import org.json.JSONObject;

public class User {
    public String id;
    public String name;
    public String email;
    public String image;

    User(JSONObject object) throws JSONException {
        this.id = object.getString("_id");
        this.name = object.getString("name");
        this.email = object.getString("email");
        this.image = object.getString("image");
    }
}
