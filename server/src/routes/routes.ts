import { Router, Request, Response, NextFunction } from 'express';
import { MainClass } from '../main-class';
import { PassportStatic } from 'passport';
import { User } from '../model/User';
import {Booking, IBookingPopulated} from "../model/Booking";
import {Group} from "../model/Groups";
import {Trainer} from "../model/Trainers";
import mongoose from "mongoose";


export const configureRoutes = (passport: PassportStatic, router: Router): Router => {

    router.get('/', (req: Request, res: Response) => {
        let myClass = new MainClass();
        res.status(200).send('Hello, World!');
    });

    router.get('/callback', (req: Request, res: Response) => {
        let myClass = new MainClass();
        myClass.monitoringCallback((error, result) => {
            if (error) {
                res.write(error);
                res.status(400).end();
            } else {
                res.write(result);
                res.status(200).end();
            }
        });
    });

    router.get('/promise', async (req: Request, res: Response) => {
        let myClass = new MainClass();
        /* myClass.monitoringPromise().then((data: string) => {
            res.write(data);
            res.status(200).end();
        }).catch((error: string) => {
            res.write(error);
            res.status(400).end();
        }); */


        // async-await
        try {
            const data = await myClass.monitoringPromise();
            res.write(data);
            res.status(200).end();
        } catch (error) {
            res.write(error);
            res.status(400).end();
        }
    });

    router.get('/observable', (req: Request, res: Response) => {
        let myClass = new MainClass();
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
            next(data: string) {
                res.write(data);
            }, error(error: string) {
                res.status(400).end(error);
            }, complete() {
                res.status(200).end();
            }
        });
    });

    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (error: string | null, user: typeof User) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                if (!user) {
                    res.status(400).send('User not found.');
                } else {
                    req.login(user, (err: string | null) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server error.');
                        } else {
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });

    router.post('/register', (req: Request, res: Response) => {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const address = req.body.address;
        const nickname = req.body.nickname;
        const user = new User({email: email, password: password, name: name, address: address, nickname: nickname});
        user.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        })
    });

    router.post('/logout', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.get('/checkAuth', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        } else {
            res.status(500).send(false);
        }
    });

    // Get all users (admin only)
    router.get('/getAllUsers', async (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const user = await User.findById(req.user);
            if (!user) {
                return res.status(404).send('User not found.');
            }

            if (!user.admin) {
                return res.status(403).send('Access denied. Admins only.');
            }
            const query = User.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    // Get user by id
    router.get('/getUser', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const query = User.findById(req.query.id);
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    })

    // Get user profile
    router.get('/getUserProfile', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const query = User.findById(req.query.id);
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    })

    // Update user profile
    router.put('/updateUserProfile', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const { name, email, password } = req.body;
            const updatedUser = User.findByIdAndUpdate(
                req.user,
                { name, email, password },
                { new: true }
            );

            updatedUser.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    })

    // delete user (admin only)
    router.delete('/deleteUser', async (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const user = await User.findById(req.user);
            if (!user) {
                return res.status(404).send('User not found.');
            }

            if (!user.admin) {
                return res.status(403).send('Access denied. Admins only.');
            }

            const id = req.query.id;
            const query = User.deleteOne({_id: id});
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    // get all bookings
    router.get('/bookings', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not logged in.');
        }

        try {
            const bookings = await Booking.find()
                .populate('userId', 'name')
                .populate('groupId', 'name');

            res.status(200).send(bookings);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error.');
        }
    });

    // GET all bookings of the current user
    router.get('/my-bookings', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User not authenticated.');
        }

        try {
            const user = await User.findById(req.user);
            if (!user) {
                return res.status(404).send('User not found.');
            }

            const userId = user._id;

            const allBookings = await Booking.find()
                .populate('userId')
                .populate('groupId') as unknown as IBookingPopulated[];

            const filtered = allBookings.filter(
                booking => booking.userId._id.toString() === userId.toString()
            );

            res.status(200).json(filtered);
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    });

    // Update booking status
    router.put('/updateBooking', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }

        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).send('User not found.');
        }

        if (!user.admin) {
            return res.status(403).send('Access denied. Admins only.');
        }

        const bookingId = req.query.id as string;

        if (!bookingId) {
            return res.status(400).send('Missing booking ID.');
        }

        try {
            const updatedBooking = await Booking.findByIdAndUpdate(
                bookingId,
                { status: 'confirmed' },
                { new: true }
            );

            if (!updatedBooking) {
                return res.status(404).send('Booking not found.');
            }

            res.status(200).json(updatedBooking);
        } catch (error) {
            console.error('Error updating booking:', error);
            res.status(500).send('Internal server error.');
        }
    });

    // Delete booking and increase group capacity
    router.delete('/deleteBooking', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not logged in.');
        }

        try {
            const user = await User.findById(req.user);
            if (!user) {
                return res.status(404).send('User not found.');
            }

            const bookingId = req.query.id;
            const booking = await Booking.findById(bookingId);

            if (!booking) {
                return res.status(404).send('Booking not found.');
            }

            const group = await Group.findById(booking.groupId);
            if (!group) {
                return res.status(404).send('Group not found.');
            }

            // Delete the booking
            await Booking.deleteOne({ _id: bookingId });

            // Increase group capacity by 1
            group.capacity += 1;
            await group.save();

            res.status(200).send({ message: 'Booking deleted and group capacity updated.' });

        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error.');
        }
    });

    // Create a new booking
    router.post('/booking', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }

        try {
            const user = await User.findById(req.user);
            if (!user) {
                return res.status(404).send('User not found.');
            }

            const userId = user._id;
            const groupId = req.query.id;

            const group = await Group.findById(groupId);
            if (!group) {
                return res.status(404).send('Group not found.');
            }

            // Check if there's capacity
            if (group.capacity <= 0) {
                return res.status(400).send('Group is full.');
            }

            // Decrease capacity by 1
            group.capacity -= 1;
            await group.save();

            const newBooking = new Booking({
                userId: userId,
                groupId: groupId,
                status: "waiting",
            });
            await newBooking.save();
            res.status(201).json(newBooking);
        } catch (error) {
            res.status(500).json({message: 'Server error', error});
        }
    });

    // Get all groups
    router.get('/groups', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not logged in.');
        }

        try {
            const groups = await Group.find().populate('trainerId', 'name');
            res.status(200).json(groups);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error.');
        }
    });

    // Delete group
    router.delete('/deleteGroup', async (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const user = await User.findById(req.user);
            if (!user) {
                return res.status(404).send('User not found.');
            }

            if (!user.admin) {
                return res.status(403).send('Access denied. Admins only.');
            }

            const id = req.query.id;
            const query = Group.deleteOne({_id: id});
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    // Get all trainers
    router.get('/trainers', async (req: Request, res: Response) => {
        try {
            if (!req.isAuthenticated()) {
                return res.status(401).send('User is not logged in.');
            }

            const user = await User.findById(req.user);
            if (!user) {
                return res.status(404).send('User not found.');
            }

            const trainers = await Trainer.find();
            res.status(200).json(trainers);

        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error.');
        }
    });

    // Delete trainer
    router.delete('/deleteTrainer', async (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const user = await User.findById(req.user);
            if (!user) {
                return res.status(404).send('User not found.');
            }

            if (!user.admin) {
                return res.status(403).send('Access denied. Admins only.');
            }

            const id = req.query.id;
            const query = Trainer.deleteOne({_id: id});
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    return router;
}