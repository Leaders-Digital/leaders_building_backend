export async function sendPushNotification(expoToken, message) {
    if (!expoToken) return;
    await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            to: expoToken,
            sound: "default",
            title: "Project Update",
            body: message,
        }),
    });
}