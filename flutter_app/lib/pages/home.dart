import 'package:flutter/material.dart';
import 'package:path/path.dart';
import 'package:shared_preferences/shared_preferences.dart';

class HomePageState extends StatefulWidget {
	const HomePageState({super.key});
	
	@override
	State<StatefulWidget> createState() {
		return _HomePageState();
	}
}

class _HomePageState extends State<HomePageState> {
	String token = "";

	@override
	void initState() {
		super.initState();
		getToken();
	}

	void getToken() async {
		final prefs = await SharedPreferences.getInstance();
		token = prefs.getString("token") ?? "";
		setState(() {
			token = token;
		});
	}

	@override
	void dispose() {
		super.dispose();
	}

	@override
	Widget build(BuildContext context) {
		return Scaffold(
			body: Center(
				child: Text(token),
			),
		);
	}
}

class HomePage extends StatelessWidget {
	const HomePage({super.key});

	@override
	Widget build(BuildContext context) {
		return const HomePageState();
	}
}