function setupConsentMode(options) {
	const {
		acceptText,         // Text for the accept button
		rejectText,         // Text for the reject button
		consentMessage,     // Message to display in the consent modal
        adStorage,          // Label for ad storage checkbox
        adUserData,         // Label for user data collection checkbox
        adPersonalization,  // Label for ad personalization checkbox
        analyticsStorage,   // Label for analytics storage checkbox
		position            // Position of the consent modal on the page
	} = options;

	// Create dynamic elements for the modal
	const modal = document.createElement("div");
	modal.id = "consentModal";
	modal.style.cssText = `
      position: fixed !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background-color: rgba(0, 0, 0, 0.5) !important;
      display: none !important;
      z-index: 1000 !important;
    `;

	// Style the content of the modal
	const modalContent = document.createElement("div");
	modalContent.style.cssText = `
      font-family: 'Trebuchet MS', sans-serif !important;
      background-color: rgba(31, 41, 55, 0.9) !important;
      backdrop-filter: blur(5px) !important;
      padding: 20px !important;
      max-width: 500px !important;
      border-radius: 8px !important;
      text-align: right !important;
      right: 20px !important;
      color: rgb(156, 163, 175) !important;
      position: absolute !important;
    `;

	// Set modal positioning based on the option passed
	switch (position) {
		case "center":
			modalContent.style.margin = "15% auto !important";
			break;
		case "bottom":
			modalContent.style.position = "absolute !important";
			modalContent.style.bottom = "20px";
			modalContent.style.left = "50%";
			modalContent.style.transform = "translateX(-50%)";
			break;
		case "top-right":
			modalContent.style.position = "absolute !important";
			modalContent.style.top = "20px";
			modalContent.style.right = "20px";
			break;
		case "bottom-right":
            modalContent.style.position = "absolute !important";
            modalContent.style.bottom = "20px";
            modalContent.style.right = "20px";
        case "top-left":
            modalContent.style.position = "absolute !important";
            modalContent.style.top = "20px";
            modalContent.style.left = "20px";
            break;
        case "bottom-left":
            modalContent.style.position = "absolute !important";
            modalContent.style.bottom = "20px";
            modalContent.style.left = "20px";
            break;
		default:
			modalContent.style.margin = "15% auto !important"; // Default: center
	}

	// Create the message paragraph
	const message = document.createElement("p");
	message.innerText = consentMessage;
    message.style.cssText = `
        text-align: left !important;
        font-size: 14px !important;
    `;

	// Create the container for the consent options (checkboxes)
	const consentOptions = document.createElement("div");
	consentOptions.style.cssText = `
        text-align: left !important; 
        margin-top: 20px !important; 
        font-size: 14px !important;
        display: flex !important;
        flex-direction: row !important;    
        justify-content: space-between !important;
        flex-wrap: wrap !important;
    `;

	// Create checkboxes for consent options
	const adStorageCheckbox = createCheckbox(
        "ad_storage", 
        adStorage
    );
	const userDataCheckbox = createCheckbox(
		"ad_user_data",
		adUserData
	);
	const personalizationCheckbox = createCheckbox(
		"ad_personalization",
		adPersonalization
	);
	const analyticsStorageCheckbox = createCheckbox(
		"analytics_storage",
		analyticsStorage
	);

	// Append the checkboxes to the consent options container
	consentOptions.appendChild(adStorageCheckbox);
	consentOptions.appendChild(userDataCheckbox);
	consentOptions.appendChild(personalizationCheckbox);
	consentOptions.appendChild(analyticsStorageCheckbox);

	// Create the accept button
	const acceptButton = document.createElement("button");
	acceptButton.innerText = acceptText;
	acceptButton.style.cssText = `
      background-color: rgb(37, 99, 235) !important;
      color: white !important;
      padding: 10px 20px !important;
      border: none !important;
      margin-right: 10px !important;
      margin-top: 10px !important;
      cursor: pointer !important;
      border-radius: 5px !important;
    `;

	// Create the reject button
	const rejectButton = document.createElement("button");
	rejectButton.innerText = rejectText;
	rejectButton.style.cssText = `
      background-color: rgb(55, 65, 81) !important;
      color: white !important;
      padding: 10px 20px !important;
      border: 1px solid rgb(107, 114, 128) !important;
      margin-top: 10px !important;
      cursor: pointer !important;
      border-radius: 5px !important;
    `;

	// Add the message, consent options, and buttons to the modal content
	modalContent.appendChild(message);
	modalContent.appendChild(consentOptions);
	modalContent.appendChild(acceptButton);
	modalContent.appendChild(rejectButton);
	modal.appendChild(modalContent);
	document.body.appendChild(modal);

	// Display the modal on page load if consent hasn't been given
	window.onload = function () {
		var consentGiven = localStorage.getItem("userConsent");
		if (!consentGiven) {
			document.getElementById("consentModal").style.display = "block";
		}
	};

	// Handle accept button click
	acceptButton.addEventListener("click", function () {
		const adStorage = document.getElementById("ad_storage").checked
			? "granted"
			: "denied";
		const userData = document.getElementById("ad_user_data").checked
			? "granted"
			: "denied";
		const personalization = document.getElementById("ad_personalization")
			.checked
			? "granted"
			: "denied";
		const analyticsStorage = document.getElementById("analytics_storage")
			.checked
			? "granted"
			: "denied";

		// Store consent state and update gtag
		localStorage.setItem("userConsent", "accepted");
		gtag("consent", "update", {
			ad_storage: adStorage,
			ad_user_data: userData,
			ad_personalization: personalization,
			analytics_storage: analyticsStorage,
		});
		document.getElementById("consentModal").style.display = "none";
	});

	// Handle reject button click
	rejectButton.addEventListener("click", function () {
		localStorage.setItem("userConsent", "rejected");
		gtag("consent", "update", {
			ad_storage: "denied",
			ad_user_data: "denied",
			ad_personalization: "denied",
			analytics_storage: "denied",
		});
		document.getElementById("consentModal").style.display = "none";
	});
}

// Function to create checkboxes with labels
function createCheckbox(id, labelText) {
	const label = document.createElement("label");
	label.style.cssText = `
        display: block !important; 
        margin-bottom: 10px !important;
        width: 50% !important;
        display: flex !important;
        align-items: start !important;
    `;

	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.id = id;
    checkbox.checked = true; // Default checked
	checkbox.style.cssText = `
        margin-right: 10px !important;
        width: 16px !important;
        height: 16px !important;
    `;

	const text = document.createElement("span");
	text.innerText = labelText;
	text.style.cssText = `color: inherit !important;`;

	// Append the checkbox and label text
	label.appendChild(checkbox);
	label.appendChild(text);

	return label;
}
