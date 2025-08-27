const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.signUp = (req, res) => {

    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email obligatoire' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Mot de passe obligatoire' });
    }

    //hash du mot de passe envoyé par l'utilisateur -> 10 passe
    bcrypt.hash(req.body.password, 10)
        //On enregistre le hash a la place du mdp original
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            //Sauvegarde dans la BDD le nouvelle utilisateur
            user.save()
                .then(() => res.status(201).json({message: 'utilisateur crée !'}))
                .catch((error) => res.status(400).json({error}))
        })
        .catch((error) => res.status(500).json({error}))
};

exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(user === null){
                res.status(401).json({message:'Paire login/mot de passe incorrecte'})
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if(!valid){
                            return es.status(401).json({message:'Paire login/mot de passe incorrecte'})
                        }
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(
                                {userId: user._id},
                                process.env.JWT_SECRET ||'RANDOM_TOKEN_SECRET',
                                {expiresIn:'24h'}
                            )
                        })
                    })
                    .catch((error) => res.status(500).json({error}))
            }
        })
        .catch(error => res.status(500).json({error}))
};
