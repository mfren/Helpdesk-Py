// These values are used in 'src/components/CreateReport/CreateReport.js' to populate certain fields

// This is the helper text that displays under the Title field
export const TITLE_HELP = "Please provide a short description of the problem";

// This is the helper text that displays under the Description field
export const DESCRIPTION_HELP = "Here you can provide a more detailed explanation of the problem";

// This is the helper text that displays under the Category field
export const CATEGORY_HELP = "Select the most appropriate category";

// This is the helper text that displays under the Urgency field
export const URGENCY_HELP = "Tell us how important this issue is";

// These are the different options that will be displayed in the Category Drop-down
// These can be more or less than 4, but there must be more than 1
export const CATEGORY = [
    "Hardware",
    "Software",
    "Network",
    "Other"
];

// These are the different options that will be displayed in the Urgency Drop-down
// THERE MUST BE EXACTLY 3 OF THESE, only change the names of these!!!
// Changing the amount of them will break other parts of the code!!!
export const URGENCY = [
    "High",
    "Medium",
    "Low"
];