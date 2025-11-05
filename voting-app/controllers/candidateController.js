const Candidate = require("../models/candidateModel");
const User = require("../models/userModel");
const passport = require("passport");
const { jwtAuthMiddleware } = require("../jwt");

const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user && user.role === "admin";
  } catch (err) {
    console.error("Role check failed:", err);
    return false;
  }
};

//get candidates
exports.getcandidates=async(req,res)=>{
   
    try{
     const candidates = await Candidate.find();
      res.status(200).json({ candidates:candidates });
    }catch(err){
      res.status(500).json({ error: "Internal Server Error" });
    }
}
  
// POST route to add a candidate
exports.addcandidate = async (req, res) => {
  try {
    if(! (await checkAdminRole(req.user.id))){
      return res.status(403).json({message:"user does not have admin role"})
    }
    const data = req.body; // Assuming the request body contains the User data
    
    const newcandidate= new Candidate(data);
       
    // Check if CNIC already exists
    const existing = await Candidate.findOne({ name: data.name });
    if (existing) {
      return res.status(400).json({ message: "candidate already exists" });
    }


    // Save the new user to the database
    const response = await newcandidate.save();
    console.log("candidate data saved");
   
    // Send response
    res.status(201).json({
      message: "User registered successfully",
      response: response,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.updatecandidate =async (req, res) => {
 
   try{
    if(! (await checkAdminRole(req.user.id))){
      return res.status(403).json({message:"user does not have admin role"})
    }
     const updatedCandidate = await Candidate.findByIdAndUpdate(req.params.candidateId,req.body,
  {
    new: true,
    runValidators: true,
  }
);

if (!updatedCandidate) {
  return res.status(404).json({ message: "Candidate not found" });
}

// ✅ Add success message
res.status(200).json({
  message: "✅ Candidate updated successfully",
  candidate: updatedCandidate
});
   }catch(err){
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
   }

    
  
};


exports.deleteCandidate = async (req, res) => {
  try {
      if(! (await checkAdminRole(req.user.id))){
      return res.status(403).json({message:"user does not have admin role"})
    }
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// make vote
exports.makevote = async (req, res) => {
  const candidateId = req.params.candidateId; // match router
  const userId = req.user.id; // use JWT to get logged-in user

  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVoted) {
      return res.status(400).json({ message: "You have already voted" });
    }

    if (user.role === "admin") {
      return res.status(401).json({ message: "Admin is not eligible to vote" });
    }

    // update candidate
    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();

    // update user
    user.isVoted = true;
    await user.save();

    res.status(200).json({ message: "You have voted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//count vote
exports.getvote = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ voteCount: -1 });
    const voteRecord = candidates.map((data) => ({
      party: data.party,
      candidate: data.candidate,
      votes: data.voteCount
    }));

    res.status(200).json(voteRecord);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
