
/* ============================================
   1. IMPORT REQUIRED MODULES
   ============================================ */

// Reason: Imports the useState Hook from React.
// Purpose: useState allows us to store and update data inside a React component.
import { useState } from "react";

// Reason: Imports the CSS file.
// Purpose: Applies the styles defined in App.css to this React component.
import "./App.css";


/* ============================================
   2. BACKEND API URL
   ============================================ */

// Reason: Gets the backend URL from the environment variable.
// Purpose: Allows us to change the backend URL without modifying the source code.

// Reason: If VITE_API_URL is not configured, use localhost port 8080 as the default.
// Purpose: Connects the frontend to the locally running NestJS backend.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";


/* ============================================
   3. MAIN REACT COMPONENT
   ============================================ */

// Reason: Defines the main App component.
// Purpose: Contains the user interface and application functionality.
function App() {

  /* ============================================
     4. FORM STATE
     ============================================ */

  // Reason: Creates a state variable called form and a function called setForm.
  // Purpose: Stores all parcel details entered by the user.
  const [form, setForm] = useState({

    // Reason: Sets NORMAL as the default parcel category.
    category: "NORMAL",

    // Reason: Initializes weight as an empty string.
    weight: "",

    // Reason: Initializes parcel length as an empty string.
    length: "",

    // Reason: Initializes parcel width as an empty string.
    width: "",

    // Reason: Initializes parcel height as an empty string.
    height: ""
  });


  /* ============================================
     5. RESULT, ERROR AND LOADING STATES
     ============================================ */

  // Reason: Creates a state variable to store the pricing result from the backend.
  // Purpose: Initially null means no calculation result is available.
  const [result, setResult] = useState(null);

  // Reason: Creates a state variable to store error messages.
  // Purpose: Displays errors when the calculation or backend request fails.
  const [error, setError] = useState("");

  // Reason: Creates a state variable to track the calculation process.
  // Purpose: Prevents repeated submissions and displays a loading message.
  const [loading, setLoading] = useState(false);


  /* ============================================
     6. HANDLE INPUT CHANGES
     ============================================ */

  // Reason: Defines a function to handle changes in form input fields.
  // Purpose: Updates the form state whenever the user enters or selects a value.
  function handleChange(event) {

    // Reason: Extracts the name and value from the input element.
    // Purpose: Identifies which field changed and what value the user entered.
    const { name, value } = event.target;

    // Reason: Updates the form state using the setForm function.
    setForm({

      // Reason: Copies all existing form values.
      // Purpose: Prevents other form fields from being lost when one field changes.
      ...form,

      // Reason: Dynamically updates the property matching the input's name.
      // Example: If name is "weight", only the weight value is updated.
      [name]: value
    });
  }


  /* ============================================
     7. CALCULATE PARCEL PRICE
     ============================================ */

  // Reason: Defines an asynchronous function to calculate the parcel delivery price.
  // Purpose: Sends parcel details to the NestJS backend and receives the pricing result.
  async function calculatePrice(event) {

    // Reason: Prevents the browser's default form submission behaviour.
    // Purpose: Stops the page from refreshing when the user submits the form.
    event.preventDefault();


    // Reason: Clears the previous calculation result.
    // Purpose: Prevents an old result from appearing during a new calculation.
    setResult(null);

    // Reason: Clears any previous error message.
    // Purpose: Removes old errors before starting a new request.
    setError("");

    // Reason: Changes the loading state to true.
    // Purpose: Indicates that the application is processing the request.
    setLoading(true);


    // Reason: Starts a try block to execute code that may produce an error.
    // Purpose: Allows us to handle API and network errors using catch.
    try {

      // Reason: Sends an HTTP request to the NestJS backend.
      // Purpose: Requests the backend to calculate the parcel delivery price.
      const response = await fetch(

        // Reason: Combines the backend URL with the parcel calculation endpoint.
        // Purpose: Targets the POST /api/parcels/calculate endpoint.
        `${API_URL}/api/parcels/calculate`,

        {
          // Reason: Specifies the HTTP request method as POST.
          // Purpose: Sends parcel information to the backend.
          method: "POST",

          // Reason: Defines the request headers.
          headers: {

            // Reason: Tells the backend that the request body contains JSON data.
            "Content-Type": "application/json"
          },

          // Reason: Converts the JavaScript object into a JSON string.
          // Purpose: Makes the form data suitable for sending through an HTTP request.
          body: JSON.stringify({

            // Reason: Sends the selected parcel category.
            category: form.category,

            // Reason: Converts the weight string into a number.
            weight: Number(form.weight),

            // Reason: Converts the length string into a number.
            length: Number(form.length),

            // Reason: Converts the width string into a number.
            width: Number(form.width),

            // Reason: Converts the height string into a number.
            height: Number(form.height)
          })
        }
      );


      // Reason: Reads the JSON response returned by the backend.
      // Purpose: Converts the response body into a JavaScript object.
      const data = await response.json();


      // Reason: Checks whether the HTTP response was successful.
      // Purpose: Handles responses with HTTP error status codes.
      if (!response.ok) {

        // Reason: Extracts the error messages from the response object.
        // Object.values() gets all object values.
        // join(", ") combines them into one readable string.
        // If no error details exist, displays the default error message.
        throw new Error(
          Object.values(data).join(", ") || "Unable to calculate price"
        );
      }


      // Reason: Saves the successful pricing response in React state.
      // Purpose: Displays the pricing breakdown on the frontend.
      setResult(data);


    // Reason: Executes when an error occurs inside the try block.
    // Purpose: Displays an appropriate error message to the user.
    } catch (err) {

      // Reason: Stores the error message in the error state.
      // Purpose: Displays the backend or network error on the screen.
      setError(
        err.message || "Cannot connect to the backend. Check whether the NestJS server is running."
      );

    // Reason: Executes after the try or catch block finishes.
    // Purpose: Ensures the loading state is disabled whether the request succeeds or fails.
    } finally {

      // Reason: Changes loading back to false.
      // Purpose: Allows the user to submit another calculation.
      setLoading(false);
    }
  }


  /* ============================================
     8. RESET FORM
     ============================================ */

  // Reason: Defines a function to reset the parcel form.
  // Purpose: Allows the user to clear the entered details.
  function resetForm() {

    // Reason: Restores the original default form values.
    // Purpose: Sets category to NORMAL and clears all numeric fields.
    setForm({

      category: "NORMAL",
      weight: "",
      length: "",
      width: "",
      height: ""
    });

    // Reason: Removes the previously calculated result.
    setResult(null);

    // Reason: Removes any displayed error message.
    setError("");
  }


  /* ============================================
     9. RETURN JSX USER INTERFACE
     ============================================ */

  // Reason: Returns the JSX structure that React displays in the browser.
  // Purpose: Builds the complete Parcel Pricing System interface.
  return (

    // Reason: Creates the main application container.
    // Purpose: Applies the app CSS class to the entire application.
    <div className="app">


      {/* ============================================
          10. HEADER SECTION
          ============================================ */}

      {/* Reason: Creates the header section of the application. */}
      <header className="header">

        {/* Reason: Displays the main application title. */}
        <h1>Parcel Pricing System</h1>

        {/* Reason: Displays a short description below the title. */}
        <p>Calculate your parcel delivery price instantly</p>

      </header>


      {/* ============================================
          11. MAIN CONTENT CONTAINER
          ============================================ */}

      {/* Reason: Defines the main content area of the webpage. */}
      <main className="container">


        {/* ============================================
            12. PARCEL DETAILS FORM
            ============================================ */}

        {/* Reason: Creates a section containing the parcel input form. */}
        <section className="form-card">

          {/* Reason: Displays the form heading. */}
          <h2>Parcel Details</h2>

          {/* Reason: Gives the user instructions before entering parcel details. */}
          <p className="subtitle">
            Enter your parcel information below.
          </p>


          {/* Reason: Creates a form for collecting parcel information. */}
          {/* Purpose: Calls calculatePrice when the form is submitted. */}
          <form onSubmit={calculatePrice}>


            {/* Reason: Displays the category field label. */}
            <label>Parcel Category</label>


            {/* Reason: Creates a dropdown to select the parcel category. */}
            <select

              // Reason: Identifies this field as category.
              name="category"

              // Reason: Connects the dropdown value to React form state.
              value={form.category}

              // Reason: Calls handleChange when the selected category changes.
              onChange={handleChange}
            >

              {/* Reason: Allows the user to select the Document category. */}
              <option value="DOCUMENT">Document</option>

              {/* Reason: Allows the user to select the Normal category. */}
              <option value="NORMAL">Normal</option>

              {/* Reason: Allows the user to select the Fragile category. */}
              <option value="FRAGILE">Fragile</option>

            </select>


            {/* Reason: Displays the weight field label. */}
            <label>Weight (kg)</label>


            {/* Reason: Creates a numeric input field for parcel weight. */}
            <input

              // Reason: Allows the user to enter numeric values.
              type="number"

              // Reason: Identifies this field as weight.
              name="weight"

              // Reason: Displays example text before the user enters a value.
              placeholder="Enter weight"

              // Reason: Prevents values below 0.01 from being entered through normal browser validation.
              min="0.01"

              // Reason: Allows decimal values instead of restricting input to whole numbers.
              step="any"

              // Reason: Connects the input value to the React form state.
              value={form.weight}

              // Reason: Updates the form state whenever the user changes the weight.
              onChange={handleChange}

              // Reason: Makes the weight field compulsory.
              required
            />


            {/* Reason: Creates a container for the dimension heading. */}
            <div className="dimension-heading">

              {/* Reason: Displays the dimension label with the measurement unit. */}
              <label>Dimensions (cm)</label>

            </div>


            {/* Reason: Creates a grid container for length, width and height. */}
            <div className="dimension-grid">


              {/* Reason: Creates the length input field. */}
              <input

                // Reason: Accepts numeric values for parcel length.
                type="number"

                // Reason: Identifies this field as length.
                name="length"

                // Reason: Displays Length as placeholder text.
                placeholder="Length"

                // Reason: Sets the minimum allowed length to 0.01.
                min="0.01"

                // Reason: Allows decimal measurements.
                step="any"

                // Reason: Connects the value to the length state.
                value={form.length}

                // Reason: Updates the length state when the user enters a value.
                onChange={handleChange}

                // Reason: Makes the length field compulsory.
                required
              />


              {/* Reason: Creates the width input field. */}
              <input

                // Reason: Accepts numeric values for parcel width.
                type="number"

                // Reason: Identifies this field as width.
                name="width"

                // Reason: Displays Width as placeholder text.
                placeholder="Width"

                // Reason: Sets the minimum allowed width to 0.01.
                min="0.01"

                // Reason: Allows decimal measurements.
                step="any"

                // Reason: Connects the value to the width state.
                value={form.width}

                // Reason: Updates the width state when the user enters a value.
                onChange={handleChange}

                // Reason: Makes the width field compulsory.
                required
              />


              {/* Reason: Creates the height input field. */}
              <input

                // Reason: Accepts numeric values for parcel height.
                type="number"

                // Reason: Identifies this field as height.
                name="height"

                // Reason: Displays Height as placeholder text.
                placeholder="Height"

                // Reason: Sets the minimum allowed height to 0.01.
                min="0.01"

                // Reason: Allows decimal measurements.
                step="any"

                // Reason: Connects the value to the height state.
                value={form.height}

                // Reason: Updates the height state when the user enters a value.
                onChange={handleChange}

                // Reason: Makes the height field compulsory.
                required
              />

            </div>


            {/* ============================================
                13. CALCULATE BUTTON
                ============================================ */}

            {/* Reason: Creates the form submission button. */}
            <button

              // Reason: Submits the form and triggers calculatePrice.
              type="submit"

              // Reason: Disables the button while the API request is processing.
              disabled={loading}
            >

              {/* Reason: Displays Calculating while loading is true.
                  Otherwise, displays Calculate Price. */}
              {loading ? "Calculating..." : "Calculate Price"}

            </button>


            {/* ============================================
                14. RESET BUTTON
                ============================================ */}

            {/* Reason: Creates a button to clear the form. */}
            <button

              // Reason: Prevents the reset button from submitting the form.
              type="button"

              // Reason: Applies the reset-button CSS styles.
              className="reset-button"

              // Reason: Calls resetForm when the user clicks this button.
              onClick={resetForm}
            >

              {/* Reason: Displays the Reset button text. */}
              Reset

            </button>

          </form>

        </section>


        {/* ============================================
            15. ERROR MESSAGE DISPLAY
            ============================================ */}

        {/* Reason: Checks whether an error message exists.
            Purpose: Displays the error section only when error is not empty. */}
        {error && (

          // Reason: Creates a container to display the error message.
          <div className="error-message">

            {/* Reason: Displays the error message stored in React state. */}
            {error}

          </div>

        )}


        {/* ============================================
            16. PRICING RESULT DISPLAY
            ============================================ */}

        {/* Reason: Checks whether a pricing result exists.
            Purpose: Displays the result card only after a successful calculation. */}
        {result && (

          // Reason: Creates a section to display the pricing breakdown.
          <section className="result-card">

            {/* Reason: Displays the result section heading. */}
            <h2>Pricing Breakdown</h2>


            {/* Reason: Displays the selected parcel category. */}
            <div className="result-row">

              <span>Category</span>

              {/* Reason: Reads the category value returned by the backend. */}
              <strong>{result.category}</strong>

            </div>


            {/* Reason: Displays the actual parcel weight. */}
            <div className="result-row">

              <span>Actual Weight</span>

              {/* Reason: Displays actualWeight from the backend response. */}
              <strong>{result.actualWeight} kg</strong>

            </div>


            {/* Reason: Displays the volumetric weight calculated by the backend. */}
            <div className="result-row">

              <span>Volumetric Weight</span>

              {/* Reason: Displays volumetricWeight from the backend response. */}
              <strong>{result.volumetricWeight} kg</strong>

            </div>


            {/* Reason: Displays the chargeable weight used for pricing. */}
            <div className="result-row">

              <span>Chargeable Weight</span>

              {/* Reason: Displays chargeableWeight from the backend response. */}
              <strong>{result.chargeableWeight} kg</strong>

            </div>


            {/* Reason: Displays the base delivery charge. */}
            <div className="result-row">

              <span>Base Charge</span>

              {/* Reason: Converts the base charge into a number and formats it to two decimal places. */}
              <strong>Rs. {result.baseCharge.toFixed(2)}</strong>

            </div>


            {/* Reason: Displays the additional charge based on parcel weight. */}
            <div className="result-row">

              <span>Weight Charge</span>

              {/* Reason: Formats the weight charge to two decimal places. */}
              <strong>Rs. {result.weightCharge.toFixed(2)}</strong>

            </div>


            {/* Reason: Displays the additional charge for oversized parcels. */}
            <div className="result-row">

              <span>Oversized Surcharge</span>

              {/* Reason: Formats the oversized surcharge to two decimal places. */}
              <strong>Rs. {result.oversizedSurcharge.toFixed(2)}</strong>

            </div>


            {/* Reason: Creates a separate row to highlight the final delivery price. */}
            <div className="total-row">

              <span>Total Price</span>

              {/* Reason: Displays the final calculated price with two decimal places. */}
              <strong>Rs. {result.totalPrice.toFixed(2)}</strong>

            </div>

          </section>

        )}

      </main>


      {/* ============================================
          17. FOOTER SECTION
          ============================================ */}

      {/* Reason: Creates the footer at the bottom of the application. */}
      <footer>

        {/* Reason: Displays the technologies used to develop this application. */}
        Parcel Pricing System | React + NestJS

      </footer>

    </div>
  );
}


/* ============================================
   18. EXPORT COMPONENT
   ============================================ */

// Reason: Exports the App component as the default export.
// Purpose: Allows main.jsx or other files to import and render this component.
export default App;
