const passport = require("passport");
require('../../passport');
const Project = require('./../../models/project');

const router = require('express').Router();
const test = require('./test');
const auth = require('./auth');
const user = require('./user');
const project = require('./project');
const axios = require('axios');

router.use('/test', test);
router.use('/auth', auth);
router.use('/user', user);
router.use('/project', passport.authenticate('jwt', {session: false}, function(){}), project);




router.get('/projects', (req, res) => {


    Project.find({}, function(err, projects) {
        if (!err) {
            res.status(200).json(projects);
        } else {
            console.log(err);
            res.status(400).send(err);
        }
    })
});

router.post('/users', (req, res) => {
    axios.get('https://3.basecampapi.com/3587783/people.json', {

        headers: {
            'Authorization': "Bearer " + req.body.access_token,
            'Content-Type': 'application/json',
            'User-Agent': 'Clockwork Team Management Test (clock@clockwork.com)',

        },
        data: {
            name: 'Clockwork Team Management Test'
        }


    })
        .then(function (response) {
            console.log(response.headers);
            res.status(200).json(response.data);


        })
        .catch(function (error) {
            res.status(500);
            console.log('error from api/auth:' + error);

        });
});


router.get('/', (req, res) => {
    res.status(200).json({message: 'Connected to API!'});
});

module.exports = router;
