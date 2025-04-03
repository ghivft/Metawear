// Detect and connect MetaMask
async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {  // Correct MetaMask detection
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];

            // Update UI
            document.getElementById("wallet-address").innerText = `Connected: ${walletAddress}`;
            document.getElementById("connect-btn").innerText = "Disconnect Wallet";
            document.getElementById("connect-btn").setAttribute("onclick", "disconnectWallet()");
        } catch (error) {
            console.error("Wallet connection failed", error);
        }
    } else {
        alert("Please install MetaMask!");
    }
}

// Disconnect Wallet
function disconnectWallet() {
    document.getElementById("wallet-address").innerText = "Not Connected";
    document.getElementById("connect-btn").innerText = "Connect Wallet";
    document.getElementById("connect-btn").setAttribute("onclick", "connectWallet()");
}

// Check if wallet is already connected on page load
async function checkWalletConnection() {
    if (typeof window.ethereum !== "undefined") {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            document.getElementById("wallet-address").innerText = `Connected: ${accounts[0]}`;
            document.getElementById("connect-btn").innerText = "Disconnect Wallet";
            document.getElementById("connect-btn").setAttribute("onclick", "disconnectWallet()");
        }
    }
}

// Listen for account changes
window.ethereum?.on("accountsChanged", (accounts) => {
    if (accounts.length > 0) {
        document.getElementById("wallet-address").innerText = `Connected: ${accounts[0]}`;
    } else {
        disconnectWallet();
    }
});

// Listen for network changes
window.ethereum?.on("chainChanged", () => {
    window.location.reload();
});

// Run check on page load
document.addEventListener("DOMContentLoaded", checkWalletConnection);

// Purchase NFT function
async function purchaseNFT(nftId) {
    if (!window.ethereum) {
        alert("Please connect your wallet first.");
        return;
    }

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const price = web3.utils.toWei("0.05", "ether");
    
    try {
        await web3.eth.sendTransaction({
            from: accounts[0],
            to: "0xYourSmartContractAddressHere", // Replace with actual smart contract address
            value: price
        });
        alert(`NFT ${nftId} purchased successfully!`);
    } catch (error) {
        console.error("Transaction failed", error);
    }
}
