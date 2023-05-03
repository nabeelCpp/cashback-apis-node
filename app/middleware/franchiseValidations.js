const { body, validationResult } = require('express-validator');
 
exports.updateProfile = [
    body('first_name', 'Company name is required').not().isEmpty(),
    body('company_reg_no', 'Company registration no. is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

exports.bank = [
    body('acc_name', 'Bank Account Name is required').not().isEmpty(),
    body('ac_no', 'Bank Account no. is required').not().isEmpty(),
    body('bank_nm', 'Bank name is required').not().isEmpty(),
    body('branch_nm', 'Bank Branch name is required').not().isEmpty(),
    body('swift_code', 'Swift code is required').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]