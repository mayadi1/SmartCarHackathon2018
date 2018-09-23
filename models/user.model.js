const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CarSchema = new Schema({
    name: {type: String, required: true},
    lender: {type: String, required: false},
    smartcar_id: {type: String, required: false},
    make: {type: String, required: false},
    model: {type: String, required: false},
    year: {type: String, required: false},
    vin: {type: String, required: false}
});

let UserSchema = new Schema({
    name: {type: String, required: true, max: 100},
    password: {type: String, required: true},
    credentials: {
        accessToken: {type: String},
        refreshToken: {type: String},
        expiration: {type: String},
        refreshToken: {type: String}
    },
    cars: [CarSchema]
});

const UserModel = mongoose.model('User', UserSchema);

const get_user_by_name = function(name, callback) {
    UserModel.find({name: name}, callback);
};

const create_user = function(initial_dict, callback) {
    new UserModel(initial_dict).save(callback);
}

const upsert_user = function(initial_dict, callback) {
    get_user_by_name(initial_dict.name, function(err, docs) {
        if (docs.length && docs.length > 0) {
            UserModel.deleteOne({ name: initial_dict.name }, function (err) {
                if (err) {
                    console.error(err);
                } else {
                    create_user(initial_dict, callback);
                }
              });
        } else {
            create_user(initial_dict, callback);
        }
    });
};

const get_cars_from_user = function(user_name, callback) {
    get_user_by_name(user_name, function(err, docs) {
        if (err) {
            console.error(err);
            callback(null);
        } else if (!docs || docs.length == 0) {
            callback(null);
        } else {
            callback(docs[0].cars);
        }
    });
};

const get_car_from_user = function(user_name, car_name, callback) {
    get_cars_from_user(user_name, function(cars) {
        if (!cars || cars.length == 0) {
            callback(null);
        } else {
            for(var i=0; i<cars.length; i++) {
                if (cars[i].name == car_name) {
                    callback(cars[i]);
                    return;
                }
            }
            callback(null);
        }
    })
}

// Export the model
module.exports.UserModel = UserModel;
module.exports.get_user_by_name = get_user_by_name;
module.exports.create_user = create_user;
module.exports.get_cars_from_user = get_cars_from_user;
module.exports.get_car_from_user = get_car_from_user;
module.exports.upsert_user = upsert_user;
