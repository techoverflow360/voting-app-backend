const express = require('express');
const router = express.Router();
const Candidate = require('../model/candidate');
const User = require('../model/user');

// these are performed by users that are ADMIN : the authenticationMiddleware checks only the token, not that the user is admin or voter 
// kuki admin vala kam bs isi route me hoga to agr ham yaha ek middleware lagade for checking admin or not to route me jane se pehle authorization ho jaega 
// since hamne already authenticate kr rkha hai to req me user id present hai : take it from there and find the user 
const authorizingAdminUser = async (req, res, next) => {
    // get payload and use userid -> fetch user -> check the role -> if not admin return and if admin next -> handle the errors accordingly
    try {
        const payload = req.user;
        const userid = payload._id;
        const user = await User.findById(userid);
        if(!user) res.status(401).json({error: 'User not found !'});
        if(user.role === 'admin') return next();
        res.status(401).json({ error: 'Voter cannot perform these operations !'}); 
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error !'});
    }
}

router.get('/', async (req, res) => {
    try {
        const candidates = await Candidate.find({});
        if(!candidates) return res.status(401).json({ error: 'Candidates Not found !'});
        res.status(200).json({ candidates: candidates, message: 'Candidates Found !'});
    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error !'});
    }
})

// voting routes : this is not controlled by admins 
router.post('/vote/:candidateId', async (req, res) => {
    try {
        const id = req.params.candidateId;
        const userid = req.user._id;
        const user = await User.findById(userid);
        if(user.role === 'admin') return res.status(404).json({ error : 'Admin cannot vote !'});
        if(user.isVoted) return res.status(404).json({ error : 'User has already voted !'});
        const candidate = await Candidate.findById(id);
        if(!candidate) return res.status(404).json({ error : 'Candidate not found !'});
        candidate.votes.push({ user: userid, votedAt: Date.now() });
        candidate.voteCount++;
        await candidate.save();
        user.isVoted = true;
        await user.save();
        console.log('Voted !');
        res.status(200).json({ message: 'Voted !'});
    }catch(err){
        console.log(err);
        res.status(500).json({ error : 'Invalid Server Error !'});
    }
})

// counting the votes
router.get('/vote/count', async (req, res) => {
    try{
        const candidates = await Candidate.find({}).sort({voteCount: 'desc'});
        // map the array
        const record = candidates.map(candidate => {
            return { name : candidate.party, voteCount: candidate.voteCount };
        });
        return res.status(200).json({ data : record });
    }catch(err){
        console.log(err);
        res.status(500).json({ error : 'Internal Server Error !'});
    }
})


// if the user passes this middleware then only he can do these task 
app.use(authorizingAdminUser());

// POST to add a new candidate by admin user
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const candidate = new Candidate(data);
        const response = await candidate.save();
        console.log('Candidate created !');
        res.status(200).json({ response : response, message: 'Candidate Created !'});
    }catch(err){
        console.log(err);
        res.status(500).json({ error : 'Internal Server Error !'});
    }
})

router.put('/:candidateId', async (req, res) => {
    try {
        const id = req.params.candidateId;
        const data = req.body;
        const newCandidate = await Candidate.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
        if(!newCandidate) return res.status(404).json({ error : 'Candidate not found !'});
        console.log('Candidate Data updated !');
        res.status(200).json({ response : newCandidate });
    }catch(err){
        console.log(err);
        res.status(500).json({ error : 'Invalid Server Error !'});
    }
})

router.delete('/:candidateId', async (req, res) => {
    try {
        const id = req.params.candidateId;
        const response = await Candidate.findByIdAndDelete(id);
        if(!response) return res.status(404).json({ error : 'Candidate not found !'});
        console.log('Candidate deleted !');
        res.status(200).json({ message: 'Candidate deletion successful !'});
    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error !'});
    }
})



module.exports = router;