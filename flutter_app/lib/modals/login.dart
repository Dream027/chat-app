import 'dart:convert';
import 'dart:ffi';

class LoginModal {
	String? message;
	bool? success;
	int? statusCode;
	Data? data;

	LoginModal.fromJson(String str) {
		Map<String, dynamic> json = jsonDecode(str);

		message = json['message'];
		success = json['success'];
		statusCode = json['statusCode'];
		data = json['data'] != null ? Data.fromJson(json['data']) : null;
	}
}

class Data {
	String? token;
	User? user;

	Data({this.token, this.user});

	factory Data.fromJson(Map<String, dynamic> json) => Data(
		token: json["token"],
		user: json["user"] != null ? User.fromJson(json["user"]) : null,
	);
}

class User {
	String? userId;
	String? name;
	String? email;
	String? image;

	User.fromJson(Map<String, dynamic> json) {
		userId = json["_id"];
		name = json["name"];
		email = json["email"];
		image = json["image"];
	}
}