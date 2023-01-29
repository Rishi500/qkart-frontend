import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";

/**
 * @class Register component handles the Register page UI and functionality
 *
 * Contains the following fields
 *
 * @property {boolean} state.loading
 *    Indicates background action pending completion. When true, further UI actions might be blocked
 * @property {string} state.username
 *    User given field for username
 * @property {string} state.password
 *    User given field for password
 * @property {string} state.confirmPassword
 *    User given field for retyping and confirming password
 */
class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      username: "",
      password: "",
      confirmPassword: "",
    };
  }
  
  // TODO: CRIO_TASK_MODULE_LOGIN - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * -    Check that username field is not an empty value
   * -    Check that username field is not less than 6 characters in length
   * -    Check that username field is not more than 32 characters in length
   * -    Check that password field is not an empty value
   * -    Check that password field is not less than 6 characters in length
   * -    Check that password field is not more than 32 characters in length
   * -    Check that confirmPassword field has the same value as password field
   */
  validateInput = () => {
    if (this.state.username === ""){
      message.error('username is required')
      return false
    }
    else if (this.state.username.length<6){
      message.error('username should be atleast 6 characters')
      return false
    }
    else if (this.state.username.length>32){
      message.error('username should be atmost 32 characters')
      return false
    }
    else if (this.state.password===""){
      message.error('password field cannot be empty');
      return false
    }
    else if (this.state.password.length<6){
      message.error('password should be of length atleast 6');
      return false
    }
    else if (this.state.password.length>32){
      message.error('password should be of maximum 32 length');
      return false
    }
    else if (this.state.password !== this.state.confirmPassword){
      message.error('password and confirm password are not same');
      return false
    }
    else{
      return true;
    }

  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Check API response
  /**
   * Check the response of the API call to be valid and handle any failures along the way
   *
   * @param {boolean}  errored
   *    Represents whether an error occurred in the process of making the API call itself
   * @param {{ success: boolean, message?: string }}  response
   *    The response JSON object which may contain further success or error messages
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * If the API call itself encounters an error, errored flag will be true.
   * If the backend returns an error, then success field will be false and message field will have a string with error details to be displayed.
   * When there is an error in the API call itself, display a generic error message and return false.
   * When there is an error returned by backend, display the given message field and return false.
   * When there is no error and API call is successful, return true.
   */
  validateResponse = (errored, response) => {
    if (errored){
      message.error('Some error occured while making api call');
      return false;
    }
    else if (response.success===false){
      message.error(response.message);
      return false;
    }
    else{
      return true;
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the API call over the network and return the response
   *
   * @returns {{ success: boolean }|undefined}
   *     The response JSON object
   *
   * -    Set the loading state variable to true
   * -    Perform the API call via a fetch call: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
   * -    The call must be made asynchronously using Promises or async/await
   * -    The call must handle any errors thrown from the fetch call
   * -    Parse the result as JSON
   * -    Set the loading state variable to false once the call has completed
   * -    Call the validateResponse(errored, response) function defined previously
   * -    If response passes validation, return the response object
   *
   * Example for successful response from backend:
   * HTTP 200
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
    performAPICall = async () => {
    this.setState({loading:true})
    let data = {username:this.state.username,
    password:this.state.password};
    let registerResponse=null;
    let url = config.endpoint;
    let error = false;
    try{
      let registerRequest = await fetch(
        url+"/auth/register",
        {
          method:"POST",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        });
        registerResponse = await registerRequest.json();
    }
    catch (err){
      error=true;
      console.log(err);
      message.error('some error occured while registering')
    }
    console.log(registerResponse);
    this.setState({loading:false})
    if (this.validateResponse(error,registerResponse)){
      return registerResponse;
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Implement the register function
  /**
   * Definition for register handler
   * This is the function that is called when the user clicks on the register button or submits the register form
   * -    Call the previously defined validateInput() function and check that is returns true, i.e. the input values pass validation
   * -    Call the previously defined performAPICall() function asynchronously and capture the returned value in a variable
   * -    If the returned value exists,
   *      -   Clear the input fields
   *      -   Display a success message
   *      -   Redirect the user to the "/login" page
   */
  register = async () => {
     if(this.validateInput()===true){
       let response = await this.performAPICall();
       if (response){
         this.setState({loading:false,username:"",password:"",confirmPassword:""});
         this.props.history.push("/login");
         message.success('registered');
       }

     }
  };

  /**
   * JSX and HTML goes here
   * We require a text field, a password field, and a confirm password field (each with data binding to state), and a submit button that calls register()
   */
  render() {
    return (
      <>
        {/* Display Header */}
        <Header history={this.props.history} />

        {/* Display Register fields */}
        <div className="flex-container">
          <div className="register-container container">
            <h1>Make an account</h1>

            {/* Antd component which renders a formatted <input type="text"> field */}
            <Input
              className="input-field"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              onChange={(e) => {
                this.setState({
                  username: e.target.value,
                });
              }}
            />

            {/* Antd component which renders a formatted <input type="password"> field */}
            <Input.Password
              className="input-field"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              // TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Add a placeholder text, "Password" to the input bar
              onChange={(e) => {
                this.setState({
                  password: e.target.value,
                });
              }}
            />

            {/* Antd component which renders a formatted <input type="password"> field */}
            <Input.Password
              className="input-field"
              // TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Add a lock icon to the input bar (check how the "Password" input bar is rendered)
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Confirm Password"
              onChange={(e) => {
                this.setState({
                  confirmPassword: e.target.value,
                });
              }}
            />

            {/* Antd component which renders a formatted <button type="button"> field */}
            <Button
              loading={this.state.loading}
              type="primary"
              onClick={this.register}
              // TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Add an event handler which calls the "register()" function when the button is clicked
            >
              Register
            </Button>
          </div>
        </div>

        {/* Display the footer */}
        <Footer></Footer>
      </>
    );
  }
}

export default withRouter(Register);