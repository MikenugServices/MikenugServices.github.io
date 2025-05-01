const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

const saveSubscription = async (subscription) => {
    const response = await fetch('http://192.168.2.20:8080/save-subs', {
        method: 'post',
        headers: { 'Content-type': "application/json" },
        body: JSON.stringify({
            sub: subscription
        })
    })
    return response.text()
}

self.addEventListener("activate", async (e) => {
    const subscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array("BG_jzd40rAS03APRXVje5C9CDaTMLDpcckfHs5oA0umzvh-9UYUybphcjsTiDQ-Ru1hPoUEmYwvGDrihjYuarv4")
    })
            const response = await saveSubscription(subscription);
            console.log(response)
})

self.addEventListener("push", e => {
    let name = "Wohoo!!";
    let payload = e.data.text()
    self.registration.showNotification(payload);
})

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow("https://mikenug.halalas-services.xyz/")
    );
})