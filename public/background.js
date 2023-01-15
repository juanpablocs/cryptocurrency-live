chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled...');
  // create alarm after extension is installed / upgraded
  // chrome.alarms.create('refresh', { periodInMinutes: 3 });
  chrome.alarms.create({
    periodInMinutes: 1 / 60,
  });
});

chrome.alarms.onAlarm.addListener(() => {
  chrome.storage.local.get(["price"]).then((res) => {
    console.log(res);
    const price = res.price ?? 0;

    chrome.action.setBadgeText({
      text: `${price}`,
    });
  });
});