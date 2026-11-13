
/* ============================================
   1. IMPORT STRICT MODE
   ============================================ */

// Reason: Imports StrictMode from the React library.
// Purpose: Helps identify potential problems in the application during development.
import { StrictMode } from 'react'


/* ============================================
   2. IMPORT CREATE ROOT
   ============================================ */

// Reason: Imports createRoot from the React DOM client package.
// Purpose: Allows React to create a root and display the application inside an HTML element.
import { createRoot } from 'react-dom/client'


/* ============================================
   3. IMPORT CSS FILE
   ============================================ */

// Reason: Imports the global CSS file.
// Purpose: Applies common styles to the entire application.
import './index.css'


/* ============================================
   4. IMPORT APP COMPONENT
   ============================================ */

// Reason: Imports the App component from App.jsx.
// Purpose: Allows the main entry point to display the main application interface.
import App from './App.jsx'


/* ============================================
   5. CREATE REACT ROOT AND RENDER
   ============================================ */

// Reason: Finds the HTML element whose ID is "root".
// Purpose: Identifies where the React application should be displayed.
document.getElementById('root')

// Reason: Creates a React root inside the selected HTML element.
// Purpose: Establishes the connection between React and the HTML document.
createRoot(document.getElementById('root'))

// Reason: Calls render() to display the React application inside the root element.
// Purpose: Starts displaying the application in the browser.
createRoot(document.getElementById('root')).render(

  // Reason: Wraps the application inside React StrictMode.
  // Purpose: Helps detect potential problems in components during development.
  <StrictMode>

    // Reason: Loads and displays the main App component.
    // Purpose: Displays the Parcel Pricing System frontend.
    <App />

  </StrictMode>,

);
