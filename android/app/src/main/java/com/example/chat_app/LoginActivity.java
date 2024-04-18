package com.example.chat_app;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.AppCompatButton;
import androidx.appcompat.widget.AppCompatEditText;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.example.chat_app.modals.login.LoginModal;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class LoginActivity extends AppCompatActivity {
    OkHttpClient client = new OkHttpClient();
    AppCompatEditText email, password;
    AppCompatButton btn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        email = findViewById(R.id.login_email);
        password = findViewById(R.id.login_password);
        btn = findViewById(R.id.login_button);

        btn.setOnClickListener(
            v -> {
                String emailText = email.getText().toString();
                String passwordText = password.getText().toString();

                RequestBody body = RequestBody.create(
                        MediaType.parse("application/json"),
                        "{\"email\":\"" + emailText + "\",\"password\":\"" + passwordText + "\"}"
                );

                Request request = new Request.Builder()
                        .url(Env.BASE_URL + "/users/login")
                        .addHeader("Content-Type", "application/json")
                        .post(body)
                        .build();
                client.newCall(request).enqueue(
                        new Callback() {
                            @Override
                            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                                Log.d("LoginActivity Error", e.getMessage());
                            }

                            @Override
                            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                                try {
                                    LoginModal modal = LoginModal.fromJson(response.body().string());
                                    if (modal.success) {
                                        Intent intent = new Intent(LoginActivity.this, HomeActivity.class);
                                        SharedPreferences prefs = getSharedPreferences("user", MODE_PRIVATE);
                                        SharedPreferences.Editor editor = prefs.edit();
                                        assert modal.data != null;
                                        editor.putString("token", modal.data.token);
                                        editor.putString("id", modal.data.user.id);
                                        editor.putString("name", modal.data.user.name);
                                        editor.putString("email", modal.data.user.email);
                                        editor.putString("image", modal.data.user.image);
                                        editor.apply();
                                        startActivity(intent);
                                    } else {
                                        runOnUiThread(
                                                () -> Toast.makeText(
                                                        LoginActivity.this,
                                                        modal.message,
                                                        Toast.LENGTH_SHORT
                                                ).show()
                                        );
                                    }
                                } catch (Exception e) {
                                    Log.d("LoginActivity Error", e.getMessage());
                                    runOnUiThread(
                                            () -> Toast.makeText(
                                                    LoginActivity.this,
                                                    e.getMessage(),
                                                    Toast.LENGTH_SHORT
                                            ).show()
                                    );
                                }

                            }
                        }
                );
            }
        );
    }
}