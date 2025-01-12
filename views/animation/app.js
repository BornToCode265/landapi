function exchangeToKwachaCoin() {
  const exchangeButton = document.querySelector("#exchange .btn");
  exchangeButton.classList.add("active");
  setTimeout(() => {
    exchangeButton.classList.remove("active");
    alert("Exchanged to Kwacha Coin successfully!");
  }, 1000);
}

function sendKwachaCoin() {
  const sendButton = document.querySelector("#send .btn");
  sendButton.classList.add("active");
  setTimeout(() => {
    sendButton.classList.remove("active");
    alert("Kwacha Coin sent successfully!");
  }, 1000);
}

// Sample Market Data Loader (for real-time data, you'd integrate an API)
window.onload = function () {
  setTimeout(() => {
    document.getElementById("btcPrice").innerText = "$28,300";
    document.getElementById("ethPrice").innerText = "$1,800";
    document.getElementById("otherPrices").innerText = "Various Updated Prices";
  }, 1500);
};
