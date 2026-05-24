const mongoose = require("mongoose");

const CVSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    profileImage: String,

    contactNumber: String,
    email: { type: String, required: true },

    summary: String,
    researchStatement: String,

    qualifications: [
      {
        institution: { type: String, required: true },
        degree: String,
        fieldOfStudy: String,
        startDate: Date,
        endDate: Date,
        gpa: Number,
        description: String
      }
    ],

    certifications: [
      {
        name: String,
        issuingOrganization: String,
        issueDate: Date,
        expirationDate: Date
      }
    ],

    professionalExperience: [
      {
        company: String,
        position: String,
        startDate: Date,
        endDate: Date,
        current: { type: Boolean, default: false },
        description: String,
        achievements: [String]
      }
    ],

    skills: [String],

    languages: [
      {
        language: String,
        proficiency: {
          type: String,
          enum: ["beginner", "intermediate", "advanced", "native"]
        }
      }
    ],

    hobbies: [String],

    documents: {
      educationalCertificates: [String],
      experienceCertificates: [String],
      resumePdf: String
    }
  },
  { timestamps: true }
);
const Resume=mongoose.model("Resume",CVSchema);
module.exports=Resume;