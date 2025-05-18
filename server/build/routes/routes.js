"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRoutes = void 0;
const main_class_1 = require("../main-class");
const User_1 = require("../model/User");
const Booking_1 = require("../model/Booking");
const Groups_1 = require("../model/Groups");
const Trainers_1 = require("../model/Trainers");
const configureRoutes = (passport, router) => {
    router.get('/', (req, res) => {
        let myClass = new main_class_1.MainClass();
        res.status(200).send('Hello, World!');
    });
    router.get('/callback', (req, res) => {
        let myClass = new main_class_1.MainClass();
        myClass.monitoringCallback((error, result) => {
            if (error) {
                res.write(error);
                res.status(400).end();
            }
            else {
                res.write(result);
                res.status(200).end();
            }
        });
    });
    router.get('/promise', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let myClass = new main_class_1.MainClass();
        /* myClass.monitoringPromise().then((data: string) => {
            res.write(data);
            res.status(200).end();
        }).catch((error: string) => {
            res.write(error);
            res.status(400).end();
        }); */
        // async-await
        try {
            const data = yield myClass.monitoringPromise();
            res.write(data);
            res.status(200).end();
        }
        catch (error) {
            res.write(error);
            res.status(400).end();
        }
    }));
    router.get('/observable', (req, res) => {
        let myClass = new main_class_1.MainClass();
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        // deprecated variant
        /* myClass.monitoringObservable().subscribe((data) => {
            console.log(data);
        }, (error) => {
            console.log(error);
        }, () => {
            console.log('complete');
        }); */
        myClass.monitoringObservable().subscribe({
            next(data) {
                res.write(data);
            }, error(error) {
                res.status(400).end(error);
            }, complete() {
                res.status(200).end();
            }
        });
    });
    router.post('/login', (req, res, next) => {
        passport.authenticate('local', (error, user) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            }
            else {
                if (!user) {
                    res.status(400).send('User not found.');
                }
                else {
                    req.login(user, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server error.');
                        }
                        else {
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });
    router.post('/register', (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const address = req.body.address;
        const nickname = req.body.nickname;
        const user = new User_1.User({ email: email, password: password, name: name, address: address, nickname: nickname });
        user.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        });
    });
    router.post('/logout', (req, res) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    router.get('/checkAuth', (req, res) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        }
        else {
            res.status(500).send(false);
        }
    });
    // Get all users (admin only)
    router.get('/getAllUsers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.isAuthenticated()) {
            const user = yield User_1.User.findById(req.user);
            if (!user) {
                return res.status(404).send('User not found.');
            }
            if (!user.admin) {
                return res.status(403).send('Access denied. Admins only.');
            }
            const query = User_1.User.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    }));
    // Get user by id
    router.get('/getUser', (req, res) => {
        if (req.isAuthenticated()) {
            const query = User_1.User.findById(req.query.id);
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    // Get user profile
    router.get('/getUserProfile', (req, res) => {
        if (req.isAuthenticated()) {
            const query = User_1.User.findById(req.query.id);
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    // Update user profile
    router.put('/updateUserProfile', (req, res) => {
        if (req.isAuthenticated()) {
            const { name, email, password } = req.body;
            const updatedUser = User_1.User.findByIdAndUpdate(req.user, { name, email, password }, { new: true });
            updatedUser.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    // delete user (admin only)
    router.delete('/deleteUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.isAuthenticated()) {
            const user = yield User_1.User.findById(req.user);
            if (!user) {
                return res.status(404).send('User not found.');
            }
            if (!user.admin) {
                return res.status(403).send('Access denied. Admins only.');
            }
            const id = req.query.id;
            const query = User_1.User.deleteOne({ _id: id });
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    }));
    // get all bookings
    router.get('/bookings', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not logged in.');
        }
        try {
            const bookings = yield Booking_1.Booking.find()
                .populate('userId', 'name')
                .populate('groupId', 'name');
            res.status(200).send(bookings);
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Internal server error.');
        }
    }));
    // GET all bookings of the current user
    router.get('/my-bookings', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User not authenticated.');
        }
        try {
            const user = yield User_1.User.findById(req.user);
            if (!user) {
                return res.status(404).send('User not found.');
            }
            const userId = user._id;
            const allBookings = yield Booking_1.Booking.find()
                .populate('userId')
                .populate('groupId');
            const filtered = allBookings.filter(booking => booking.userId._id.toString() === userId.toString());
            res.status(200).json(filtered);
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    }));
    // Update booking status
    router.put('/updateBooking', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }
        const user = yield User_1.User.findById(req.user);
        if (!user) {
            return res.status(404).send('User not found.');
        }
        if (!user.admin) {
            return res.status(403).send('Access denied. Admins only.');
        }
        const bookingId = req.query.id;
        if (!bookingId) {
            return res.status(400).send('Missing booking ID.');
        }
        try {
            const updatedBooking = yield Booking_1.Booking.findByIdAndUpdate(bookingId, { status: 'confirmed' }, { new: true });
            if (!updatedBooking) {
                return res.status(404).send('Booking not found.');
            }
            res.status(200).json(updatedBooking);
        }
        catch (error) {
            console.error('Error updating booking:', error);
            res.status(500).send('Internal server error.');
        }
    }));
    // Delete booking and increase group capacity
    router.delete('/deleteBooking', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not logged in.');
        }
        try {
            const user = yield User_1.User.findById(req.user);
            if (!user) {
                return res.status(404).send('User not found.');
            }
            const bookingId = req.query.id;
            const booking = yield Booking_1.Booking.findById(bookingId);
            if (!booking) {
                return res.status(404).send('Booking not found.');
            }
            const group = yield Groups_1.Group.findById(booking.groupId);
            if (!group) {
                return res.status(404).send('Group not found.');
            }
            // Delete the booking
            yield Booking_1.Booking.deleteOne({ _id: bookingId });
            // Increase group capacity by 1
            group.capacity += 1;
            yield group.save();
            res.status(200).send({ message: 'Booking deleted and group capacity updated.' });
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Internal server error.');
        }
    }));
    // Create a new booking
    router.post('/booking', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }
        try {
            const user = yield User_1.User.findById(req.user);
            if (!user) {
                return res.status(404).send('User not found.');
            }
            const userId = user._id;
            const groupId = req.query.id;
            const group = yield Groups_1.Group.findById(groupId);
            if (!group) {
                return res.status(404).send('Group not found.');
            }
            // Check if there's capacity
            if (group.capacity <= 0) {
                return res.status(400).send('Group is full.');
            }
            // Decrease capacity by 1
            group.capacity -= 1;
            yield group.save();
            const newBooking = new Booking_1.Booking({
                userId: userId,
                groupId: groupId,
                status: "waiting",
            });
            yield newBooking.save();
            res.status(201).json(newBooking);
        }
        catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }));
    // Get all groups
    router.get('/groups', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not logged in.');
        }
        try {
            const groups = yield Groups_1.Group.find().populate('trainerId', 'name');
            res.status(200).json(groups);
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Internal server error.');
        }
    }));
    // Delete group
    router.delete('/deleteGroup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.isAuthenticated()) {
            const user = yield User_1.User.findById(req.user);
            if (!user) {
                return res.status(404).send('User not found.');
            }
            if (!user.admin) {
                return res.status(403).send('Access denied. Admins only.');
            }
            const id = req.query.id;
            const query = Groups_1.Group.deleteOne({ _id: id });
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    }));
    // Get all trainers
    router.get('/trainers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.isAuthenticated()) {
                return res.status(401).send('User is not logged in.');
            }
            const user = yield User_1.User.findById(req.user);
            if (!user) {
                return res.status(404).send('User not found.');
            }
            const trainers = yield Trainers_1.Trainer.find();
            res.status(200).json(trainers);
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Internal server error.');
        }
    }));
    // Delete trainer
    router.delete('/deleteTrainer', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.isAuthenticated()) {
            const user = yield User_1.User.findById(req.user);
            if (!user) {
                return res.status(404).send('User not found.');
            }
            if (!user.admin) {
                return res.status(403).send('Access denied. Admins only.');
            }
            const id = req.query.id;
            const query = Trainers_1.Trainer.deleteOne({ _id: id });
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    }));
    return router;
};
exports.configureRoutes = configureRoutes;
