package com.example.chat_app.fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.example.chat_app.Env;

import okhttp3.OkHttpClient;
import okhttp3.Request;

public class SendInvitationFragment extends Fragment {
    private com.example.chat_app.databinding.FragmentSendInvitationBinding binding;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = com.example.chat_app.databinding.FragmentSendInvitationBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        binding.viewInvitationsSearchBtn.setOnClickListener(
                v -> {
                    String email = binding.viewInvitationsSearchField.getText().toString();

                    OkHttpClient client = new OkHttpClient();
                    Request request = new Request.Builder()
                            .url(Env.BASE_URL + "/users")
                            .build();
                }
        );
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
