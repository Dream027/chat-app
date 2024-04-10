import 'package:flutter/material.dart';
import 'package:flutter_app/pages/login.dart';

class RegisterPage extends StatelessWidget {
	const RegisterPage({super.key});

	@override
	Widget build(BuildContext context) {
		return Scaffold(
			body: Center(
				child: SizedBox(
					width: 400,
					height: 400,
					child: Column(
						mainAxisAlignment: MainAxisAlignment.spaceBetween,
						crossAxisAlignment: CrossAxisAlignment.center,
						children: [
							const Text(
								'Create your new account',
								style: TextStyle(
									color: Colors.black,
									fontSize: 34,
									fontWeight: FontWeight.bold,
									wordSpacing: 3.0,
								),
							),
							const Column(
								mainAxisAlignment: MainAxisAlignment.spaceBetween,
								children: [
									TextField(
										decoration: InputDecoration(
											hintText: "Username",
										),
									),
									TextField(
										decoration: InputDecoration(
											hintText: "Email",
										),
									),
									TextField(
										decoration: InputDecoration(
											hintText: "Password",
										),
									),
								],
							),
							TextButton(
								onPressed: () {},
								style: TextButton.styleFrom(
									backgroundColor: Colors.blue.shade400,
									foregroundColor: Colors.white,
									padding: const EdgeInsets.symmetric(horizontal: 50, vertical: 20),
								),
                				child: const Text('Create Account'),
							),
							Row(
								mainAxisAlignment: MainAxisAlignment.center,
								children: [
									const Text('Already have an account?'),
									TextButton(
										onPressed: () {
											Navigator.push(context, MaterialPageRoute(builder: (context) => const LoginPage()));
										},
										style: TextButton.styleFrom(
											foregroundColor: Colors.blue.shade400,
										),
										child: const Text('Login'),
									),
								],
							),
						],
					),
				),
			),
		);
	}
}
