export async function getSession(): Promise<Session | null> {
    try {
        const response = await fetch(
            "http://localhost:4000/api/v1/users/profile",
            {
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("accessToken"),
                },
            },
        );
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        if (!data.success) {
            return null;
        }
        return data.data;
    } catch (error: any) {
        return null;
    }
}
