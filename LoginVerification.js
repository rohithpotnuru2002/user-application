function Validation(values){
    let error = {}
    const email_pattern =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (values.email==="") {
        error.email= "Email should not be empty"
    }else if (!email_pattern.test(values.email)){
        error.email = "Email does not match"
    }else {
        error.email= ""
    }

    if (values.password==="") {
        error.password= "Password should not be empty"
    }else if (!password_pattern.test(values.password)){
        error.password = "Password does not match"
    }else {
        error.password= ""
    }

   return error;
}

export default Validation;