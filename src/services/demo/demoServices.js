const db = require("../../db/models/index");
const Demo = db.demo;

const getData = async (req, res) => {
    try {
        const demo = await Demo.findAll();
        return demo
    } catch (error) {
        throw error;
    }
}

const addData = async (demo) => {
    try {
        const newDemo = await Demo.create(demo);
        return newDemo
    } catch (error) {
        throw error;
    }
}

const checkEmailExists = async (email) => {
    try {
        const emailExists = await Demo.findOne({
            where: {
                email: email
            }
        });
        return emailExists
    } catch (error) {
        throw error;
    }
}

const checkUserExists = async (id) => {
    try {
        const userExists = await Demo.findOne({
            where: {
                id: id
            }
        });
        return userExists
    } catch (error) {
        throw error;
    }
}

const updateData = async (id, demo) => {
    try {
        const updatedDemo = await Demo.update(demo, {
            where: {
                id: id
            }
        });
        return updatedDemo
    } catch (error) {
        throw error;
    }
}

const deleteData = async (id) => {
    try {
        const deletedDemo = await Demo.destroy({
            where: {
                id: id
            }
        });
        return deletedDemo
    } catch (error) {
        throw error;
    }
}

const isEmailExist = async (email) => {
    try {
        const demo = await Demo.findOne({
            where: {
                email: email
            },
            paranoid: false
        });
        return demo
    } catch (error) {
        throw error;
    }
}

const restoreData = async (id) => {
    try {
        const restoreDemo = await Demo.restore({
            where: {
                id: id
            }
        });
        return restoreDemo
    } catch (error) {
        throw error;
    }
}



module.exports = {
    getData ,
    addData ,
    updateData ,
    deleteData ,
    checkEmailExists ,
    checkUserExists ,
    isEmailExist ,
    restoreData
}