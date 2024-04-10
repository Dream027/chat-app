class Session {
	String name;
	String email;
	String image;
	String userId;

	Session({required this.name, required this.email, required this.image, required this.userId});

	factory Session.fromJson(Map<String, dynamic> json) {
		return Session(
			name: json['name'],
			email: json['email'],
			image: json['image'],
			userId: json['_id'],
		);
	}
}