const { body, validationResult } = require('express-validator');
 
exports.signupValidation = [
    body('sponsorid', 'Sponsorid is required').not().isEmpty(),
    body('platform', 'Package is required').not().isEmpty(),
    // body('username', 'Username is required').not().isEmpty(),
    body('username', 'Username must consist of 5 or more characters').isLength({ min: 5 }),
    // body('password', 'Password is required').not().isEmpty(),
    body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    body('confirm_password', 'Passwords do not match.').custom((value, {req})=>{
        if(value != req.body.password){
            return false;
        }
        return true;
    }),
    body('email', 'Please include a valid email').isEmail(),
    body('confirm_email', 'Emails do not match.').custom((value, {req})=>{
        if(value != req.body.email){
            return false;
        }
        return true;
    }),
    body('firstname', 'Firstname is required').not().isEmpty(),
    // body('lastname', 'Lastname is required').not().isEmpty(),
    body('country', 'Country is required').not().isEmpty(),
    body('phonecode', 'Phonecode is required').not().isEmpty(),
    body('phonecode', 'Phonecode must be between 1 to 4 digits long').isLength({ min: 1, max: 4 }),
    body('phonecode', 'Phonecode must be a number').isNumeric(),
    body('mobile', 'Mobile number is required').not().isEmpty(),
    body('mobile', 'Mobile number must be a number').isNumeric(),
    body('mobile', 'Mobile number must be between 6 to 11 digits.').isLength({ min: 6, max: 11 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]
 
exports.loginValidation = [
    // body('username', 'Username is required!').not().isEmpty(),
    body('email', 'Email is required!').not().isEmpty(),
    body('password', 'Password is required!').not().isEmpty(),
    body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

exports.genealogyValidation = [
    body('user_id', 'Search field is required!').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

exports.profile = [
    body('first_name', 'Firstname is required!').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('country', 'Country is required!').not().isEmpty(),
    body('phonecode', 'Phonecode is required').not().isEmpty(),
    body('phonecode', 'Phonecode must be between 1 to 4 digits long').isLength({ min: 1, max: 4 }),
    body('phonecode', 'Phonecode must be a number').isNumeric(),
    body('mobile', 'Mobile number is required').not().isEmpty(),
    body('mobile', 'Mobile number must be a number').isNumeric(),
    body('mobile', 'Mobile number must be between 6 to 11 digits.').isLength({ min: 6, max: 11 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

exports.updatePassword = [
    body('current_password', 'Current Password is required').not().isEmpty(),
    body('new_password', 'New Password must be 6 or more characters').isLength({ min: 6 }),
    body('confirm_password', 'Passwords do not match.').custom((value, {req})=>{
        if(value != req.body.new_password){
            return false;
        }
        return true;
    }),
    body('current_password', 'New Password must not be same as current password.').custom((value, {req})=>{
        if(value == req.body.new_password){
            return false;
        }
        return true;
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

exports.openTicket = [
    body('category', 'Category is required').not().isEmpty(),
    body('message', 'Message is required').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]


exports.adminPanelLogin = [
    body('username', 'Username is required').not().isEmpty(),
    body('password', 'Password is required').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]


exports.franchisePanelLogin = [
    // body('username', 'Username is required').not().isEmpty(),
    body('email', 'Email is required').isEmail(),
    body('password', 'Password is required').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

const adminPanel = {};
adminPanel.updateMember = [
    body('username', 'Username is required').not().isEmpty(),
    body('first_name', 'First name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('phonecode', 'Phonecode is required').not().isEmpty(),
    body('phonecode', 'Phonecode must be between 1 to 4 digits long').isLength({ min: 1, max: 4 }),
    body('phonecode', 'Phonecode must be a number').isNumeric(),
    body('telephone', 'Mobile number is required').not().isEmpty(),
    body('telephone', 'Mobile number must be a number').isNumeric(),
    body('telephone', 'Mobile number must be between 6 to 11 digits.').isLength({ min: 6, max: 11 }),
    // body('password', 'Password is required').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

adminPanel.updateVendor = [
    body('first_name', 'First name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('phonecode', 'Phonecode is required').not().isEmpty(),
    body('phonecode', 'Phonecode must be between 1 to 4 digits long').isLength({ min: 1, max: 4 }),
    body('phonecode', 'Phonecode must be a number').isNumeric(),
    body('telephone', 'Mobile number is required').not().isEmpty(),
    body('telephone', 'Mobile number must be a number').isNumeric(),
    body('telephone', 'Mobile number must be between 6 to 11 digits.').isLength({ min: 6, max: 11 }),
    body('company_reg_no', 'Company registration number is required').not().isEmpty(),
    body('country', 'Country is required').not().isEmpty(),
    // body('password', 'Password is required').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]


adminPanel.createVendor = [
    body('first_name', 'First name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('phonecode', 'Phonecode is required').not().isEmpty(),
    body('phonecode', 'Phonecode must be between 1 to 4 digits long').isLength({ min: 1, max: 4 }),
    body('phonecode', 'Phonecode must be a number').isNumeric(),
    body('telephone', 'Mobile number is required').not().isEmpty(),
    body('telephone', 'Mobile number must be a number').isNumeric(),
    body('telephone', 'Mobile number must be between 6 to 11 digits.').isLength({ min: 6, max: 11 }),
    body('company_reg_no', 'Company registration number is required').not().isEmpty(),
    body('country', 'Country is required').not().isEmpty(),
    body('credit_limit', 'Credit Limit is required').not().isEmpty(),
    body('commission_percent', 'Commission Percent is required').not().isEmpty(),
    body('password', 'Password is required').not().isEmpty(),
    body('service.id.*', 'Service cannot be empty').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]


adminPanel.walletManagement = [
    body('user_id', 'User id is required').not().isEmpty(),
    body('amount', 'Amount is required').not().isEmpty(),
    body('wallet', 'Wallet type is required').not().isEmpty(),
    body('action', 'Action is required(Either "add" or "subtract")').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]


adminPanel.generatePayout = [
    body('list', 'Payout list must contain atleast one element').isArray({min: 1}),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

adminPanel.createOfficialAnnoucement = [
    body('title', 'Title is required').not().isEmpty(),
    body('status', 'Status is required').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

adminPanel.createVideos = [
    body('title', 'Title is required').not().isEmpty(),
    body('link', 'Link is required').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

adminPanel.policyContent = [
    body('content', 'Content is required').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

adminPanel.userBlock = [
    body('block_status', 'Block Status is required').not().isEmpty(),
    body('member_type', 'Member Type is required').not().isEmpty(),
    body('down', 'Select either left/right/both').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

adminPanel.userWithdrawBlock = [
    body('block_status', 'Block Status is required').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]


adminPanel.ticketResponse = [
    body('response', 'Response is required').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

adminPanel.createService = [
    body('service_name', 'Service name is required').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

adminPanel.saveWithdrawalRequest = [
    body('list', 'List of users is required').isArray({min: 1}),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

exports.adminPanel = adminPanel;