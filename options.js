document.addEventListener("DOMContentLoaded", function () {
  var saveButton = document.getElementById("saveButton");
  var delayInput = document.getElementById("delayInput");

  saveButton.addEventListener("click", function () {
    var delayInSeconds = delayInput.value;
    chrome.storage.sync.set({ delayInSeconds: delayInSeconds }, function () {
      // Notify the user that the delay value has been saved
      alert("Delay value saved successfully!");
    });
  });
});
