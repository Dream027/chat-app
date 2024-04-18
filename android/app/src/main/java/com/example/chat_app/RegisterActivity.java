package com.example.chat_app;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.AppCompatButton;
import androidx.appcompat.widget.AppCompatEditText;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;

import com.example.chat_app.modals.login.LoginModal;

import org.json.JSONException;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class RegisterActivity extends AppCompatActivity {

    OkHttpClient client = new OkHttpClient();
    AppCompatEditText name, email, password;
    AppCompatButton btn, btn_login;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        name = findViewById(R.id.register_name);
        email = findViewById(R.id.register_email);
        password = findViewById(R.id.register_password);
        btn = findViewById(R.id.register_button);
        btn_login = findViewById(R.id.register_loginButton);

        btn_login.setOnClickListener(
                v -> {
                    Intent intent = new Intent(RegisterActivity.this, LoginActivity.class);
                    startActivity(intent);
                }
        );

        btn.setOnClickListener(
            v -> {
                String nameText = name.getText().toString();
                String emailText = email.getText().toString();
                String passwordText = password.getText().toString();

                RequestBody body = RequestBody.create(
                        MediaType.parse("application/json"),
                        "{\"name\":\"" + nameText + "\",\"email\":\"" + emailText + "\",\"password\":\"" + passwordText + "\"}"
                );

                Request request = new Request.Builder()
                        .url(Env.BASE_URL + "/users/register")
                        .addHeader("Content-Type", "application/json")
                        .post(body)
                        .build();
                client.newCall(request).enqueue(
                        new Callback() {
                            @Override
                            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                                Log.d("RegisterActivity Error", e.getMessage());
                            }

                            @Override
                            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                                try {
                                    LoginModal modal = LoginModal.fromJson(response.body().string());
                                    if (modal.success) {
                                        Intent intent = new Intent(RegisterActivity.this, HomeActivity.class);
                                        SharedPreferences prefs = getSharedPreferences("user", MODE_PRIVATE);
                                        SharedPreferences.Editor editor = prefs.edit();
                                        assert modal.data != null;
                                        editor.putString("token", modal.data.token);
                                        editor.putString("id", modal.data.user.id);
                                        editor.putString("name", modal.data.user.name);
                                        editor.putString("email", modal.data.user.email);
                                        editor.apply();
                                        startActivity(intent);
                                    }
                                } catch (Exception e) {
                                    throw new RuntimeException(e);
                                }
                            }
                        }
                );
            }
        );
    }
}