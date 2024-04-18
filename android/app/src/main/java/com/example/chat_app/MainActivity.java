package com.example.chat_app;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        SharedPreferences prefs = getSharedPreferences("user", MODE_PRIVATE);

        if (prefs.getString("token", "").equals("")) {
            startActivity(new Intent(this, RegisterActivity.class));
        } else {
            startActivity(new Intent(this, HomeActivity.class));
        }
    }
}