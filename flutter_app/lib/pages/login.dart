// ignore_for_file: avoid_print

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_app/env.dart';
import 'package:flutter_app/modals/Login.dart';
import 'package:flutter_app/pages/home.dart';
import 'package:flutter_app/pages/register.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

void login(BuildContext context,  email, String password) async {
	print("$email -> $password");
	final url = Uri.parse("$SERVER_URL/users/login");

	try {
		const headers = {
			"Content-Type": "application/json",
			"Accept": "application/json"
		};
		final body = {"email": email, "password": password};
		final response = await http.post(url, headers: headers, body: jsonEncode(body));

		LoginModal res = LoginModal.fromJson(response.body);
		if (res.success ?? false) {
			print(response.body);

			final prefs = await SharedPreferences.getInstance();
			prefs.setString("token", res.data!.token!);
			prefs.setString("session", jsonEncode({
				"name": res.data!.user!.name,
				"email": res.data!.user!.email,
				"image": res.data!.user!.image,
				"userId": res.data!.user!.userId,
				"id": res.data!.user!.userId
			}));

			Navigator.pushReplacement(
				context,
				MaterialPageRoute(builder: (context) => const HomePage()),
			);
		} else {
			print(res.message);
		}
	} catch (e) {
		print("error -> $e");
	}
}

class LoginPage extends StatelessWidget {
	const LoginPage({super.key});

	@override
	Widget build(BuildContext context) {
		return const LoginPageState();
	}
}

class LoginPageState extends StatefulWidget {
  const LoginPageState({super.key});

  @override
	State<StatefulWidget> createState() {
		return _LoginPageState();
	}
}

class _LoginPageState extends State<LoginPageState> {
	final emailController = TextEditingController();
	final passwordController = TextEditingController();

	@override
	void dispose() {
		emailController.dispose();
		passwordController.dispose();
		super.dispose();
	}

	@override
	Widget build(BuildContext context) {
		return Scaffold(
			body: Center(
				child: SizedBox(
					width: 400,
					height: 300,
					child: Column(
						mainAxisAlignment: MainAxisAlignment.spaceBetween,
						crossAxisAlignment: CrossAxisAlignment.center,
						children: [
							const Text(
								'Login in to your account',
								style: TextStyle(
									color: Colors.black,
									fontSize: 34,
									fontWeight: FontWeight.bold,
									wordSpacing: 3.0,
								),
							),
							Column(
								children: [
									TextField(
										controller: emailController,
										decoration: const InputDecoration(
											hintText: "Email",
										),
										keyboardType: TextInputType.emailAddress,
									),
									TextField(
										controller: passwordController,
										decoration: const InputDecoration(
											hintText: "Password",
										),
									),
								],
							),
							TextButton(
								onPressed: () => login(
									context,
									emailController.text,
									passwordController.text
								),
								style: TextButton.styleFrom(
									backgroundColor: Colors.blue.shade400,
									foregroundColor: Colors.white,
									padding: const EdgeInsets.symmetric(horizontal: 50, vertical: 20),
								),
                				child: const Text('Login'),
							),
							Row(
								mainAxisAlignment: MainAxisAlignment.center,
								children: [
									const Text('Don\'t have an account?'),
									TextButton(
										onPressed: () {
											Navigator.push(context, MaterialPageRoute(builder: (context) => const RegisterPage()));
										},
										style: TextButton.styleFrom(
											foregroundColor: Colors.blue.shade400,
										),
										child: const Text('Register'),
									),
								],
							)
						],
					),
				),
			),
		);
	}
}
