import axios from "axios";
import React, { useEffect, useState } from "react";
import * as yup from "yup";

function Form() {
  const IntialFormData = {
    Name: "",
    Email: "",
    Password: "",
    TermsofService: ""
  };
  const [FormState, setFormState] = useState(IntialFormData);
  const [Guest, setGuest] = useState([])

  const [errors, setError] = useState(IntialFormData)


  const formTemplate = yup.object().shape({
    Name: yup.string().required("please Name is required here"),
    Email: yup.string().email("please put a valid email").required(),
    Password: yup.string().min(6, "Passwords must be at least 6 characters long.")
    .required("Password is Required"),
    TermsofService: yup.boolean().oneOf([true], "You must accapt Terms of Service"), 
  })

  useEffect(() => {
    formTemplate.isValid(FormState).then((valid) => {
      console.log("valid", valid)
    })
  }),[FormState]

  function validationChange(event) {
    yup.reach(formTemplate, event.target.Name)
    .validate(event.target.value)
    .then((valid) => {
        setError({...errors, [event.target.Name]: ""})
    })
    .catch((er) => {
      setError({...error, [event.target.Name]: er.errors[0]})
    })
  }


  const handleChange = (event) => {
    const newUserData = {
      ...FormState,
      [event.target.Name]: event.target.type ==="checkbox" ? event.target.checked : event.target.value
    };
    setFormState(newUserData)
    validationChange(event)


  };
  
  function formSubmit(event) {
    event.preventDefault()

    axios.post ("https://reqres.in/api/users", FormState)
    .then((res) => {
        setGuest(res.data)

        setFormState({
          Name: "",
          Email: "",
          Password: "",
          TermsofService: ""
        })
    })
    .catch((error) => console.log(error));
  }


  return (
      <Form>
      <lebel htmlFor="Name">Name</lebel>
      <input
        type="text"
        placeholder="Enter Name"
        id="Name"
        name="Name"
        value={FormState.Name}
        onChange={handleChange}
      />
       <br />
        {errors.Name.length > 0 ? <p className="error">{errors.Name}</p> :null}

      <label htmlFor="Email">Email </label>
      <input
        type="text"
        placeholder="write your Email here"
        id="Email"
        name="Email"
        value={FormState.Email}
        onChange={handleChange}
      />
      <br />
      {errors.Email.length > 0 ? <p className="error">{errors.Email}</p> :null}
      <label htmlFor="Password">Password </label>
      <input
        type="Password"
        placeholder="Password in here"
        name="Password"
        id="Password"
        value={FormState.Password}
        onChange={handleChange}
      />
       <br />
      <label htmlFor="Terms of Service" className="Terms of Service" />
      <input type="checkbox" Name="Term" checked={FormState.TermsofService} onChange={handleChange}/>
      Team of Service
      <button type="submit">submit </button>
  
     </Form>
  );
}
export default Form;
