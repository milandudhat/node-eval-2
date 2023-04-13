const APIResponseFormat = require('../../utils/APIResponseFormat.js');
const DemoService = require('../../services/demo/demoServices.js');
const { _doEncrypt , _doDecrypt } = require('../../utils/encryption.js');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();



const demo = async (req, res) => {
    try {
        const demo = await DemoService.demo();
        return APIResponseFormat._ResDataFound(res, demo);
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}

const addDemo = async (req, res) => {
    try {
        const { name, age , email } = req.body;
        if(!name){
            return APIResponseFormat._ResMissingRequiredField(res, "Name is required");
        }
        if(!age){
            return APIResponseFormat._ResMissingRequiredField(res, "Age is required");
        }
        if(!email){
            return APIResponseFormat._ResMissingRequiredField(res, "Email is required");
        }
        let emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        if(!emailRegex.test(email)){
            return APIResponseFormat._ResInvalidEmail(res);
        }

        // check user exista with name or email
        const emailExists = await DemoService.checkEmailExists(email);
        if(emailExists){
            return APIResponseFormat._ResUserAlreadyExists(res);
        }
        
        const data = {
            name,
            age ,
            email
        }
        const newDemo = await DemoService.addDemo(data);
        return APIResponseFormat._ResDataCreated(res, newDemo);
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}

const updateDemo = async (req, res) => {
    try {
        let { name, age} = req.body;
        let user_id = req.header('user_id')
        if(!user_id){
            return APIResponseFormat._ResMissingRequiredField(res, "User ID is required");
        }
        user_id = _doDecrypt(user_id);

        // check user exists with id
        const userExists = await DemoService.checkUserExists(user_id);
        if(!userExists){
            return APIResponseFormat._ResUserDoesNotExist(res);
        }
        const data = {
            name,
            age ,
        }
        const updatedDemo = await DemoService.updateDemo(user_id, data);
        return APIResponseFormat._ResDataUpdated(res, updatedDemo);
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}

const deleteDemo = async (req, res) => {
    try {  
        let user_id = req.header('user_id')
        if(!user_id){
            return APIResponseFormat._ResMissingRequiredField(res, "User ID is required");
        }
        user_id = _doDecrypt(user_id);

        // check user exists
        const userExists = await DemoService.checkUserExists(user_id);
        if(!userExists){
            return APIResponseFormat._ResUserDoesNotExist(res);
        }


        const deletedDemo = await DemoService.deleteDemo(user_id);
        return APIResponseFormat._ResDataDeleted(res, deletedDemo);
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}

module.exports = {
    demo,
    addDemo,
    updateDemo,
    deleteDemo
}