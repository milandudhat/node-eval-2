const APIResponseFormat = require('../../utils/APIResponseFormat.js');
const DemoService = require('../../services/demo/demoServices.js');
const { _doDecrypt } = require('../../utils/encryption.js');

const EventEmitters = require('events');
const event = new EventEmitters();

event.on("getData", () => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> All Demos are fetched");
});

event.on("addData", () => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> New Demo is added");
});

event.on("updateData", () => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> Demo is updated");
});

event.on("deleteData", () => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> Demo is deleted");
});



const getData = async (req, res) => {
    event.emit("getData");
    try {
        const data = await DemoService.getData();
        return APIResponseFormat._ResDataFound(res, data);
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}

const addData = async (req, res) => {
    event.emit("addData");
    try {
        let { name, email, age } = req.body;
        // check all fields are required or not
        
        if(!name){
            return APIResponseFormat._ResMissingRequiredField(res, "Name is required");
        }
        if(!email){
            return APIResponseFormat._ResMissingRequiredField(res, "Email is required");
        }
        if(!age){
            return APIResponseFormat._ResMissingRequiredField(res, "Age is required");
        }

        // check email is valid or not
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(email)) {
            return APIResponseFormat._ResMissingRequiredField(res, "Email is not valid");
        }

        // check email is exist or not
        const isEmailExist = await DemoService.isEmailExist(email);
        if (isEmailExist) {
            // check deleted_at is null or not
            if(isEmailExist.deleted_at === null){
                return APIResponseFormat._ResDataAlreadyExists(res, "Email is already exist");
            }else{
                // restore demo
                const demo = await DemoService.restoreData(isEmailExist.id);
                if (!demo) {
                    return APIResponseFormat._ResDataNotFound(res);
                }
                return APIResponseFormat._ResDataCreated(res);
            }
        }else{
            let data = {
                name,
                email,
                age
            }
            const demo = await DemoService.addData(data);
            if (!demo) {
                return APIResponseFormat._ResDataNotFound(res);
            }
            return APIResponseFormat._ResDataFound(res, demo);
        }
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}

const updateData = async (req, res) => {
    event.emit("updateData");
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
        const updatedData = await DemoService.updateData(user_id, data);
        return APIResponseFormat._ResDataUpdated(res, updatedData);
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}

const deleteData = async (req, res) => {
    event.emit("deleteData");
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
        const deletedDemo = await DemoService.deleteData(user_id);
        return APIResponseFormat._ResDataDeleted(res, deletedDemo);
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}

module.exports = {
    getData ,
    addData ,
    updateData ,
    deleteData
}