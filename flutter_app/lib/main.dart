import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_app/pages/login.dart';
import 'package:shared_preferences_android/shared_preferences_android.dart';

void main() {
	if (Platform.isAndroid) {
		SharedPreferencesAndroid.registerWith();
	}
	runApp(const MyApp());
}

class MyApp extends StatelessWidget {
	const MyApp({super.key});

	// This widget is the root of your application.
	@override
	Widget build(BuildContext context) {
		return MaterialApp(
			title: 'Flutter Demo',
			debugShowCheckedModeBanner: false,
			theme: ThemeData(
				primarySwatch: Colors.blue,
			),
			home: const LoginPage()
		);
	}
}
